import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'BakeStatements <noreply@bakestatements.com>',
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d97706;">Welcome to BakeStatements!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666;">${verificationUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
    </div>
  `;
  return sendEmail(email, 'Verify Your Email - BakeStatements', html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d97706;">Reset Your Password</h2>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666;">${resetUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail(email, 'Password Reset Request - BakeStatements', html);
};

export const sendEnquiryNotification = async (userEmail: string, enquiryDetails: any) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d97706;">New Enquiry Received!</h2>
      <p>You have received a new enquiry from your website:</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${enquiryDetails.name}</p>
        <p><strong>Email:</strong> ${enquiryDetails.email}</p>
        <p><strong>Phone:</strong> ${enquiryDetails.phone || 'Not provided'}</p>
        <p><strong>Event Date:</strong> ${enquiryDetails.event_date || 'Not specified'}</p>
        <p><strong>Guest Count:</strong> ${enquiryDetails.guest_count || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${enquiryDetails.message}</p>
      </div>
      <p>Log in to your dashboard to respond to this enquiry.</p>
    </div>
  `;
  return sendEmail(userEmail, 'New Enquiry - BakeStatements', html);
};
