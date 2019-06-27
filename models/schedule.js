'use strict';
const constants = require('../constants');
const scheduler = require('@google-cloud/scheduler');
const logging = require('../lib/logging');

async function createJob(programmeObject){
    let scheduleObject = programmeObjectToScheduleObject(programmeObject);
    // Create a client.
    const client = new scheduler.CloudSchedulerClient();
    const parent = client.locationPath(process.env.PROJECT_ID, process.env.LOCATION_ID);
    const pubsubtopic = `projects/${process.env.PROJECT_ID}/topics/${process.env.PUBSUB_TOPIC}`;
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`;
    const job = {
        pubsubTarget: {
            topicName: pubsubtopic,
            data: Buffer.from(JSON.stringify(scheduleObject))
        },
        jobName:{
            projectId: process.env.PROJECT_ID,
            locationId: process.env.LOCATION_ID,
            jobId: programmeObject.programme,
        },
        name: name,
        description: 'Executes schedule for ' + programmeObject.programme,
        schedule: programmeObject.schedule,
        timeZone: process.env.TIME_ZONE,
    };

    const request = {
        parent: parent,
        job: job,
    };
    // Use the client to send the job creation request.
    const [response] = await client.createJob(request);
    logging.info(`Created job: ${response.name}`);
    // [END cloud_scheduler_create_job]
}
/**
 * 
 * @param {parse it to JSON because it comes from firestore.} programmeObject 
 */
async function runJob(programmeObject){
    let obj = JSON.parse(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${obj.programme}`;
    const request = {
        name:name
    };
    const [response] = await client.runJob(request);
    logging.info(`runJob: ${response.name}`);
}
/**
 * 
 * @param {parse it to JSON because it comes from firestore.} programmeObject 
 */
async function getJob(programmeObject){
    console.log(`projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`);
    let obj = JSON.parse(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${obj.programme}`;
    const request = {
        name:name
    };
    const [response] = await client.getJob(request);
    return Promise.all([response]);
}


async function updateJob(programmeObject){
    //let programmeObject = JSON.parse(obj);

    let scheduleObject = programmeObjectToScheduleObject(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
    const pubsubtopic = `projects/${process.env.PROJECT_ID}/topics/${process.env.PUBSUB_TOPIC}`;
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`;
    const job = {
        pubsubTarget: {
            topicName: pubsubtopic,
            data: Buffer.from(JSON.stringify(scheduleObject))
        },
        name: name,
        description: 'Executes schedule for ' + programmeObject.programme,
        schedule: programmeObject.schedule,
        timeZone: process.env.TIME_ZONE,
    };
    let fieldMask = constants.scheduleFieldMask;
    fieldMask.paths = ['schedule', 'pubsub_target'];
    /*let fieldMask = {
        paths: ['schedule', 'pubsub_target'],
    };*/
    const request = {
        job: job,
        updateMask: fieldMask,
    };
    // Use the client to send the job creation request.
    const [response] = await client.updateJob(request);
    logging.info(`updated job: ${response.name}`);    
}
/**
 * 
 * @param {*} programmeObject 
 */
async function createOrUpdateJob(programmeObject){
    try{


        let jobToFind = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`;
        console.log(`projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`);
        listJobs()
        .then((result) => {
            if(result[0] && result[0].schedules.find(c => (c === jobToFind)) != undefined) 
            {
                logging.info('lib/schedule/createOrUpdateJob => atempt update');
                updateJob(programmeObject);
            }
            else{
                logging.info('lib/schedule/createOrUpdateJob => atempt create');
                createJob(programmeObject);
            }
        });
    }
    catch(err){
        logging.error('lib/schedule/createOrUpdateJob ' + err.toSting());
    }
}
/**
 * 
 * @param {*} programmeObject 
 */
async function deleteJob(programmeObject){
    const client = new scheduler.CloudSchedulerClient();
    const name = client.jobPath(process.env.PROJECT_ID, process.env.LOCATION_ID, programmeObject.programme);
    await client.deleteJob({name: name});
}
/**
 * 
 */
async function listJobs(){
    let listOfJobs = [];
    const client = new scheduler.CloudSchedulerClient();
    const parent = client.locationPath(process.env.PROJECT_ID, process.env.LOCATION_ID);
    const request = {
        parent: parent
    };
    const [response] = await client.listJobs(request);
    for(let val of response) {
        let temp = JSON.parse(JSON.stringify(val));
        listOfJobs.push(temp.name);
    }

    let responseObject = {schedules: listOfJobs};
    return Promise.all([responseObject]);
}

/**
 * transforms programmeObject into a pubsubable scheduleObject
 * this will be the payload for the cloud schedule job
 * @param {*} programmeObject 
 */
function programmeObjectToScheduleObject(programmeObject){
    let scheduleObject = {
        channel:programmeObject.channel,
        output:programmeObject.output,
        market:programmeObject.market,
        destination:programmeObject.destination,
        selection:programmeObject.selection
    };
    return scheduleObject;
}

module.exports = {
    createJob: createJob,
    updateJob: updateJob,
    runJob: runJob,
    deleteJob: deleteJob,
    listJobs:listJobs,
    getJob:getJob,
    createOrUpdateJob:createOrUpdateJob
}