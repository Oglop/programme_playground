'use strict';
//const admin = require('firebase-admin');
//const functions = require('firebase-functions');
const constants = require('../constants');

const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const schedule = require('./schedule');
let observers = [];


async function addSelection(selection ,selectionQuery){
    const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
    let selectionObject = constants.selectionObject;
    selectionObject.selection = selectionQuery;
    let setDoc = await document.set(selectionObject).then(ref => {
        console.log('Added selection with ID: ', ref.id);
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
            let responseObject = {programmes: listOfSelections};
            resolve(responseObject);
        }).catch(err => {
            console.log('Error getting selections', err);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}


async function addDestination(destination){
    const document = firestore.doc(`${constants.firestoreCollections.destinationCollection}/${destination}`);
    let destinationObject = constants.destinationObject;
    destinationObject.destination = destination;
    let setDoc = await document.set(destinationObject).then(ref => {
        console.log('Added destination with ID: ', ref.id);
    }).catch(err => {
        console.log(err.toString());
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
    return new Promise((resolve) => {
        let listOfDestinations = [];
        const document = firestore.collection(`${constants.firestoreCollections.destinationCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfDestinations.push(data);
            });
            let responseObject = {programmes: listOfDestinations};
            resolve(responseObject);
        }).catch(err => {
            console.log('Error getting selections', err);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}

async function addChannel(channel){
    const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
    let channelObject = constants.channelObject;
    channelObject.channel = channel;
    let setDoc = await document.set(channelObject).then(ref => {
        console.log('Added document with ID: ', ref.id);
    }).catch(err => {
        console.log(err.toString());
    });
    return Promise.all([setDoc]);
}

async function deleteChannel(channel){
    return new Promise((resolve) => {
        if(validateChannel(channel, reject) == 'true'){
            const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
            delDoc = document.delete().then(ref => {
                console.log(ref.id + ' was deleted');
                resolve(ref);
            });
        }
        else{
            let errorObj = constants.errorObject;
            errorObj.error = ''
        }
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
                let data = doc.data();
                listOfChannels.push(data.channel);
            });
            let responseObject = {programmes: listOfChannels};
            resolve(responseObject);
        }).catch(err => {
            console.log('Error getting selections', err);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}

async function addMarket(market){
    const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`);
    let marketObject = constants.marketObject;
    marketObject.market = market;
    let setDoc = await document.set(marketObject).then(ref => {
        console.log('Added document with ID: ', ref.id);
    }).catch(err => {
        console.log(err.toString());
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

async function addOutput(output){

    const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`);
    let outputObject = constants.outputObject;
    outputObject.output = output;
    let setDoc = await document.set(outputObject).then(ref => {
        console.log('Added document with ID: ', ref.id);
    }).catch(err => {
        console.log(err.toString());
    });;
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
/**
 * TODO
*/
function addObservers(){
    const document = firestore.collection(`${constants.firestoreCollections.programmeCollection}`);
    let allProgrammes = document.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
            if(!observers.includes(doc)){
                doc.docChanges().forEach(change => {
                    if(change.type == 'added'){
                        console.log('added => createOrupdate');
                        schedule.createOrUpdateJob(change.doc.data());
                    }else if(change.type == 'modified'){
                        schedule.updateJob(change.doc.data());
                    }else if (change.type == 'removed'){
                        schedule.deleteJob(change.doc.data());
                    }
                });
                observers.push(doc);
            }
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
}
/*
function addObserver(doc){
    let observer = doc.onSnapshot(docSnapshot => {
        console.log(`Received doc snapshot: ${docSnapshot}`);
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
    observers.push(observer);
}
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
        let setDoc = document.set(programmeObject).then(ref => {
            schedule.createOrUpdateJob(programmeObject);
        });
        
        /*
        let observer = firestore.collection(`${constants.firestoreCollections.programmeCollection}`)
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    console.log('added => createOrupdate');
                    schedule.createOrUpdateJob(change.doc.data());
                }else if(change.type == 'modified'){
                    schedule.updateJob(change.doc.data());
                }else if (change.type == 'removed'){
                    schedule.deleteJob(change.doc.data());
                }
            });
        });
        */

    }).catch(err => {
        console.log('add programme: ' + err.toString());
    });
}

async function getProgramme(programme){
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        document.get()
        .then(doc => {
            if(doc.exists){
                console.log('document exists');
                console.log(JSON.stringify(doc.data()));
                resolve(JSON.stringify(doc.data()));
            }
            else{
                console.log('document doesnt exist');
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
            console.log('Error getting documents', err);
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

/**
 * 

let firebaseEvent = firestore.collection(`${constants.firestoreCollections.programmeCollection}`).onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            schedule.createJob(change.doc.data());
        }else if(change.type == 'modified'){
            schedule.updateJob(change.doc.data());
        }else if (change.type == 'removed'){
            scheduledeleteJob(change.doc.data());
        }
    });
});
 */
/*
async getMarker() {
    const snapshot = await firebase.firestore().collection(constants.firestoreCollections.programmeCollection).get()
    return snapshot.docs.map(doc => doc.data());
}
*/


module.exports = {
    addChannel: addChannel,
    addMarket: addMarket,
    addProgramme: addProgramme,
    getProgramme: getProgramme,
    listProgrammes: listProgrammes,
    listSelections: listSelections,
    listDestinations: listDestinations,
    listChannels: listChannels,
    addOutput: addOutput,
    addDestination: addDestination,
    addSelection: addSelection,
    validateChannel: validateChannel,
    validateMarket: validateMarket,
    validateOutput: validateOutput,
    validateSelection, validateSelection,
    validateDestination: validateDestination,
    validateProgramme: validateProgramme,
    deleteChannel: deleteChannel
}
