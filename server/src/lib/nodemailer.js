const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  },
  host: 'smtp.gmail.com',
  service: 'gmail'
});

const mailer = async ({ subject, html, to, text }) => {
  await transport.sendMail({
    subject: subject || 'From My App',
    html: html || '<h1> Hello There </h1>',
    text: text || 'Need Check!',
    to: to || 'dummyman1896@gmail.com',
  })
}

module.exports = mailer;