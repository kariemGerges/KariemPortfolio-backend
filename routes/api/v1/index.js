require('dotenv').config();
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');


/* GET home page. */
router.get('/', (req,res) =>{

  res.send('server-backend is running');

});

// sgMail

sgMail.setApiKey(process.env.sendGrid_API_KEY)

router.post('/send', async(req, res) => {

  const { email, name, message } = req.body;

  console.log('request body: ', req.body);


  if (!name || !email || !message) {

    console.log('Missing required fields' + ' ' + name + email + message);

    return res.status(400).send('Missing required fields');
  }

    const msg = {
        to: process.env.Email,
        from: process.env.sgEmail,
        subject: `${name} has sent you a message`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>`
    };

    try {
      await sgMail.send(msg);
      res.status(200).send('Email sent successfully');
      console.log('Email sent successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
      console.log('Error sending email');
    }


});




module.exports = router;
