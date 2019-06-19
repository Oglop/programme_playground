'use strict';
const constants = require('../../constants');
const schedule = require('../../lib/schedule');
const firestore = require('../../lib/firestore');
const helper = require('../../lib/helpers');
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
        

        let po = constants.programmeObject;
        po.programme = 'TEST_Programme';
        po.schedule = '0 13 19 6 *';
        po.channel = 'email';
        po.output = 'csv';
        po.market = 'se';
        po.destination = 'salesforce';
        po.selection = 'warmup';

        schedule.createJob(po);
        res.status(200).send(constants.responseMessages.success);
    }
});


router.post('/runSchedule/:programme', (req, res, next) => {
    if(!req.params.programme){
        res.status(404).send(constants.responseMessages.badRequest);
    }
    else {
        firestore.getProgramme(req.params.programme)
        .then((programmeObject) => {
            
        })


        let po = constants.programmeObject;
        po.programme = 'TEST_Programme';
        po.schedule = '0 13 19 6 *';
        po.channel = 'email';
        po.output = 'csv';
        po.market = 'se';
        po.destination = 'salesforce';
        po.selection = 'warmup';

        schedule.runJob(po);
        res.status(200).send(constants.responseMessages.success);
    }
});

module.exports = router;