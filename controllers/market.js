'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/market');
const logging = require('../lib/logging');
const router = express.Router();


router.get('/list', (req, res) => {
    model.listMarkets()
    .then(object =>{
        res.status(200).send(object);
    });
});

router.post('/add', (req, res) => {
    if(!req.body.market){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        model.addMarket(req.body.market);
        res.status(200).send(constants.responseMessages.success);
    }
});

router.post('/delete/:market', (req, res) => {
    if(!req.params.market){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteMarket(req.params.market)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;