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
    // Create a client.
    let scheduleObject = programmeObjectToScheduleObject(programmeObject);
    const client = new scheduler.CloudSchedulerClient();
    // TODO(developer): Uncomment and set the following variables
    // const projectId = "PROJECT_ID"
    // const locationId = "LOCATION_ID"
    // const serviceId = "my-serivce"
    // Construct the fully qualified location path.
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

async function runJob(programmeObject){

    const client = new scheduler.CloudSchedulerClient();
    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${programmeObject.programme}`;
    const jobName = {
        projectId: process.env.PROJECT_ID,
        locationId: process.env.LOCATION_ID,
        jobId: programmeObject.programme,
    };

    const request = {
        jobName:jobName,
        name:name
    };
    const [response] = await client.runJob(request);
    console.log(`Executed job: ${response.name}`);
}


async function updateJob(programmeObject){
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
    let fieldMask = constants.scheduleFieldMask;
    fieldMask.pubsubTarget.data = Buffer.from(JSON.stringify(scheduleObject));
    fieldMask.schedule = programmeObject.schedule;
    fieldMask.timeZone = process.env.TIME_ZONE;

    const request = {
        job: job,
        updateMask: fieldMask,
    };
    // Use the client to send the job creation request.
    const [response] = await client.createJob(request);
    console.log(`updated job: ${response.name}`);


}

async function deleteJob(programmeObject){
    const client = new scheduler.CloudSchedulerClient();
    const job = client.jobPath(process.env.PROJECT_ID, process.env.LOCATION_ID, programmeObject.programme);
    await client.deleteJob({name: job});
}

async function listJobs(args){

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
    deleteJob: deleteJob
}