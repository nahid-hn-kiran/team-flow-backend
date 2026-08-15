/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import status from "http-status";
import path from "node:path";
import ejs from "ejs";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/env";

const transporter = nodemailer.createTransport({
  host: envVars.email.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.email.EMAIL_SENDER_SMTP_USER,
    pass: envVars.email.EMAIL_SENDER_SMTP_PASS,
  },
  port: Number(envVars.email.EMAIL_SENDER_SMTP_PORT),
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.email.EMAIL_SENDER_SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error: any) {
    console.log("Email Sending Error", error.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
