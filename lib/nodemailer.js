const nodeMailer = require("nodemailer");
require("dotenv").config();

exports.transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signupMailOptions = (name, email) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Signup confirmation to ExpressShop",
    html: `
  <h1>Hello ${name}!</h1>
  <p>You have successfully signup in ExpressShope.</p>
  <p>List you unused product to sell and buy products in Cheap!</p>
  <p>Most importantly, save the earth!</p>
  <h4>Best Regards</h4>
  <p>ExpressShope</p>
  `,
  };
};

exports.resetPasswordMailOptions = (name, email, token, url) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset password for account in ExpressShop",
    html: `
  <h1>Hello ${name}!</h1>
  <p>
  You have requested a link to reset your passwor for your account in
  ExpressShop.
</p>
<p>
This link will be valied only for 5 minutes.
</p>
<a  href="${url}/${token}">Please click this link to reset your password.</a>
  <p>List you unused product to sell and buy products in Cheap!</p>
  <p>Most importantly, save the earth!</p>
  <h4>Best Regards</h4>
  <p>ExpressShope</p>
  `,
  };
};
