# Firebase App Hosting - Setup Secrets Script
# Run this script to set up all secrets for deployment
# Usage: .\setup-secrets.ps1 -BackendId YOUR_BACKEND_ID

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendId
)

Write-Host "🔐 Setting up Firebase App Hosting Secrets..." -ForegroundColor Green
Write-Host ""

# Secrets to create
$secrets = @{
    "FIREBASE_ADMIN_PROJECT_ID" = "yayashift"
    "FIREBASE_ADMIN_CLIENT_EMAIL" = "firebase-adminsdk-fbsvc@yayashift.iam.gserviceaccount.com"
    "FIREBASE_ADMIN_PRIVATE_KEY" = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuWE+Aw1fP57dk\nW2yyDXuy47jjEtum3zg9USbGg5RXqTcF3XHt9jYoVJKb3k5TZqj/qx4tuafLPcGE\nDlfQDV0fuB81ri6hKE5JhOMqQ/fMoaWWi8uKBxLizYJ/cWAoRTJjX+WxdUMEtKk7\n9ilsOJX874uAG/bCEVOvRVa6X/WhgK34iLm/3DCsf9hCrpODaDySWNNs8/SYABvq\nzzifhvQbxMhhipMVIpqt0Ymc1e/sXnnrcy6wCYLluqpKTedRHlyMj9UMx1Ds9s5d\nDv0zv9FfgQkmheSS/go7yrDlkU1o0GA5DIUReuGz2lYBcIudIK6bmKPrNbBYDQCm\ndis7jSZ1AgMBAAECggEAD5Z2uUD942lIxNDFxZ+d/S8OE0NW3zMbAKR2To5qH3JS\nKJSVgJygV/fDyerU3vERUBaZEqaEQZAqcqejo0bmmhTouXBy29bSNRGMC/XavHGB\ncBXco2Ehh6SvM7zLx530NN1YmIau8MdEUEegiXv/sQcr1k7pv400Cbot2GkG+aL1\nTHb8Fv6RgJR3mCM3b/3qCYft9fJ/MImJsT2khdI2FVJ7BRcdj6Zicn9XTAdq6bjA\nYQsiPHl/Wu034P4O+AC9snmqJOdOyeCJQ3OT9k6qJR5U/lIGXHXf+Re57lERKul9\njwUZetvDvSEHv1qsKbC2V2WTEiw1gsT7jnhHZI8LIQKBgQDif1fXBTlfhIul+TmX\nlL5XdUl+p+77iKA6tpydJ2jUL5LnjEfl8qXext/jNEF+fAz41uBq5zafvwQjP+P8\nGhXxLgjZT769F8YCWv+zS6qf6hCBUfeSb06StJRumDYPHNZ3e2nrg2FyQKvLhLs7\nhcrnwbJjCbC0HKdpIwRhwZVpxQKBgQDFDeuXYxMqUgGwXvXow+XbnQdQfk83tato\nws7lVAqkrCSU5a6PveTdPhelsX0X7yoR4InL0ZLHsg7mA1EgZ5AiATZIf5BsHFjV\nGJa1dDCyrjy7RK9SDXsQYMzKey/hyODVH6Vq9jkgxPUM+LmdlLVNkE7IVIU9SXcY\n4X5rWp+E8QKBgBOc6VNSPXya8qjFowoQNEdIfbu8+QHI++75nygwoHA3SmZIjHVK\nBLj8yahX/w/f2BO4L6iyKtW8abRPtQNAkwPWc6e1sxOWumu7y4aQF89PKmy4V1LT\n1p73ih7liVDXs26XPj3Jm6eUGAxAiyIFXOOirzrKPQXrsUd2Y8u/QpvtAoGBAILZ\n9oqlqLFemW6D8GmrxDQsNxI1fecxhOxhCEByqUqmYPha+KrM33Am7k8B6F5/W4FZ\niEdHGF/xFkGZDEMnYieihGhqBP41aKvA0zsVN80/NGbqej1TZFgA35zJZodY/Cuq\nAw9fB5qCD3OYqrFAcZBa9mXC8mM7KJHmEyu4ltsRAoGBAJ8wLbJu4HS6Yc4nBjNb\njyUymOA1TTlCjTwgzfKiOpLc7gXwNQh+XP3Ihux/k38W9geeH/Y5380gAMNKY5yN\nNrSbRWtt2xm4MYj7lxJKIRQZr128Ghs/7xFiwxZq7oBN5IH4PS8Ip0KAaojl5rWT\n2QGe1CQ6Jl5cxTw64svPqxeb\n-----END PRIVATE KEY-----\n"
    "ZEPTOMAIL_API_KEY" = "Zoho-enczapikey wSsVR60i80SkD6h1nWGocuo5nVoDBgunQ0R12wah7Sf4HvvB98cywhfLDAfzG/gZFjJpHWNBo757mBtU1TcL29Usm1wAXiiF9mqRe1U4J3x17qnvhDzPXWpclheILIIBwQVjkmNiFMwi+g=="
    "ZEPTOMAIL_FROM_EMAIL" = "noreply@dximarketing.com"
    "ZEPTOMAIL_FROM_NAME" = "Favoured Family Regional Shift Competition"
}

# Optional: Zeptomail API Key (set this if you have it)
$zeptomailKey = ""  # Already set above

Write-Host "Step 1: Creating secrets in Secret Manager..." -ForegroundColor Yellow
Write-Host ""

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "Creating secret: $($secret.Key)" -ForegroundColor Cyan
    $secret.Value | firebase apphosting:secrets:set $secret.Key
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Created $($secret.Key)" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create $($secret.Key)" -ForegroundColor Red
    }
    Write-Host ""
}

# Handle Zeptomail API Key separately
Write-Host "Creating secret: ZEPTOMAIL_API_KEY" -ForegroundColor Cyan
if ($zeptomailKey) {
    $zeptomailKey | firebase apphosting:secrets:set ZEPTOMAIL_API_KEY
} else {
    Write-Host "Enter your Zeptomail API Key (or press Enter to use placeholder):" -ForegroundColor Yellow
    firebase apphosting:secrets:set ZEPTOMAIL_API_KEY
}
Write-Host ""

Write-Host "Step 2: Granting access to secrets for backend: $BackendId" -ForegroundColor Yellow
Write-Host ""

$allSecrets = $secrets.Keys + @("ZEPTOMAIL_API_KEY")

foreach ($secretName in $allSecrets) {
    Write-Host "Granting access to: $secretName" -ForegroundColor Cyan
    firebase apphosting:secrets:grantaccess $secretName --backend $BackendId
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Granted access to $secretName" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to grant access to $secretName" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure Firestore and Storage are enabled in Firebase Console"
Write-Host "2. Run: firebase deploy --only hosting" -ForegroundColor Cyan
Write-Host "3. Or push to your connected Git repo for automatic deployment"
Write-Host ""
