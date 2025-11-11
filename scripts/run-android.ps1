param(
  [string]$Avd = ''
)

$ErrorActionPreference = 'Stop'

function Find-Java17 {
  $cands = @('C:\Program Files\Eclipse Adoptium','C:\Program Files\Java')
  foreach ($p in $cands) {
    if (Test-Path $p) {
      $jdk = Get-ChildItem $p -Directory -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'jdk-17' } | Select-Object -First 1
      if ($jdk) { return $jdk.FullName }
    }
  }
  throw 'Java 17 JDK not found.'
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

$env:JAVA_HOME = Find-Java17
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:Path = "$sdk\platform-tools;$sdk\emulator;$sdk\tools;$sdk\tools\bin;$env:JAVA_HOME\bin;" + $env:Path

if ($Avd -ne '') {
  Write-Host "Starting emulator: $Avd"
  Start-Process -FilePath (Join-Path $sdk 'emulator\emulator.exe') -ArgumentList @('-avd',$Avd,'-netdelay','none','-netspeed','full') -WindowStyle Minimized
}

Write-Host 'Ensuring a device is connected...'
& adb wait-for-device

Write-Host 'Starting Metro bundler...'
Start-Process -FilePath powershell -ArgumentList '-NoProfile','-Command','npm start' -WorkingDirectory $root -WindowStyle Minimized

Write-Host 'Installing debug build...'
Push-Location "$root\android"
& .\gradlew.bat installDebug -x lint -x test --console=plain
Pop-Location

Write-Host 'Launching app...'
& adb shell am start -n com.quotespace.app/.MainActivity

