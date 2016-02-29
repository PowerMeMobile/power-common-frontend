Write-Host "git push ..."
git push --porcelain

if($lastexitcode -eq 0){
    Write-Host "git fetch ..."
    git fetch --tags
    $lastVersion = git describe --abbrev=0
    Write-Host "Latest version is: $lastVersion"

    do {
         $ver = Read-Host "Enter new version"
    } until ([regex]::IsMatch($ver, "^(\d+\.){2}\d+"))

    try{
        Write-Host "Enter description(optional):"
        $description = ""
        do {
            $i = Read-Host ">"
            if( -not [string]::IsNullOrEmpty($i)){ $description += "`n" + $i }
        } until ([string]::IsNullOrEmpty($i))

        if([string]::IsNullOrEmpty($description)){
            git tag $ver
        } else {
            git tag $ver -m "$description"
        }

        git push
        git push --tags
    } catch {
        Write-Host "Update failed!"
        throw
        exit 1
    }
} else {
    Write-Host "Can't push! Please merge manually."
    exit 1
}