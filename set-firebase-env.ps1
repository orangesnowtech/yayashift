# Script to set environment variables in Firebase App Hosting
# Run this script to configure your production environment

Write-Host "Setting up Firebase App Hosting environment variables..." -ForegroundColor Green

# ZeptoMail Configuration
firebase apphosting:secrets:set ZEPTOMAIL_API_KEY --data-file=- --force
# When prompted, paste: Zoho-enczapikey wSsVR61y+xH0Ca54mTyoJuxpkFpdUwunRB543Fvy7HCoSqvG9sc7kkeaAwauG/UbEGRsHTAW9bx6yk0H2jcP3dh/nAxTACiF9mqRe1U4J3x17qnvhDzDXGtekxCOLIkLxgtvm2NoG84h+g==

firebase apphosting:secrets:set ZEPTOMAIL_FROM_EMAIL --data-file=-
# When prompted, paste: noreply@favoredfamilyyaya.org

firebase apphosting:secrets:set ZEPTOMAIL_FROM_NAME --data-file=-
# When prompted, paste: Favoured Family Regional Shift Competition

Write-Host "`nEnvironment variables configured!" -ForegroundColor Green
Write-Host "Note: You may need to redeploy your app for changes to take effect." -ForegroundColor Yellow
