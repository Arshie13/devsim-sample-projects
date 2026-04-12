# MongoDB Replica Set Setup Script
# Run this PowerShell script as Administrator

Write-Host "Setting up MongoDB as a replica set..." -ForegroundColor Cyan

# Stop MongoDB service if running
Write-Host "Stopping MongoDB service..." -ForegroundColor Yellow
Stop-Service MongoDB -ErrorAction SilentlyContinue

# Get MongoDB data directory
$dataDir = "C:\Program Files\MongoDB\Server\8.0\data"
if (Test-Path "C:\Program Files\MongoDB\Server\7.0\data") {
    $dataDir = "C:\Program Files\MongoDB\Server\7.0\data"
} elseif (Test-Path "C:\Program Files\MongoDB\Server\6.0\data") {
    $dataDir = "C:\Program Files\MongoDB\Server\6.0\data"
}

Write-Host "Data directory: $dataDir" -ForegroundColor Yellow

# Create replica set config
$replicaSetConfig = @"
replication:
  replSetName: "rs0"
"@

# Create mongod.cfg backup
$cfgBackup = "$dataDir\mongod.cfg.backup"
if (Test-Path "$dataDir\mongod.cfg") {
    Copy-Item "$dataDir\mongod.cfg" $cfgBackup
}

# Update mongod.cfg
$cfgPath = "$dataDir\mongod.cfg"
$currentCfg = Get-Content $cfgPath -Raw -ErrorAction SilentlyContinue

if ($currentCfg -notmatch "replication:") {
    Add-Content -Path $cfgPath -Value $replicaSetConfig
    Write-Host "Updated mongod.cfg with replica set config" -ForegroundColor Green
} else {
    Write-Host "Replica set config already exists" -ForegroundColor Yellow
}

# Start MongoDB service
Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
Start-Service MongoDB

Write-Host "`nMongoDB replica set setup complete!" -ForegroundColor Green
Write-Host "Connection string: mongodb://127.0.0.1:27017/?replicaSet=rs0" -ForegroundColor Cyan