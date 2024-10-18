const express = require('express');
const cors = require("cors");
const fetch = require("node-fetch"); // Remplacement de axios par node-fetch
const app = express();

app.use(express.json()); // Ajout pour traiter les requêtes avec corps JSON

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// Route pour authentification avec l'API Orange
app.post('/api/oauth/token', (req, res) => {
    console.log(req.body.token);

    const url = 'https://api.orange.com/oauth/v3/token';
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${req.body.token}`,
            'Content-Type': 'application/json'
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
    const smsData = req.body;
    const url = 'https://api.orange.com/smsmessaging/v1/outbound/tel:+243899429957/requests';

    // Envoyer la requête POST avec node-fetch
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${smsData.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "outboundSMSMessageRequest": {
                "address": `tel:${smsData.telephone}`,
                "senderAddress": `tel:+243899429957`,
                "outboundSMSTextMessage": {
                    "message": smsData.message // Correction pour prendre en compte le message envoyé dans le corps de la requête
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
