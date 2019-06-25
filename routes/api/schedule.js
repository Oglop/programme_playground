'use strict';
const constants = require('../../constants');
const schedule = require('../../lib/schedule');
const firestore = require('../../lib/firestore');
const helper = require('../../lib/helpers');
const logging = require('../../lib/logging');
const express = require('express');
const router = express.Router();

/*
const programmeObject = {
    programme: null,
    schedule:null,
    channel:null,
    output:null,
    market:null,
    destination:null,
    selection:null
}
*/
router.post('/createJob/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        firestore.validateProgramme(req.params.programme)
        .then(ok => {
            return firestore.getProgramme(req.params.programme);
        }).then((programmeObject) => {
            schedule.createJob(programmeObject);
            res.status(200).send(constants.responseMessages.success);
        }).catch(err => {
            logging.error('api.schedule.createJob' + err.toString());
            console.log(err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
        
    }
});


router.post('/runSchedule/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        firestore.validateProgramme(req.params.programme)
        .then(ok => {
            return firestore.getProgramme(req.params.programme);
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

router.get('/getSchedule/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        firestore.validateProgramme(req.params.programme)
        .then(ok => {
            return firestore.getProgramme(req.params.programme);
        })
        .then((programmeObject) => {
            return schedule.getJob(programmeObject);
        })
        .then((schedule) => {
            res.status(200).send(JSON.stringify(schedule));
        })
        .catch(err => {
            console.log(err.toString());
            res.status(500).send(constants.responseMessages.internalServerError);
        });
    }
});

router.get('/listSchedules/:args', (req, res) => {
    schedule.listJobs(req.params.args)
    .then(object => {
        res.status(200).send(object);
    });
});

router.post('deleteSchedule/:programme', (req, res, next) => {
    if(!req.params.programme){

    }
    else {
        firestore.getProgramme(req.params.programme)
        .then(programmeObject => {
            schedule.deleteJob(programmeObject);
        })
        .catch(err => {
            console.log(err.toString());
        });
    }
});




module.exports = router;