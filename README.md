# Favoured Family Regional Shift Competition - Audition Portal

An audition submissions portal built with Next.js, Firebase, and Zeptomail for the Favoured Family Regional Shift Competition (March 27-28, 2026).

## Features

### User Submission Form
- **Personal Information**: First name, last name, email, phone number
- **Church Information**: Region (20 or 51), province, parish name, parish pastor name
- **Audition Details**: Video upload and personal description
- **Payment**: Upload payment proof
- **Email Notifications**: Automatic confirmation emails sent via Zeptomail
- **No Editing**: Submissions are final (cannot be edited after submission)

### Admin Dashboard
- **View All Submissions**: Complete list with filtering and search
- **Status Management**: Pending, Reviewed, Selected, Rejected
- **Statistics**: Real-time counts of submissions by status
- **Detailed View**: Full submission details including video and payment proof
- **Secure Access**: Password-protected admin area

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Email**: Zeptomail
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Set up Storage rules (allow read/write for authenticated users)
5. Create a web app and copy the configuration
6. Generate a service account key for admin SDK:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

### 3. Zeptomail Setup

1. Sign up at [https://www.zoho.com/zeptomail](https://www.zoho.com/zeptomail)
2. Verify your domain
3. Generate an API key from Settings > API

### 4. Environment Variables

Create a `.env.local` file in the root directory and add your credentials:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"

# Zeptomail Configuration
ZEPTOMAIL_API_KEY=your_zeptomail_api_key
ZEPTOMAIL_FROM_EMAIL=noreply@yourdomain.com
ZEPTOMAIL_FROM_NAME=Favoured Family Regional Shift Competition

# Admin Credentials
ADMIN_PASSWORD=your_secure_admin_password
```

**Important**: 
- Replace all placeholder values with your actual credentials
- For `FIREBASE_ADMIN_PRIVATE_KEY`, make sure to keep the quotes and include `\n` for line breaks
- Never commit `.env.local` to version control

### 5. Firestore Database Structure

The application creates a `submissions` collection with the following structure:

```javascript
{
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  region: "Region 20" | "Region 51",
  province: string,
  parishName: string,
  parishPastorName: string,
  description: string,
  auditionVideoUrl: string,
  paymentProofUrl: string,
  submittedAt: timestamp,
  status: "pending" | "reviewed" | "selected" | "rejected",
  notes: string (optional)
}
```

### 6. Firebase Storage Rules

Add these rules to your Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /auditions/{submissionId}/{fileName} {
      allow read: if true;
      allow write: if request.resource.size < 500 * 1024 * 1024; // 500MB limit
    }
  }
}
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Applicants

1. Navigate to the home page
2. Click "Submit Your Audition"
3. Fill out all required fields:
   - Personal information
   - Church information
   - Description (minimum 50 characters)
   - Upload audition video (MP4, MOV, or AVI)
   - Upload payment proof (JPG, PNG, or PDF)
4. Review information carefully (cannot be edited after submission)
5. Submit the form
6. Receive confirmation email with submission ID

### For Admins

1. Navigate to `/admin`
2. Enter the admin password
3. View all submissions with:
   - Filter by status
   - Search by name, email, or region
   - View statistics
4. Click "View Details" on any submission to:
   - See all information
   - Watch audition video
   - View payment proof
   - Update submission status

## Admin Access

Default admin password can be set in `.env.local` file. For production:
- Use a strong, unique password
- Consider implementing proper authentication (Firebase Auth)
- Add IP whitelisting if needed

## File Upload Limits

- **Audition Video**: Max 500MB (MP4, MOV, AVI)
- **Payment Proof**: Max 10MB (JPG, PNG, PDF)

## Event Information

- **Event Name**: Favoured Family Regional Shift Competition
- **Semi-Final**: March 27, 2026 (15 participants)
- **Final**: March 28, 2026 (6 finalists)
- **Regions**: Region 20 and Region 51

## Color Theme

- **Primary**: Green (#16a34a, #15803d)
- **Secondary**: Orange (#ea580c, #c2410c)
- **Used throughout**: Headers, buttons, accents, and gradients

## Production Deployment

### Recommended Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Firebase Hosting**

### Pre-Deployment Checklist
- [ ] Set all environment variables in your hosting platform
- [ ] Update Firebase Storage rules
- [ ] Test email sending with real credentials
- [ ] Set a strong admin password
- [ ] Test file uploads with actual files
- [ ] Verify domain for Zeptomail
- [ ] Test on mobile devices

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables in the Vercel dashboard.

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Admin Password**: Use a strong password and consider implementing proper authentication
3. **Firebase Rules**: Set appropriate read/write rules for Firestore and Storage
4. **File Uploads**: Validate file types and sizes on both client and server
5. **Email API Key**: Keep Zeptomail API key secure

## Troubleshooting

### Email Not Sending
- Verify Zeptomail API key is correct
- Check domain verification status
- Review Zeptomail dashboard for error logs
- Ensure `ZEPTOMAIL_FROM_EMAIL` is using a verified domain

### File Upload Fails
- Check Firebase Storage rules
- Verify file size limits
- Ensure Firebase Storage is enabled
- Check browser console for errors

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` in `.env.local`
- Clear browser cache/session storage
- Check browser console for errors

### Submissions Not Appearing
- Verify Firestore is enabled
- Check Firestore rules
- Review browser network tab for API errors
- Ensure Firebase credentials are correct

## Support

For issues or questions:
1. Check the Firebase Console for errors
2. Review Zeptomail dashboard for email delivery status
3. Check browser console for client-side errors
4. Review server logs for API errors

## License

This project is created for the Favoured Family Regional Shift Competition.

---

**Built with ❤️ for the Favoured Family Regional Shift Competition 2026**

