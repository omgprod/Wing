/* Require the JSON files & functions files */
const items = require('./JSON/items');
const orders = require('./JSON/orders');
const fileToTreat = Object.assign(items, orders);
const parcelController = require('./Controller/parcelController');

/* Setting up the server */
const ip = '127.0.0.1';
const port = 8000;
const fs = require('fs'); // useless ?
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.enable('trust proxy');

/* Server Main */
app.get('/', (req, res) => {
    parcelController.parcelTreatment(fileToTreat);
    res.status(200).sendFile(path.join(__dirname+'/view/index.html'));
});

app.listen(port, ip, () => {
    console.log("Server is launch on http://" + ip + ":" + port);
});
