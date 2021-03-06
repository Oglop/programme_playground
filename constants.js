//response messages
const responseMessages = {
    badRequest: 'Bad request',
    success: 'Success',
    internalServerError: 'Internal server error',
    notFound: 'Requested object could not be found',
    methodNotAllowed: 'Method not allowed'
}

const firestoreCollections = {
    programmeCollection: 'programmes',
    channelCollection: 'channels',
    marketCollection: 'markets',
    outputCollection: 'outputs',
    destinationCollection: 'destinations',
    selectionCollection: 'selections'
}

const commonNames = {
    selection: 'selection',
    market: 'market',
    channel: 'channel',
    destination: 'destination',
    output: 'output'
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
    selection:null,
    inclusion:null,
    exclusion:null
}

const inclusionObject = {
    table:null,
    condition:null,
    where:null,
    params:null
}

const exclusionObject = {
    table:null,
    condition:null,
    where:null,
    params:null
}


const errorObject = {
    error:null,
    message:null
}

const scheduleFieldMask = {
    paths: null
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
    scheduleFieldMask: scheduleFieldMask,
    commonNames: commonNames,
    inclusionObject:inclusionObject,
    exclusionObject, exclusionObject
}