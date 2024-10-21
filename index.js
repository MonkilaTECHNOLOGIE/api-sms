const express = require('express');
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');

var corsOptions = {
    origin: "*"
};

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));

// Route pour authentification avec l'API Orange
app.post('/api/oauth/token', (req, res) => {

    const url = 'https://api.orange.com/oauth/v3/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');

    let token = req.body.token;

    fetch(url, {
        method: 'POST',
        body: data.toString(),
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        }
    })
        .then(response => response.json())
        .then(data => {
            res.status(200).json({ message: 'Authentification avec succès', data: data });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erreur d\'authentification', error });
        });
});

// Route pour envoyer des SMS via l'API Orange
app.post('/sms', (req, res) => {

    let telephone = req.body.telephone;
    let message = req.body.message;
    let token = req.body.token;
    let sender =  req.body.sender;

    const url = `https://api.orange.com/smsmessaging/v1/outbound/tel:+${sender}/requests`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            "outboundSMSMessageRequest": {
                "address": `tel:+${telephone}`,
                "senderAddress": `tel:+${sender}`,
                "outboundSMSTextMessage": {
                    "message": `${message}`
                }
            }
        })
    })
        .then(response => response.json())
        .then(data => {
            res.status(200).json({ message: 'SMS envoyé avec succès', data: data });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'SMS', error });
        });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
