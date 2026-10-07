@echo off
REM Review the LinkedIn drafts and schedule the ones you approve.
REM Double-click this file. Nothing is posted unless you type y for that post.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Approve-LinkedInPosts.ps1"
