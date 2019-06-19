'use strict';
//const admin = require('firebase-admin');
//const functions = require('firebase-functions');
const constants = require('../constants');

const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();

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
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                resolve('false');
            }
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
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.destinationCollection}/${destination}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                resolve('false');
            }
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
        if(validateChannel(channel) == 'true'){
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
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                resolve('false');
            }
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
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                resolve('false');
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
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                resolve('true');
            }
            else{
                throw new Error('false');
            }
        });
    });
}
/**
 * TODO
 */
function addObservers(){
    const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}`);
    let allProgrammes = document.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          if(!observers.includes(doc)){
            let observer = doc.onSnapshot(docSnapshot => {
                console.log('add the observer');
            }, err => {
               console.log(`Encountered error: ${err}`);
            });
            observers.push(observer);
          }
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
}


async function addProgramme(programmeObject){
    validateOutput(programmeObject.output)
    .then((ok) => {
        return validateChannel(programmeObject.channel)
    }).then((ok) => {
        return validateDestination(programmeObject.destination)
    }).then((ok) => {
        return validateMarket(programmeObject.market)
    }).then((ok) => {
        return validateSelection(programmeObject.selection)
    }).then((ok) => {
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`);
        let setDoc = await document.set(programmeObject).then(ref => {
            console.log('Added programmeObject with ID: ', ref.id);
        });
    }).catch(err => {
        
    });
    return Promise.all([setDoc]);
}

async function getProgramme(programme){
    return new Promise((resolve) => {
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        document.get()
        .then(doc => {
            if(doc.exists){
                console.log('document exists');
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
        const document = firestore.doc(`${constants.firestoreCollections.programmeCollection}`);
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
    addOutput: addOutput,
    addDestination: addDestination,
    addSelection: addSelection,
    validateChannel: validateChannel,
    validateMarket: validateMarket,
    validateOutput: validateOutput,
    validateSelection, validateSelection,
    validateDestination: validateDestination,
    deleteChannel: deleteChannel
}
