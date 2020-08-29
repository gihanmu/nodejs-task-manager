const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
  const content = {
    to: email,
    from: 'gihanmu@gmail.com',
    subject: 'Welcome to Task Manager',
    html: 'Welcome to Task Manager <a href="https://www.w3schools.com/tags/tag_a.asp">Verify your email</a>',
  };
  sgMail.send(content).catch(console.log);

}

module.exports = {
  sendWelcomeEmail
}