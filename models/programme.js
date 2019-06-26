const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const schedule = require('../lib/schedule');
const logging = require('../lib/logging');
let observers;

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

module.exports = {
    isUsedByProgramme:isUsedByProgramme,
    deleteProgramme:deleteProgramme,
    validateProgramme:validateProgramme,
    listProgrammes:listProgrammes,
    getProgramme:getProgramme,
    addProgramme:addProgramme
}