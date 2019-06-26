'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/destination');
const logging = require('../lib/logging');
const router = express.Router();

router.post('/add', async (req, res, next) => {
    if(!req.body.destination){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        await model.addDestination(req.body.destination)
        res.status(200).send(constants.responseMessages.success);
    }
});
/**
 * 
 */
router.get('/list', async (req, res, next) => {
    model.listDestinations()
    .then(object =>{
        res.status(200).send(object);
    })
    .catch(err => {
        logging.error(err.toString());
        res.status(500).send(constants.responseMessages.internalServerError);
    });
});

/**
 * 
 */
router.post('/delete/:destination', async (req, res, next) => {
    if(!req.params.destination){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteDestination(req.params.destination)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;