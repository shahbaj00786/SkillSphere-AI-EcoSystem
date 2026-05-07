import nodemailer from 'nodemailer';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: env.smtp.user,
    to,
    subject,
    html: body,
  });
  return response;
};

// email templates
const emailVerificationTemplate = (name, verificationUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${name},</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="background-color: #4F46E5; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
      <br/>
      <p>Thanks,<br/>SkillSphere Team</p>
    </div>
  `;
};

const passwordResetTemplate = (name, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${name},</h2>
      <p>You requested a password reset. Click the button below:</p>
      <a href="${resetUrl}" 
         style="background-color: #4F46E5; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, ignore this email.</p>
      <br/>
      <p>Thanks,<br/>SkillSphere Team</p>
    </div>
  `;
};

const proposalAcceptedTemplate = (name, gigTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${name},</h2>
      <p>Great news! Your proposal for <strong>${gigTitle}</strong> has been accepted.</p>
      <p>Login to SkillSphere to get started.</p>
      <br/>
      <p>Thanks,<br/>SkillSphere Team</p>
    </div>
  `;
};

export {
  sendEmail,
  emailVerificationTemplate,
  passwordResetTemplate,
  proposalAcceptedTemplate,
};