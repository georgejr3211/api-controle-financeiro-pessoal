import * as nodemailer from 'nodemailer';

export async function sendEmail(email: string | string[], subject: string, text: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Financys 👻" <financys@gmail.com>',
    to: email,
    subject,
    text,
    html,
  });

  console.log(info);
}
