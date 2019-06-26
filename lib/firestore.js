'use strict';
const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const schedule = require('./schedule');
const logging = require('./logging');
let observers;

/* 
    [SELECTINON] START
*/
async function addSelection(selection ,selectionQuery){
    const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
    let selectionObject = constants.selectionObject;
    selectionObject.selection = selection;
    selectionObject.query = selectionQuery;
    let setDoc = await document.set(selectionObject).then(ref => {
        logging.info(`Added selection with ID: ${selection}`);
    }).catch(err => {
        console.log(err.toString());
    });
    return Promise.all([setDoc]);
    
}

async function validateSelection(selection){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function listSelections(){
    return new Promise((resolve) => {
        let listOfSelections = [];
        const document = firestore.collection(`${constants.firestoreCollections.selectionCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfSelections.push(data);
            });
            let responseObject = {selections: listOfSelections};
            resolve(responseObject);
        }).catch(err => {
            logging.error(`firestore.listSelections: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}

async function deleteSelection(selection){
    return new Promise((resolve, reject) => {
        validateSelection(selection)
        .then(ok => {
            return isUsedByProgramme(constants.commonNames.selection, selection);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`)
            .delete()
            .then(() => {
                resolve(`Selection ${selection} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteSelection ${err.toString()}.`);
                reject('Faild to remove selection');
            });
        })
        .catch(err => {
            logging.warn(`firestore.deleteSelection ${err.toString()}.`);
            reject('Faild to remove selection');
        });
    });
}
/* 
    [SELECTINON] STOP
*/

/* 
    [DESTINATION] START
*/
async function addDestination(destination){
    const document = firestore.doc(`${constants.firestoreCollections.destinationCollection}/${destination}`);
    let destinationObject = constants.destinationObject;
    destinationObject.destination = destination;
    let setDoc = await document.set(destinationObject).then(ref => {
        logging.info(`Added destination ${destination}`);
    }).catch(err => {
        logging.error(`firestore.addDestination: ${err.toString()}.`)
    });
    return Promise.all([setDoc]);
}


async function validateDestination(destination){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.destinationCollection}/${destination}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function listDestinations(){
    return new Promise((resolve, reject) => {
        let listOfDestinations = [];
        const document = firestore.collection(`${constants.firestoreCollections.destinationCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfDestinations.push(data);
            });
            let responseObject = {destinations: listOfDestinations};
            resolve(responseObject);
        }).catch(err => {
            logging.error(`firestore.listDestinations: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            reject(errObj);
        });
    });
}

async function deleteDestination(destination){
    return new Promise((resolve, reject) => {
        validateDestination(destination)
        .then(ok => {
            return isUsedByProgramme(constants.commonNames.destination, destination);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.destinationCollection}/${destination}`)
            .delete()
            .then(() => {
                resolve(`Destination ${destination} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteSelection ${err.toString()}.`);
                reject('Faild to remove selection');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteSelection ${err.toString()}.`);
            reject('Faild to remove selection');
        });
    });
}
/* 
    [DESTINATION] STOP
*/


/* 
    [CHANNEL] START
*/
async function addChannel(channel){
    const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
    let channelObject = constants.channelObject;
    channelObject.channel = channel;
    let setDoc = await document.set(channelObject).then(ref => {
        logging.info('Added channel with ID: ', channel);
    }).catch(err => {
        logging.error(`firestore.addChannel: ${err.toString()}`);
    });
    return Promise.all([setDoc]);
}

async function deleteChannel(channel){
    return new Promise((resolve, reject) => {
        validateChannel(channel)
        .then(ok => {
            return isUsedByProgramme(constants.commonNames.channel, channel);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`)
            .delete()
            .then(() => {
                resolve(`Channel ${channel} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteChannel ${err.toString()}.`);
                reject('Faild to remove channel');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteChannel ${err.toString()}.`);
            reject('Faild to remove channel');
        });
    });
}

function validateChannel(channel){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function listChannels(){
    return new Promise((resolve) => {
        let listOfChannels = [];
        const document = firestore.collection(`${constants.firestoreCollections.channelCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfChannels.push(data);
            });
            let responseObject = {channels: listOfChannels};
            resolve(responseObject);
        }).catch(err => {
            loogging.error(`firestore.listChannels: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}
/* 
    [CHANNEL] STOP
*/

/* 
    [MARKET] START
*/
async function addMarket(market){
    const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`);
    let marketObject = constants.marketObject;
    marketObject.market = market;
    let setDoc = await document.set(marketObject).then(ref => {
        logging.info('Added document with ID: ', market);
    }).catch(err => {
        logging.error(`firestore.addMarket: ${err.toString()}`);
    });
    return Promise.all([setDoc]);
}

function validateMarket(market){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function listMarkets(){
    return new Promise((resolve) => {
        let listOfMarkets = [];
        const document = firestore.collection(`${constants.firestoreCollections.marketCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfMarkets.push(data);
            });
            let responseObject = {markets: listOfMarkets};
            resolve(responseObject);
        }).catch(err => {
            logging.error(`firestore.listMarkets: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}


async function deleteMarket(market){
    return new Promise((resolve, reject) => {
        validateMarket(market)
        .then(ok => {
            return isUsedByProgramme(constants.commonNames.market, market);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`)
            .delete()
            .then(() => {
                resolve(`Market ${market} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteMarket ${err.toString()}.`);
                reject('Faild to remove market');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteMarket ${err.toString()}.`);
            reject('Faild to remove market');
        });
    });
}
/* 
    [MARKET] STOP
*/

/* 
    [OUTPUT] START
*/
async function addOutput(output){

    const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`);
    let outputObject = constants.outputObject;
    outputObject.output = output;
    let setDoc = await document.set(outputObject).then(ref => {
        logging.info('Added output with ID: ', output);
    }).catch(err => {
        logging.error(`firestore.addOutput: ${err.toString()}`);
    });
    return Promise.all([setDoc]);
}

async function validateOutput(output){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function listOutputs(){
    return new Promise((resolve) => {
        let listOfOutputs = [];
        const document = firestore.collection(`${constants.firestoreCollections.outputCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfOutputs.push(data);
            });
            let responseObject = {outputs: listOfOutputs};
            resolve(responseObject);
        }).catch(err => {
            logging.error('firestore.listOutputs: ' + err.toString())
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}

async function deleteOutput(output){
    return new Promise((resolve, reject) => {
        validateOutput(output)
        .then(ok => {
            return isUsedByProgramme(constants.commonNames.output, output);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`)
            .delete()
            .then(() => {
                resolve(`Output ${output} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteOutput ${err.toString()}.`);
                reject('Faild to remove output');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteOutput ${err.toString()}.`);
            reject('Faild to remove output');
        });
    });
}
/* 
    [OUTPUT] STOP
*/

/* 
    [PROGRAMME] START
*/
async function addProgramme(programmeObject){
    validateOutput(programmeObject.output)
    .then((ok) => {
        return validateChannel(programmeObject.channel);
    }).then((ok) => {
        return validateDestination(programmeObject.destination);
    }).then((ok) => {
        return validateMarket(programmeObject.market);
    }).then((ok) => {
        return validateSelection(programmeObject.selection);
    }).then((ok) => {
        let document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`).update(programmeObject);
            }
            else{
                firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`).set(programmeObject).then(ref =>{
                    firestoreEvents.setObservers();
                });
            }
        });
    }).catch(err => {
        logging.error(`firestore.addProgramme: ${err.toString()}`);
    });
}

async function getProgramme(programme){
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        document.get()
        .then(doc => {
            if(doc.exists){
                resolve(JSON.stringify(doc.data()));
            }
            else{
                let errorObject = constants.errorObject;
                errorObject.error = constants.responseMessages.notFound;
                resolve(errorObject);
            }
        }).catch(err => {
            let errorObject = constants.errorObject;
            errorObject.error = constants.responseMessages.internalServerError;
            errorObject.message = err.toString();
            resolve(errorObject);
        });
    });
}

async function listProgrammes(){
    return new Promise((resolve) => {
        let listOfProgrammes = [];
        const document = firestore.collection(`${constants.firestoreCollections.programmeCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data();
                listOfProgrammes.push(data.programme);
            });
            let responseObject = {programmes: listOfProgrammes};
            resolve(responseObject);
        }).catch(err => {
            logging.error(`firestore.listProgrammes: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
    
}

async function validateProgramme(programme){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                reject('false');
            }
        });
    });
}

async function deleteProgramme(programme){
    return new Promise((resolve, reject) => {
        validateProgramme(programme)
        .then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`)
            .delete()
            .then(() => {
                resolve(`Programme ${programme} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteProgramme ${err.toString()}.`);
                reject('Faild to remove programme');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteProgramme ${err.toString()}.`);
            reject('Faild to remove programme');
        });
    });
}

async function isUsedByProgramme(field, value){
    return new Promise((resolve, reject) => {
        let programmeRef = firestore.collection(`${constants.firestoreCollections.programmeCollection}`).where(field, '==', value);
        programmeRef.get()
        .then(querySnapshot => {
            if(querySnapshot.size > 0){
                reject(`${field} ${value} is in use and cannot be deleted.`);
            }
            else{
                resolve('ok');
            }
        });
    });
}
/* 
    [PROGRAMME] STOP
*/


/* 
    [EVENTS] START
*/
const firestoreEvents = {
    setObservers(){
        if(observers == null || observers == undefined){
            let observer = firestore.collection(`${constants.firestoreCollections.programmeCollection}`)
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    if(change.type == 'added'){
                        logging.info('added => createOrupdate ' + JSON.stringify(change.doc.data()));
                        schedule.createOrUpdateJob(change.doc.data());
                    }else if(change.type == 'modified'){
                        logging.info('modified => update ' + JSON.stringify(change.doc.data()));
                        schedule.updateJob(change.doc.data());
                    }else if (change.type == 'removed'){
                        logging.info('removed => deleteJob ' + JSON.stringify(change.doc.data()));
                        schedule.deleteJob(change.doc.data());
                    }
                });
            });
            observers = observer;
        }
    }
}
firestoreEvents.setObservers();
/* 
    EVENTS STOP
*/

module.exports = {
    addChannel: addChannel,
    addMarket: addMarket,
    addProgramme: addProgramme,
    addOutput: addOutput,
    addDestination: addDestination,
    addSelection: addSelection,
    getProgramme: getProgramme,
    listProgrammes: listProgrammes,
    listSelections: listSelections,
    listDestinations: listDestinations,
    listChannels: listChannels,
    listOutputs, listOutputs,
    listMarkets: listMarkets,
    validateChannel: validateChannel,
    validateMarket: validateMarket,
    validateOutput: validateOutput,
    validateSelection, validateSelection,
    validateDestination: validateDestination,
    validateProgramme: validateProgramme,
    deleteChannel: deleteChannel,
    deleteMarket: deleteMarket,
    deleteOutput: deleteOutput,
    deleteDestination: deleteDestination,
    deleteSelection: deleteSelection,
    deleteProgramme: deleteProgramme
}
