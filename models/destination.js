const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const schedule = require('../lib/schedule');
const logging = require('../lib/logging');
const programme = require('./programme');


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
            return programme.isUsedByProgramme(constants.commonNames.destination, destination);
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
    validateDestination:validateDestination,
    listDestinations:listDestinations,
    deleteDestination:deleteDestination
}