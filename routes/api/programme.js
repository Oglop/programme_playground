'use strict';
const constants = require('../../constants');
const express = require('express');
const router = express.Router();
const firestore = require('../../lib/firestore');
const pubsub = require('../../lib/pubsub');
const helpers = require('../../lib/helpers');


/**
 * 
 */
router.get('/getProgramme/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.getProgramme(req.params.programme)
        .then(object => {
            res.status(200).send(object);
        });
    }
});

/**
 * 
 */
router.get('/listProgrammes', (req, res, next) => {
    if(!req.body){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        firestore.listProgrammes()
        .then(object => {
            res.status(200).send(object);
        });
    }
});

/**
 * {
 *  programme:
 *  channel:
 *  market:
 * }
 */
router.post('/addProgramme', (req, res, next) => {
    if(!req.body.programme || !req.body.schedule || !req.body.channel || !req.body.output || !req.body.market || !req.body.destination || !req.body.selection){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        let programmeObject = constants.programmeObject;
        programmeObject.programme = req.body.programme;
        programmeObject.channel = req.body.channel;
        programmeObject.output = req.body.output;
        programmeObject.market = req.body.market;
        programmeObject.destination = req.body.destination;
        programmeObject.schedule = req.body.schedule;
        programmeObject.selection = req.body.selection;
        firestore.addProgramme(programmeObject);
        res.status(200).send(constants.responseMessages.success);
        /*.then((programmeObject) => {
            console.log('add programme to fire store');
            firestore.addProgramme(programmeObject);
        }).then((result) => {
            console.log('check result');
            if(result == 'OK'){
                res.status(200).send(constants.responseMessages.success);
            }else{
                res.status(404).send(constants.responseMessages.badRequest);
            }
            
        });*/
/*
        let func = (() => {
            let programmeObject = constants.programmeObject;
            programmeObject.programme = req.body.programme;
            programmeObject.channel = req.body.channel;
            programmeObject.output = req.body.output;
            programmeObject.market = req.body.market;
            programmeObject.destination = req.body.destination;
            programmeObject.query = req.body.query;
            firestore.addProgramme(programmeObject);
        }).then(() => {
            res.status(200).send(constants.responseMessages.success);
        });*/
    }
});

router.post('/runProgramme/:programme', (req, res, next) => {

});


function setData(req){
    console.log('set data');
    let programmeObject = constants.programmeObject;
    programmeObject.programme = req.body.programme;
    programmeObject.channel = req.body.channel;
    programmeObject.output = req.body.output;
    programmeObject.market = req.body.market;
    programmeObject.destination = req.body.destination;
    programmeObject.schedule = req.body.schedule;
    programmeObject.selection = req.body.selection;
    return programmeObject
}

module.exports = router;

