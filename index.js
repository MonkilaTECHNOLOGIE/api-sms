const express = require('express');
const cors = require("cors");
const axios = require("axios");
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.post('/api/oauth/token', (req, res) => {

    console.log(req.body.token);

    const url = 'https://api.orange.com/oauth/v3/token';
    axios.post(url, {
    }, {
        headers: {
            'Authorization': `Basic ${req.body.token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            res.status(200).json({ message: 'Authentification avec succès', data: response.data });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erreur d\'authentification', error });
        });

});

app.post('/sms', (req, res) => {
    const smsData = req.body;

    const axios = require('axios');
    const url = 'https://api.orange.com/smsmessaging/v1/outbound/tel:+243899429957/requests';

    axios.post(url, {
        "outboundSMSMessageRequest": {
            "address": `tel:${smsData.telephone}`,
            "senderAddress": `tel:+243899429957`,
            "outboundSMSTextMessage": {
                "message": msg
            }
        }
    }, {
        headers: {
            'Authorization': `Bearer ${smsData.token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            res.status(200).json({ message: 'SMS envoyé avec succès', data: response.data });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'SMS', error });
        });
}
);


app.listen(8000, () => {
    console.log('Server is running on port 3000');
});
