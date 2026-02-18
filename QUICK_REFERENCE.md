# Quick Reference Guide

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint
```

## 🌐 URLs

- **Home**: http://localhost:3000
- **Submit Form**: http://localhost:3000/submit
- **Admin Dashboard**: http://localhost:3000/admin
- **Success Page**: http://localhost:3000/success

## 🔑 Environment Variables Checklist

Make sure these are set in `.env.local`:

```
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
✅ FIREBASE_ADMIN_PROJECT_ID
✅ FIREBASE_ADMIN_CLIENT_EMAIL
✅ FIREBASE_ADMIN_PRIVATE_KEY
✅ ZEPTOMAIL_API_KEY
✅ ZEPTOMAIL_FROM_EMAIL
✅ ZEPTOMAIL_FROM_NAME
✅ ADMIN_PASSWORD
```

## 📝 Form Fields Reference

### Personal Information
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone Number (required)

### Church Information
- Region (dropdown: Region 20 / Region 51)
- Province (text)
- Parish Name (text)
- Parish Pastor Name (text)

### Audition Details
- Description (textarea, min 50 characters)
- Audition Video (MP4, MOV, AVI - max 500MB)
- Payment Proof (JPG, PNG, PDF - max 10MB)

## 📊 Submission Statuses

| Status | Description | Color |
|--------|-------------|-------|
| `pending` | Just submitted, waiting for review | Yellow |
| `reviewed` | Admin has reviewed the submission | Blue |
| `selected` | Selected for semi-final/final | Green |
| `rejected` | Not selected | Red |

## 🔥 Firebase Structure

### Firestore Collections
```
submissions/
  ├── {submissionId}/
  │   ├── firstName
  │   ├── lastName
  │   ├── email
  │   ├── ... (all fields)
  │   └── status
```

### Storage Structure
```
auditions/
  ├── {submissionId}/
  │   ├── video.mp4 (or .mov, .avi)
  │   └── payment.jpg (or .png, .pdf)
```

## 📧 Email Configuration

### Test Email (Without Domain)
Use Zeptomail's test email:
```
ZEPTOMAIL_FROM_EMAIL=test@zeptomail.com
```

### Production Email (With Verified Domain)
```
ZEPTOMAIL_FROM_EMAIL=noreply@yourdomain.com
```

## 🛠️ Common Troubleshooting

### Installation Issues
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues
1. Check environment variables
2. Verify Firebase project exists
3. Enable Firestore and Storage

### Email Not Sending
1. Check Zeptomail API key
2. Verify domain (if using custom domain)
3. Check Zeptomail dashboard for errors

### File Upload Fails
1. Check Firebase Storage rules
2. Verify file size limits
3. Check file type restrictions

### Admin Login Issues
1. Clear browser session storage
2. Verify ADMIN_PASSWORD in .env.local
3. Restart dev server

## 📱 Testing Checklist

### Before Launch
- [ ] Test form submission with all fields
- [ ] Upload test video (small file first)
- [ ] Upload test payment proof
- [ ] Verify email received
- [ ] Check submission in Firestore
- [ ] Check files in Storage
- [ ] Test admin login
- [ ] View submission in admin dashboard
- [ ] Update submission status
- [ ] Test on mobile device
- [ ] Test on different browsers

## 🎨 Color Reference

### Brand Colors (RGB)
```css
/* Green */
--green-600: #16a34a
--green-700: #15803d
--green-50: #f0fdf4

/* Orange */
--orange-600: #ea580c
--orange-700: #c2410c
--orange-50: #fff7ed
```

### Usage
- **Headers**: Green gradient
- **Primary Actions**: Green buttons
- **Secondary Actions**: Orange buttons
- **Backgrounds**: Green-orange gradient
- **Alerts/Warnings**: Orange

## 📂 File Locations

### Pages
- Home: `app/page.tsx`
- Submit Form: `app/submit/page.tsx`
- Success: `app/success/page.tsx`
- Admin: `app/admin/page.tsx`

### API Routes
- Submit: `app/api/submit/route.ts`
- Send Email: `app/api/send-email/route.ts`
- Get Submissions: `app/api/admin/submissions/route.ts`
- Update Status: `app/api/admin/update-status/route.ts`

### Configuration
- Firebase: `lib/firebase.ts`
- Types: `lib/types.ts`
- Environment: `.env.local`

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
# Go to Vercel Dashboard > Project > Settings > Environment Variables
# Add all variables from .env.local

# Deploy to production
vercel --prod
```

## 💾 Backup & Export

### Export Firestore Data
Use Firebase Console:
1. Go to Firestore Database
2. Click Export data
3. Choose Cloud Storage bucket
4. Export

### Export as CSV (Manual)
From admin dashboard:
1. View submissions
2. Copy data to spreadsheet
3. Save as CSV

## 🔒 Security Best Practices

### Production Checklist
- [ ] Use strong admin password (16+ characters)
- [ ] Update Firebase Security Rules
- [ ] Use HTTPS only
- [ ] Never commit .env.local
- [ ] Rotate API keys regularly
- [ ] Monitor Firebase usage
- [ ] Enable Firebase App Check (optional)

### Recommended Firebase Rules

**Firestore**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
    }
  }
}
```

**Storage**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /auditions/{submissionId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.resource.size < 500 * 1024 * 1024;
    }
  }
}
```

## 📞 Support Resources

- **Firebase Console**: https://console.firebase.google.com
- **Zeptomail Dashboard**: https://mailadmin.zoho.com/zeptomail
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## ⚡ Performance Tips

1. **Optimize Images**: Use Next.js Image component for images
2. **Lazy Loading**: Components load only when needed
3. **Caching**: Firebase SDK caches data automatically
4. **CDN**: Vercel provides automatic CDN
5. **Compression**: Enable in production build

## 📊 Usage Limits (Free Tier)

### Firebase (Spark Plan)
- **Storage**: 1GB
- **Data Transfer**: 10GB/month
- **Firestore Reads**: 50,000/day
- **Firestore Writes**: 20,000/day

### Zeptomail (Free Plan)
- **Emails**: 10,000/month
- **Validity**: Forever

### Upgrade When Needed
- Monitor usage in respective dashboards
- Upgrade before hitting limits
- Set up billing alerts

---

**Quick tip**: Bookmark this file for easy reference during development! 📌
