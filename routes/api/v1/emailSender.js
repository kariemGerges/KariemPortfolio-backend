require('dotenv').config();
const express = require('express');
const router = express.Router();
const brevo = require('@getbrevo/brevo');

// Configure Brevo API key
const client = brevo.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.brevo_API_KEY;

// Get home route
router.get('/router', (req, res) => {
    res.send('server-backend is running');
});

// Send email
router.post('/sendNew', async (req, res) => {
    const { FirstName, LastName, email, message } = req.body;
    const name = `${FirstName} ${LastName}`;
    // console.log('Request body:', req.body);

    if (!name || !email || !message) {
        // console.log('Missing required fields:', name, email, message);
        return res.status(400).send('Missing required fields');
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `New contact from ${name}`;
    sendSmtpEmail.htmlContent = `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${message}`;
    sendSmtpEmail.sender = { "name" : name, "email": process.env.Email };
    sendSmtpEmail.to = [{ email: "kariem.gerges@outlook.com" }];
        
    try {
        const apiInstance = new brevo.TransactionalEmailsApi();
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('Error details:', error.response.body);
        }
        res.status(500).send('Error sending email');
    }
});

module.exports = router;
