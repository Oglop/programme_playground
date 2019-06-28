'use strict';
const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const validate = require('./validate');


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
        validate.destination(destination)
        .then(ok => {
            return validate.isUsedByProgramme(constants.commonNames.destination, destination);
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

module.exports = {
    addDestination:addDestination,
    listDestinations:listDestinations,
    deleteDestination:deleteDestination
}