'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/output');
const logging = require('../lib/logging');
const router = express.Router();

router.post('/add', async (req, res, next) => {
    if(!req.body.output){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await model.addOutput(req.body.output);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/list', async (req, res, next) => {
    model.listOutputs()
    .then(object =>{
        res.status(200).send(object);
    });
});

/**
 * 
 */
router.post('/delete/:output', async (req, res, next) => {
    if(!req.params.output){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteOutput(req.params.output)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;