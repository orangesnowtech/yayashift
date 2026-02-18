# Quick Setup Guide

Follow these steps to get your audition portal running:

## Step 1: Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "yayashift-auditions")
4. Follow the setup wizard

### Enable Firestore Database
1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Start in **production mode**
4. Choose your location (select closest to your users)

### Enable Firebase Storage
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Start in **production mode**
4. Use default location

### Update Firestore Rules
1. Go to Firestore Database → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click "Publish"

### Update Storage Rules
1. Go to Storage → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /auditions/{submissionId}/{fileName} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```
3. Click "Publish"

### Get Firebase Web Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web (</> icon)
4. Register app with nickname (e.g., "Web App")
5. Copy the configuration values

### Get Admin SDK Credentials
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Keep it secure (don't commit to git!)

## Step 2: Zeptomail Setup

### Create Account
1. Go to [Zoho Zeptomail](https://www.zoho.com/zeptomail)
2. Sign up for free account
3. Verify your email

### Add and Verify Domain
1. Go to Settings → Email Configuration
2. Click "Add Domain"
3. Enter your domain (e.g., yourdomain.com)
4. Follow DNS verification steps:
   - Add TXT record to your DNS
   - Add DKIM records
   - Wait for verification (can take up to 48 hours)

### Generate API Key
1. Go to Settings → API
2. Click "Add API Key"
3. Give it a name (e.g., "Audition Portal")
4. Copy the API key

### Alternative: Use Zeptomail Email for Testing
If you don't have a domain yet:
1. You can use Zeptomail's test domain
2. Emails will have "via zeptomail.com" in the sender
3. Good for testing, but get a real domain for production

## Step 3: Configure Environment Variables

### Update .env.local
Open `.env.local` file and fill in your values:

```env
# From Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123

# From Firebase Admin SDK JSON file
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"

# From Zeptomail
ZEPTOMAIL_API_KEY=your_zeptomail_api_key
ZEPTOMAIL_FROM_EMAIL=noreply@yourdomain.com
ZEPTOMAIL_FROM_NAME=Favoured Family Regional Shift Competition

# Set your own admin password
ADMIN_PASSWORD=YourSecurePassword123!
```

**Important Notes:**
- For `FIREBASE_ADMIN_PRIVATE_KEY`: Copy the `private_key` value from your downloaded JSON file
- Keep the quotes around the private key
- Replace `\n` with actual `\n` characters (don't remove them)
- Never share or commit this file to git

## Step 4: Install and Run

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

### Test User Submission
1. Go to http://localhost:3000
2. Click "Submit Your Audition"
3. Fill out the form with test data
4. Upload small test files
5. Submit and check for confirmation email

### Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Enter your admin password
3. Verify you can see the test submission
4. Try updating the status

### Check Firebase Console
1. Go to Firestore Database
2. You should see a `submissions` collection
3. Check Storage for uploaded files

### Check Zeptomail Dashboard
1. Go to Zeptomail dashboard
2. Check "Sent Emails" section
3. Verify email was delivered

## Troubleshooting

### Firebase Connection Issues
- **Error**: "Firebase not initialized"
- **Fix**: Check all NEXT_PUBLIC_FIREBASE_ variables in .env.local
- **Fix**: Make sure Firebase project is created and services are enabled

### File Upload Fails
- **Error**: "Permission denied"
- **Fix**: Update Storage rules to allow write access
- **Fix**: Make sure Storage is enabled in Firebase Console

### Email Not Sending
- **Error**: "Email service not configured"
- **Fix**: Verify ZEPTOMAIL_API_KEY is correct
- **Fix**: Check domain verification status
- **Fix**: For testing, use a Zeptomail test account

### Admin Login Not Working
- **Error**: "Invalid password"
- **Fix**: Check ADMIN_PASSWORD in .env.local
- **Fix**: Clear browser session storage
- **Fix**: Restart dev server after changing .env.local

### "Module not found" Errors
- **Fix**: Run `npm install` again
- **Fix**: Delete `node_modules` and `package-lock.json`, then run `npm install`

## Next Steps

### Before Going Live

1. **Get a Custom Domain**
   - Purchase domain from provider (Namecheap, GoDaddy, etc.)
   - Verify with Zeptomail
   - Update from email address

2. **Set Strong Admin Password**
   - Use at least 16 characters
   - Include uppercase, lowercase, numbers, symbols
   - Store securely

3. **Test on Mobile Devices**
   - Test form submission
   - Verify file uploads work
   - Check email appearance

4. **Prepare for Launch**
   - Test with real video files
   - Verify storage space in Firebase
   - Monitor Zeptomail email quota

### Deployment Options

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```
- Follow prompts
- Add environment variables in Vercel dashboard
- Deploy automatically on git push

**Option 2: Netlify**
- Connect GitHub repository
- Add environment variables
- Deploy

**Option 3: Firebase Hosting**
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Firestore and Storage enabled with proper rules
- [ ] Zeptomail account created and domain verified
- [ ] All environment variables set correctly
- [ ] Test submission completed successfully
- [ ] Admin dashboard accessible and functional
- [ ] Email notifications working
- [ ] Mobile responsive design tested
- [ ] Strong admin password set
- [ ] Deployment platform chosen
- [ ] Domain purchased and configured (if needed)

## Support Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Zeptomail Docs**: https://www.zoho.com/zeptomail/help/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## Getting Help

If you encounter issues:

1. Check browser console for errors (F12)
2. Check Firebase Console for service issues
3. Check Zeptomail dashboard for email errors
4. Review server logs in terminal
5. Make sure all environment variables are set correctly

---

Good luck with your Favoured Family Regional Shift Competition! 🎉
