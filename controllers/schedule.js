'use strict';
const constants = require('../constants');
const express = require('express');
const model = require('../models/schedule');
const logging = require('../lib/logging');
const router = express.Router();

router.post('/create/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        model.validateProgramme(req.params.programme)
        .then(ok => {
            return model.getProgramme(req.params.programme);
        }).then((programmeObject) => {
            schedule.createJob(programmeObject);
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            logging.error('api.schedule.createJob: ' + err.toString());
            console.log(err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

router.post('/run/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        model.validateProgramme(req.params.programme)
        .then(ok => {
            return model.getProgramme(req.params.programme);
        })
        .then((programmeObject) => {
            schedule.runJob(programmeObject);
            res.status(200).send(constants.responseMessages.success);
        })
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

router.get('/get/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        model.validateProgramme(req.params.programme)
        .then(ok => {
            return model.getProgramme(req.params.programme);
        })
        .then((programmeObject) => {
            return schedule.getJob(programmeObject);
        })
        .then((schedule) => {
            res.status(200).send(JSON.stringify(schedule));
        })
        .catch(err => {
            console.log('getSchedule' + err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

router.get('/list', (req, res) => {
    schedule.listJobs()
    .then(object => {
        res.status(200).send(object);
    });
});

router.post('delete/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        model.getProgramme(req.params.programme)
        .then(programmeObject => {
            schedule.deleteJob(programmeObject);
        })
        .catch(err => {
            logging.error(err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

module.exports = router;