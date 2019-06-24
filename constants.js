//response messages
const responseMessages = {
    badRequest: 'Bad request',
    success: 'Success',
    internalServerError: 'Internal server error',
    notFound: 'Requested object could not be found'
}

const firestoreCollections = {
    programmeCollection: 'programmes',
    channelCollection: 'channels',
    marketCollection: 'markets',
    outputCollection: 'outputs',
    destinationCollection: 'destinations',
    selectionCollection: 'selections'
}

const programmeObject = {
    programme: null,
    schedule:null,
    channel:null,
    output:null,
    market:null,
    destination:null,
    selection:null
}

const channelObject = {
    channel:null
}

const marketObject = {
    market:null
}

const outputObject = {
    output:null
}

const destinationObject = {
    destination:null
}

const selectionObject = {
    selection:null
}

const errorObject = {
    error:null,
    message:null
}
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
}*/
const scheduleFieldMask = {
    mask: "pubsubTarget,schedule"
}



module.exports = {
    responseMessages:responseMessages,
    firestoreCollections: firestoreCollections,
    channelObject: channelObject,
    marketObject: marketObject,
    programmeObject: programmeObject,
    outputObject: outputObject,
    destinationObject: destinationObject,
    selectionObject: selectionObject,
    errorObject: errorObject,
    scheduleFieldMask: scheduleFieldMask
}