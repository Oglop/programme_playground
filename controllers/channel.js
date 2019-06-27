'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/channel');
const logging = require('../lib/logging');
const router = express.Router();

router.post('/add', async (req, res, next) => {
    if(!req.body.channel){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await model.addChannel(req.body.channel).then(() => {
            res.status(200).send(constants.responseMessages.success);
        });
    }
});

/**
 * 
 */
router.get('/list', async (req, res, next) => {
    model.listChannels()
    .then(object =>{
        res.status(200).send(object);
    });
});

/**
 * 
 */
router.post('/delete/:channel', async (req, res, next) => {
    if(!req.params.channel){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteChannel(req.params.channel)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;