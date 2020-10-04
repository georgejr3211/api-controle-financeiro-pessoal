import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';

export async function sendEmail(emails: string | string[], subject: string, text: string, html: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  try {
    await sgMail.send({
      to: emails,
      from: '"Financys 👻" <financys@tuamaeaquelaursa.com>',
      subject,
      text,
      html,
    });

    console.log('Email enviado com sucesso!');

  } catch (error) {
    console.log('error', error.response.body);
  }

  // const info = await transporter.sendMail();

}
