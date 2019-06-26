'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/selection');
const logging = require('../lib/logging');
const router = express.Router();

router.post('/add', async (req, res, next) => {
    if(!req.body.selection || !req.body.query){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await model.addSelection(req.body.selection, req.body.query);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/list', async (req, res, next) => {
    model.listSelections()
    .then(object =>{
        res.status(200).send(object);
    });
}); 

/**
 * 
 */
router.post('/delete/:selection', async (req, res, next) => {
    if(!req.params.selection){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteSelection(req.params.selection)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;