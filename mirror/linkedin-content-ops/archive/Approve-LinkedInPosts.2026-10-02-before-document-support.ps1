<#
.SYNOPSIS
  Shows each LinkedIn draft in full and schedules only the ones the owner approves.

.DESCRIPTION
  The human step between the drafts job and the publisher. For every draft with
  status: draft, dated today or later, in date and slot order:

    y  schedule it for its slot (the AdsPilot-Worker task publishes it then)
    n  reject it (kept on disk, marked rejected, never posted)
    s  skip for now (stays a draft)
    o  open its image first, then answer (image posts only)
    q  stop

  Scheduling goes through the Social-Publisher CLI with --publish and --at, the
  same path every other scheduled post uses. If the slot time has already
  passed, it offers 15 minutes from now instead of silently posting late.

  What can be scheduled here:
    format: text            the post text alone
    format: text + image    the post text plus the file in the draft's image:
                            field, passed with --image (the CLI uploads it so
                            the worker can post it later)
  Everything else is listed as "post this one by hand": documents (their
  document: PDF and document_title: are shown), video, and a text + image
  draft whose image file is missing.

  The post text is the body after the frontmatter. When the body has a
  "## Post text" heading, only the text under it, up to the next "## "
  heading, is posted. Slide notes and other sections are never sent.
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
    $lines = @($m.Groups[1].Value -split '\r?\n')
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $kv = [regex]::Match($lines[$i], '^([A-Za-z_]+):\s*(.*)$')
        if (-not $kv.Success) { continue }
        $value = $kv.Groups[2].Value.Trim()
        if ($value -match '^[>|][+-]?$') {
            # A YAML block (key: > or key: |): the value is the indented lines below.
            $block = New-Object System.Collections.Generic.List[string]
            while ($i + 1 -lt $lines.Count -and ($lines[$i + 1] -match '^\s' -or $lines[$i + 1] -eq '')) {
                $i++
                if ($lines[$i].Trim()) { $block.Add($lines[$i].Trim()) }
            }
            $sep = ' '
            if ($value.StartsWith('|')) { $sep = "`n" }
            $front[$kv.Groups[1].Value] = $block -join $sep
        } else {
            $front[$kv.Groups[1].Value] = $value.Trim('"', "'")
        }
    }
    [pscustomobject]@{ Path = $Path; Raw = $raw; Front = $front; Body = $m.Groups[2].Value.Trim() }
}

function Get-PostText {
    # The text that is posted. With a "## Post text" heading, only the text under
    # it up to the next "## " heading; otherwise the whole body.
    param([string]$Body)
    $start = [regex]::Match($Body, '(?im)^##[ \t]+Post text[ \t]*\r?$')
    if (-not $start.Success) { return $Body.Trim() }
    $rest = $Body.Substring($start.Index + $start.Length)
    $next = [regex]::Match($rest, '(?m)^##[ \t]')
    if ($next.Success) { $rest = $rest.Substring(0, $next.Index) }
    return $rest.Trim()
}

function Resolve-DraftFile {
    # A path from the frontmatter: absolute, or relative to the draft's folder.
    param([string]$DraftPath, [string]$Value)
    if (-not $Value) { return $null }
    $p = $Value
    try {
        if (-not [IO.Path]::IsPathRooted($p)) { $p = Join-Path (Split-Path -Parent $DraftPath) $p }
        return [IO.Path]::GetFullPath($p)
    } catch {
        return $Value
    }
}

function Get-DraftPlan {
    # What the review does with one draft:
    #   text    schedule the post text
    #   image   schedule the post text with --image
    #   hand    not posted from here; Notes say what is there
    #   refuse  needs a fix in the file first; Reason says why
    param($Draft)
    # File types the Social-Publisher CLI accepts for --image (post.ts MIME_BY_EXT).
    $imageTypes = @('.png', '.jpg', '.jpeg', '.gif', '.webp')
    $format = [string]$Draft.Front.format
    $plan = [pscustomobject]@{
        Name          = (Split-Path $Draft.Path -Leaf)
        Kind          = 'text'
        Reason        = ''
        Notes         = @()
        Post          = (Get-PostText $Draft.Body)
        Image         = $null
        Document      = (Resolve-DraftFile $Draft.Path $Draft.Front.document)
        DocumentTitle = $Draft.Front.document_title
    }
    $notes = New-Object System.Collections.Generic.List[string]
    if ($plan.Document) {
        $missing = ''
        if (-not (Test-Path -LiteralPath $plan.Document -PathType Leaf)) { $missing = '   (file not found)' }
        $notes.Add("PDF:   $($plan.Document)$missing")
    }
    if ($plan.DocumentTitle) { $notes.Add("Title: $($plan.DocumentTitle)") }

    if ($format -like 'text + image*') {
        $img = Resolve-DraftFile $Draft.Path $Draft.Front.image
        if (-not $img) {
            $plan.Kind = 'hand'
            $notes.Add('No image: field in the draft. To post it as text only, change format: to text.')
        } elseif (-not (Test-Path -LiteralPath $img -PathType Leaf)) {
            $plan.Kind = 'hand'
            $notes.Add("Image file not found: $img")
        } elseif ($imageTypes -notcontains [IO.Path]::GetExtension($img).ToLower()) {
            $plan.Kind = 'hand'
            $notes.Add("Not an image type the publisher takes ($($imageTypes -join ' ')): $img")
        } else {
            $plan.Kind = 'image'
            $plan.Image = $img
        }
    } elseif ($format -ne 'text') {
        $plan.Kind = 'hand'
    }
    if ($plan.Kind -eq 'hand' -and $plan.Document) { $notes.Add("Post text: $($plan.Post.Length) characters") }
    $plan.Notes = $notes.ToArray()
    if ($plan.Kind -eq 'hand') { return $plan }

    if ($Draft.Body -match '\[OWNER' -or $plan.Post -match '(?m)^#{1,6} ') {
        $plan.Kind = 'refuse'
        $plan.Reason = 'has an [OWNER: ...] gap or a heading in the post text. Fill it in the file first.'
    } elseif (-not $plan.Post) {
        $plan.Kind = 'refuse'
        $plan.Reason = 'has no post text. Fill it in the file first.'
    }
    return $plan
}

function Get-PostArgs {
    # Arguments for node, run from the CLI folder.
    param([string]$TextFile, [string]$Platform, [DateTimeOffset]$At, [string]$Image)
    $list = @('--experimental-strip-types', 'src/post.ts', '--text-file', $TextFile, '--platform', $Platform, '--at', $At.ToString('o'))
    if ($Image) { $list += @('--image', $Image) }
    $list += '--publish'
    return $list
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
    # Text, and text + image with its image file, go through the publisher.
    # LinkedIn documents and video are posted by hand.
    $plan = Get-DraftPlan $d
    $name = $plan.Name
    if ($plan.Kind -eq 'hand') {
        Write-Host ("  {0}: '{1}' - post this one by hand in LinkedIn. Needs: {2}" -f $name, $d.Front.format, $d.Front.assets_needed) -ForegroundColor Yellow
        foreach ($note in $plan.Notes) { Write-Host "      $note" -ForegroundColor Yellow }
        continue
    }
    if ($plan.Kind -eq 'refuse') {
        Write-Host "  ${name}: $($plan.Reason)" -ForegroundColor Yellow
        continue
    }
    $post = $plan.Post
    $at = [DateTimeOffset]::Parse("$($d.Front.date)T$time`:00$($Config.utcOffset)")
    $late = $at -lt [DateTimeOffset]::Now
    if ($late) { $at = [DateTimeOffset]::Now.AddMinutes(15) }

    Write-Host ('=' * 72)
    Write-Host ("  {0}  {1}  ({2}, {3})" -f $d.Front.date, $d.Front.slot, $d.Front.pillar, $d.Front.format) -ForegroundColor Cyan
    Write-Host ("  {0} characters" -f $post.Length)
    if ($post.Length -gt 3000) { Write-Host '  OVER LinkedIn''s 3,000 limit - reject or edit it.' -ForegroundColor Red }
    Write-Host ('-' * 72)
    Write-Host $post
    Write-Host ('-' * 72)
    if ($plan.Image) {
        Write-Host ("  Image: {0}  ({1:N0} KB)" -f $plan.Image, ((Get-Item -LiteralPath $plan.Image).Length / 1KB)) -ForegroundColor Cyan
    }
    if ($d.Front.check_before_posting) {
        Write-Host "  Check before posting: $($d.Front.check_before_posting)" -ForegroundColor Yellow
    }
    $when = $at.ToString('ddd dd MMM HH:mm') + ' Pakistan time'
    if ($late) { Write-Host '  Its slot has passed; it would go out 15 minutes from now instead.' -ForegroundColor Yellow }

    $choices = '[y]es / [n]o, reject / [s]kip / [q]uit'
    if ($plan.Image) { $choices = '[y]es / [n]o, reject / [s]kip / [o]pen image / [q]uit' }
    do {
        $answer = (Read-Host "  Schedule for $when ? $choices").Trim().ToLower()
        if ($answer -eq 'o' -and $plan.Image) { Invoke-Item -LiteralPath $plan.Image }
    } while ($answer -eq 'o' -and $plan.Image)
    switch ($answer) {
        'y' {
            $bodyFile = [IO.Path]::GetTempFileName()
            [IO.File]::WriteAllText($bodyFile, $post, $Utf8)
            $cliArgs = Get-PostArgs -TextFile $bodyFile -Platform $Config.platform -At $at -Image $plan.Image
            Push-Location $Config.cliRoot
            # The CLI prints its refusals on stderr. Under 'Stop', Windows PowerShell
            # turns the first stderr line into a terminating error and the review
            # ends there; 'Continue' keeps it as output, shown below with the rest.
            $eap = $ErrorActionPreference
            $ErrorActionPreference = 'Continue'
            try {
                $out = & node @cliArgs 2>&1
                $code = $LASTEXITCODE
            } finally {
                $ErrorActionPreference = $eap
                Pop-Location
                Remove-Item $bodyFile -ErrorAction SilentlyContinue
            }
            $out | ForEach-Object { Write-Host "    $_" }
            $with = ''
            if ($plan.Image) { $with = " with image $($plan.Image)" }
            if ($code -eq 0) {
                Set-Status $d 'scheduled' "`nscheduled_for: $($at.ToString('o'))"
                Add-Content -Path $Posted -Encoding utf8 -Value ("- {0} {1} scheduled for {2}: {3}" -f $d.Front.date, $d.Front.slot, $at.ToString('o'), (Split-Path $d.Path -Leaf))
                Write-Log "scheduled $(Split-Path $d.Path -Leaf) for $($at.ToString('o'))$with"
                Write-Host '  Scheduled.' -ForegroundColor Green
            } else {
                Write-Log "FAILED to schedule $(Split-Path $d.Path -Leaf)$($with): exit $code"
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
