import nodemailer from "nodemailer";

const sendEmail = async (email, subject, html) => {
  const { SMTP_USER, SMTP_PASS } = process.env;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const options = {
    from: SMTP_USER,
    to: email,
    subject: subject,
    html: html,
  };

  return await transporter.sendMail(options);
};

export default sendEmail;
