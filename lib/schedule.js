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
'use strict';
const scheduler = require('@google-cloud/scheduler');
const constants = require('../constants');
/**
 * 
 * @param {*} object 
 */
async function createJob(programmeObject){
    console.log(programmeObject);
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
    console.log(`Created job: ${response.name}`);
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
    /*const jobName = {
        projectId: process.env.PROJECT_ID,
        locationId: process.env.LOCATION_ID,
        jobId: programmeObject.programme,
    };

    const request = {
        jobName:jobName,
        name:name
    };*/
    const request = {
        name:name
    };
    const [response] = await client.runJob(request);
    console.log(`runJob: ${response.name}`);
}
/**
 * 
 * @param {parse it to JSON because it comes from firestore.} programmeObject 
 */
async function getJob(programmeObject){
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
    //let obj = JSON.parse(programmeObject);
    let scheduleObject = programmeObjectToScheduleObject(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
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
    let fieldMask = constants.scheduleFieldMask.mask;
    /*fieldMask.pubsubTarget.data = Buffer.from(JSON.stringify(scheduleObject));
    fieldMask.schedule = programmeObject.schedule;
    fieldMask.timeZone = process.env.TIME_ZONE;*/
/*
const scheduleFieldMask = {
    pubsubTarget: {
        topicName: null,
        data: null
    },
    name: null,
    description: null,
    schedule: null,
    timeZone: null,
}
*/
    const request = {
        job: job,
        updateMask: fieldMask,
    };
    // Use the client to send the job creation request.
    const [response] = await client.createJob(request);
    console.log(`updated job: ${response.name}`);
}
/**
 * 
 * @param {*} programmeObject 
 */
async function createOrUpdateJob(programmeObject){
    try{
        let jobToFind = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`;
        console.log('lib/schedule/createOrUpdateJob => start');
        console.log(jobToFind);
        listJobs()
        .then((result) => {
            //if(progge[0] && progge[0].schedules.find(c => (c === 
            console.log('lib/schedule/createOrUpdateJob => atempt update');
            if(result[0] && result[0].schedules.find(c => (c === jobToFind)) != undefined) 
            {
                updateJob(programmeObject);
            }
            else{
                createJob(programmeObject);
            }
        });
    }
    catch(err){
        console.log('lib/schedule/createOrUpdateJob => atempt add job');
        
    }
}
/**
 * 
 * @param {*} programmeObject 
 */
async function deleteJob(programmeObject){
    let obj = JSON.parse(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
    const name = client.jobPath(process.env.PROJECT_ID, process.env.LOCATION_ID, obj.programme);
    await client.deleteJob({name: name});
}
/**
 * 
 * @param {*} args 
 */
async function listJobs(args){
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