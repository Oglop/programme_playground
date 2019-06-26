'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/programme');
const logging = require('../lib/logging');
const router = express.Router();

router.get('/get/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.getProgramme(req.params.programme)
        .then(object => {
            res.status(200).send(object);
        });
    }
});

/**
 * 
 */
router.get('/list', (req, res, next) => {
    if(!req.body){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.listProgrammes()
        .then(object => {
            res.status(200).send(object);
        }).catch(err => {
            logging.error('programme.listProgrammes: ' + err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
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
router.post('/add', (req, res, next) => {
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
        model.addProgramme(programmeObject)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        })
        .catch(err => {
            logging.error('programme.addProgramme: ' + err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

router.post('/delete/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else{
        model.deleteProgramme(req.params.programme)
        .then(() => {
            res.status(200).send(constants.responseMessages.success);
        })
        .catch(err => {
            logging.error('programme.deleteProgramme: ' + err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

module.exports = router;