<#
.SYNOPSIS
  Shows each LinkedIn draft in full and schedules only the ones the owner approves.

.DESCRIPTION
  The human step between the drafts job and the publisher. For every draft with
  status: draft, dated today or later, in date and slot order:

    y  schedule it for its slot (the AdsPilot-Worker task publishes it then)
    n  reject it (kept on disk, marked rejected, never posted)
    s  skip for now (stays a draft)
    q  stop

  Scheduling goes through the Social-Publisher CLI with --publish and --at, the
  same path every other scheduled post uses. If the slot time has already
  passed, it offers 15 minutes from now instead of silently posting late.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$OpsRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Config  = Get-Content (Join-Path $OpsRoot 'config.json') -Raw | ConvertFrom-Json
$Content = $Config.contentRoot
$Drafts  = Join-Path $Content 'drafts'
$Posted  = Join-Path $Content $Config.postsLog
$Logs    = Join-Path $OpsRoot 'logs'
New-Item -ItemType Directory -Force -Path $Logs | Out-Null
$RunLog  = Join-Path $Logs ("approve-{0}.txt" -f (Get-Date -Format 'yyyy-MM-dd'))
$Utf8    = New-Object System.Text.UTF8Encoding($false)

function Write-Log {
    param([string]$Message)
    Add-Content -Path $RunLog -Value ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $Message) -Encoding utf8
}

function Read-Draft {
    param([string]$Path)
    $raw = [IO.File]::ReadAllText($Path, $Utf8)
    $m = [regex]::Match($raw, '^\uFEFF?---\r?\n(.*?)\r?\n---\r?\n(.*)$', 'Singleline')
    if (-not $m.Success) { return $null }
    $front = @{}
    foreach ($line in ($m.Groups[1].Value -split '\r?\n')) {
        $kv = [regex]::Match($line, '^([A-Za-z_]+):\s*(.*)$')
        if ($kv.Success) { $front[$kv.Groups[1].Value] = $kv.Groups[2].Value.Trim().Trim('"', "'") }
    }
    [pscustomobject]@{ Path = $Path; Raw = $raw; Front = $front; Body = $m.Groups[2].Value.Trim() }
}

function Set-Status {
    param($Draft, [string]$Status, [string]$Extra = '')
    $new = [regex]::Replace($Draft.Raw, '(?m)^status:\s*\S+', "status: $Status$Extra", 1)
    [IO.File]::WriteAllText($Draft.Path, $new, $Utf8)
}

$today = (Get-Date).ToString('yyyy-MM-dd')
$slotOrder = @($Config.slots.PSObject.Properties.Name)
$queue = Get-ChildItem $Drafts -Filter '*.md' | ForEach-Object { Read-Draft $_.FullName } |
    Where-Object { $_ -and $_.Front.status -eq 'draft' -and $_.Front.date -ge $today } |
    Sort-Object { $_.Front.date }, { [array]::IndexOf($slotOrder, $_.Front.slot) }

if (-not $queue) {
    Write-Host "`n  No drafts waiting for review.`n"
    Read-Host '  Press Enter to close'
    exit 0
}

Write-Host ("`n  {0} draft(s) waiting. Nothing is posted unless you type y.`n" -f @($queue).Count)

foreach ($d in $queue) {
    $time = $d.Front.time_pkt
    if (-not $time) { $time = $Config.slots.($d.Front.slot) }
    if (-not $time) {
        Write-Host "  $(Split-Path $d.Path -Leaf): no time for slot '$($d.Front.slot)' in config.json. Skipped." -ForegroundColor Yellow
        continue
    }
    # Only plain text goes through the publisher. Images need a file the draft
    # does not have yet, and LinkedIn documents and video are posted by hand.
    $name = Split-Path $d.Path -Leaf
    if ($d.Front.format -ne 'text') {
        Write-Host ("  {0}: '{1}' - post this one by hand in LinkedIn. Needs: {2}" -f $name, $d.Front.format, $d.Front.assets_needed) -ForegroundColor Yellow
        continue
    }
    if ($d.Body -match '\[OWNER' -or $d.Body -match '(?m)^#{1,6} ') {
        Write-Host "  ${name}: has an [OWNER: ...] gap or a heading in the post text. Fill it in the file first." -ForegroundColor Yellow
        continue
    }
    $at = [DateTimeOffset]::Parse("$($d.Front.date)T$time`:00$($Config.utcOffset)")
    $late = $at -lt [DateTimeOffset]::Now
    if ($late) { $at = [DateTimeOffset]::Now.AddMinutes(15) }

    Write-Host ('=' * 72)
    Write-Host ("  {0}  {1}  ({2}, {3})" -f $d.Front.date, $d.Front.slot, $d.Front.pillar, $d.Front.format) -ForegroundColor Cyan
    Write-Host ("  {0} characters" -f $d.Body.Length)
    if ($d.Body.Length -gt 3000) { Write-Host '  OVER LinkedIn''s 3,000 limit - reject or edit it.' -ForegroundColor Red }
    Write-Host ('-' * 72)
    Write-Host $d.Body
    Write-Host ('-' * 72)
    $when = $at.ToString('ddd dd MMM HH:mm') + ' Pakistan time'
    if ($late) { Write-Host '  Its slot has passed; it would go out 15 minutes from now instead.' -ForegroundColor Yellow }

    $answer = (Read-Host "  Schedule for $when ? [y]es / [n]o, reject / [s]kip / [q]uit").Trim().ToLower()
    switch ($answer) {
        'y' {
            $bodyFile = [IO.Path]::GetTempFileName()
            [IO.File]::WriteAllText($bodyFile, $d.Body, $Utf8)
            Push-Location $Config.cliRoot
            try {
                $out = & node --experimental-strip-types src/post.ts --text-file $bodyFile --platform $Config.platform --at $at.ToString('o') --publish 2>&1
                $code = $LASTEXITCODE
            } finally { Pop-Location; Remove-Item $bodyFile -ErrorAction SilentlyContinue }
            $out | ForEach-Object { Write-Host "    $_" }
            if ($code -eq 0) {
                Set-Status $d 'scheduled' "`nscheduled_for: $($at.ToString('o'))"
                Add-Content -Path $Posted -Encoding utf8 -Value ("- {0} {1} scheduled for {2}: {3}" -f $d.Front.date, $d.Front.slot, $at.ToString('o'), (Split-Path $d.Path -Leaf))
                Write-Log "scheduled $(Split-Path $d.Path -Leaf) for $($at.ToString('o'))"
                Write-Host '  Scheduled.' -ForegroundColor Green
            } else {
                Write-Log "FAILED to schedule $(Split-Path $d.Path -Leaf): exit $code"
                Write-Host '  NOT scheduled - the publisher refused. The draft is unchanged.' -ForegroundColor Red
            }
        }
        'n' {
            Set-Status $d 'rejected'
            Write-Log "rejected $(Split-Path $d.Path -Leaf)"
            Write-Host '  Rejected. It will not be posted.' -ForegroundColor Yellow
        }
        'q' { Write-Host '  Stopped.'; break }
        default { Write-Host '  Skipped; still a draft.' }
    }
    if ($answer -eq 'q') { break }
}

Write-Host "`n  Scheduled posts are published by the AdsPilot-Worker task within 5 minutes of their time."
Read-Host '  Press Enter to close'
