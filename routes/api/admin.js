'use strict';
const constants = require('../../constants');
const express = require('express');
const firestore = require('../../lib/firestore');
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

router.get('/listChannel', async (req, res, next) => {
    firestore.listChannels()
    .then(object =>{
        res.status(200).send(object);
    });
});

router.post('/deleteChannel', async (req, res, next) => {
    if(!req.body.channel){

    }
    else{
        //firestore.delete
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
 * { market:[es, ca] }
 */
router.post('/addMarket', async (req, res, next) => {
    if(!req.body.market){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        //dataaccess add market
        await firestore.addMarket(req.body.market);
        res.status(200).send(constants.responseMessages.success);
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

router.get('/listDestination', async (req, res, next) => {
    firestore.listDestinations()
    .then(object =>{
        res.status(200).send(object);
    });
});


/**
 * { 
 *      name: 'string'
 *      query:'string' }
 */
router.post('/addSelection', async (req, res, next) => {
    if(!req.body.query || !req.body.name){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        await firestore.addSelection(req.body.name, req.body.query);
        res.status(200).send(constants.responseMessages.success);
    }
});

router.get('/listSelection', async (req, res, next) => {
    firestore.listSelections()
    .then(object =>{
        res.status(200).send(object);
    });
});

module.exports = router;

