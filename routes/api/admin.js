'use strict';
const constants = require('../../constants');
const express = require('express');
const firestore = require('../../lib/firestore');
const logging = require('../../lib/logging');
const router = express.Router();

/**
 * { channel:[email,sms] }
 */
router.post('/addChannel', async (req, res, next) => {
    if(!req.body.channel){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await firestore.addChannel(req.body.channel);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/listChannel', async (req, res, next) => {
    firestore.listChannels()
    .then(object =>{
        res.status(200).send(object);
    });
});

/**
 * 
 */
router.post('/deleteChannel/:channel', async (req, res, next) => {
    if(!req.params.channel){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.deleteChannel(req.params.channel)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

/**
 * { output:[csv, https] }
 */
router.post('/addOutput', async (req, res, next) => {
    if(!req.body.output){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await firestore.addOutput(req.body.output);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/listOutput', async (req, res, next) => {
    firestore.listOutputs()
    .then(object =>{
        res.status(200).send(object);
    });
});

/**
 * 
 */
router.post('/deleteOutput/:output', async (req, res, next) => {
    if(!req.params.output){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.deleteOutput(req.params.output)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});


/**
 * { market:[es, ca] }
 */
router.post('/addMarket', async (req, res, next) => {
    if(!req.body.market){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await firestore.addMarket(req.body.market);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/listMarket', async (req, res, next) => {
    firestore.listMarkets()
    .then(object =>{
        res.status(200).send(object);
    });
});

router.post('/deleteMarket/:market', async (req, res, next) => {
    if(!req.params.market){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.deleteMarket(req.params.market)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

/**
 * {
 *  destination:"string"
 * }
 */
router.post('/addDestination', async (req, res, next) => {
    if(!req.body.destination){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        await firestore.addDestination(req.body.destination)
        res.status(200).send(constants.responseMessages.success);
    }
});
/**
 * 
 */
router.get('/listDestination', async (req, res, next) => {
    firestore.listDestinations()
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
router.post('/deleteDestination/:destination', async (req, res, next) => {
    if(!req.params.destination){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.deleteDestination(req.params.destination)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});


/**
 * { 
 *      name: 'string'
 *      query:'string' }
 */
router.post('/addSelection', async (req, res, next) => {
    if(!req.body.selection || !req.body.query){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await firestore.addSelection(req.body.selection, req.body.query);
        res.status(200).send(constants.responseMessages.success);
    }
});

/**
 * 
 */
router.get('/listSelection', async (req, res, next) => {
    firestore.listSelections()
    .then(object =>{
        res.status(200).send(object);
    });
}); 

/**
 * 
 */
router.post('/deleteSelection/:selection', async (req, res, next) => {
    if(!req.params.selection){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.deleteSelection(req.params.selection)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            res.status(405).send(constants.responseMessages.methodNotAllowed);
        });
    }
});

module.exports = router;

