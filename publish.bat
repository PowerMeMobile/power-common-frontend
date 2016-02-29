@echo off
cd %~dp0
PowerShell.exe -ExecutionPolicy Unrestricted -File BumpVersion.ps1
::PowerShell.exe -Command "& {Start-Process PowerShell.exe -ArgumentList '-ExecutionPolicy Bypass -File ""BumpVersion.ps1""'}"
pause