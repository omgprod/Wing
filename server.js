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

app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.enable('trust proxy');

/* Server Main */
app.get('/', (req, res) => {
    let parcel = parcelController.parcelTreatment(fileToTreat);
    //console.log('parcel ' + JSON.stringify(parcel));
    res.status(200).render('index', {
        parcel: parcel,
    });
});

app.listen(port, ip, () => {
    console.log("Server is launch on http://" + ip + ":" + port);
});
