import nodemailer from "nodemailer";

/**
 * Create a reusable transporter
 * Supports Gmail, Brevo, or any SMTP provider via env vars
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send an email
 */
export const sendEmail = async ({ to, subject, html }) => {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
        from: `"Maa Ki Rasoi 🍲" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
};

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Build a styled OTP email template
 */
export const otpEmailTemplate = (name, otp) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fefdf8; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: linear-gradient(135deg, #22c55e, #15803d); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🍲 Maa Ki Rasoi</h1>
      <p style="color: #dcfce7; margin-top: 4px; font-size: 13px;">Homemade with Love</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1a1a2e; margin: 0 0 12px;">Verify Your Email</h2>
      <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
        Hello <strong>${name}</strong>,<br/>
        Use the code below to verify your email address.
      </p>
      <div style="background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #15803d;">${otp}</span>
      </div>
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        This code expires in <strong>5 minutes</strong>. If you didn't request this, ignore this email.
      </p>
    </div>
    <div style="background: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Maa Ki Rasoi. All rights reserved.</p>
    </div>
  </div>
`;
