// import fetch from 'node-fetch';

const express = require('express');
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// Route pour authentification avec l'API Orange
app.post('/api/oauth/token', (req, res) => {

    const url = 'https://api.orange.com/oauth/v3/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');

    fetch(url, {
        method: 'POST',
        body: data.toString(),
        headers: {
            'Authorization': 'Basic Y0Nka1R6dm5rY3NmeEJ0QXVuWVJ0d0hTOFlKTThXYWw6WXRLOHNuazJIU1g1NVV1Zg==',
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
app.post('/sms/:telephone/:message/:token', (req, res) => {
    const url = 'https://api.orange.com/smsmessaging/v1/outbound/tel:+243899429957/requests';

    console.log(req.params.telephone);

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${req.params.token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            "outboundSMSMessageRequest": {
                "address": `tel:+${req.params.telephone}`,
                "senderAddress": 'tel:+243899429957',
                "outboundSMSTextMessage": {
                    "message": `${req.params.message}`
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
