# Email Configuration Guide

This guide explains how to configure email credentials for your contact form to work with real email providers.

## Environment Variables

Create a `.env` file in your project root with the appropriate configuration for your email provider.

## 📧 Email Provider Options

### 1. Gmail (Recommended for personal projects)

**Steps to set up Gmail:**

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Copy the generated 16-character password

3. **Add to your `.env` file:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
NODE_ENV=production
```

### 2. Outlook/Hotmail

**Add to your `.env` file:**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
NODE_ENV=production
```

### 3. SendGrid (Recommended for production)

**Steps to set up SendGrid:**

1. **Create a SendGrid account** at [https://sendgrid.com](https://sendgrid.com)
2. **Generate an API Key:**
   - Go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Add to your `.env` file:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
NODE_ENV=production
```

### 4. Custom SMTP (Any email provider)

**For other email providers (hosting providers, custom domains, etc.):**

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
NODE_ENV=production
```

**Common SMTP settings:**
- **Secure connection (SSL/TLS):** Set `EMAIL_SECURE=true` and `EMAIL_PORT=465`
- **Non-secure connection:** Set `EMAIL_SECURE=false` and `EMAIL_PORT=587`

### 5. Development Mode

**For development/testing, leave EMAIL_SERVICE unset or use:**
```env
EMAIL_SERVICE=ethereal
NODE_ENV=development
```

This will use Ethereal Email (fake SMTP) and log preview URLs to the console.

## 🛠️ Setup Instructions

1. **Create a `.env` file** in your project root:
   ```bash
   touch .env
   ```

2. **Add your chosen configuration** from the options above

3. **Install dotenv** (if not already installed):
   ```bash
   npm install dotenv
   ```

4. **Restart your server:**
   ```bash
   npm run start:dev
   ```

## 🔒 Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use App Passwords** for Gmail instead of your regular password
3. **Use API Keys** for services like SendGrid instead of passwords
4. **Set strong passwords** and enable 2FA where possible
5. **Use environment variables** in production hosting (Heroku, Vercel, etc.)

## 🚀 Production Deployment

For production hosting platforms:

### Heroku
```bash
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set NODE_ENV=production
```

### Vercel
Add environment variables in your Vercel dashboard under Settings > Environment Variables.

### Railway/DigitalOcean/AWS
Set environment variables in your hosting platform's dashboard.

## 🧪 Testing Your Configuration

1. **Start your server:**
   ```bash
   npm run start:dev
   ```

2. **Test the contact form** from your React frontend

3. **Check the console** for success/error messages

4. **For Ethereal Email (development):** Check the console for preview URLs to see your test emails

## 📝 Troubleshooting

### Common Issues:

1. **"Invalid login" errors:**
   - Use App Passwords for Gmail, not your regular password
   - Check that 2FA is enabled for Gmail
   - Verify your email and password are correct

2. **"Connection timeout" errors:**
   - Check your EMAIL_HOST and EMAIL_PORT settings
   - Verify your network allows SMTP connections

3. **"Authentication failed" errors:**
   - Double-check your credentials
   - For SendGrid, ensure your API key has Mail Send permissions

4. **Emails not being received:**
   - Check spam/junk folders
   - Verify the "to" email address is correct
   - For SendGrid, verify your sender identity

## 📞 Support

If you're still having issues:
1. Check the console logs for detailed error messages
2. Verify your email provider's SMTP settings
3. Test with Ethereal Email first to ensure the code works
4. Contact your email provider's support for SMTP-specific issues










