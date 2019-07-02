'use strict';
const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const schedule = require('./schedule');
const logging = require('../lib/logging');
const validate = require('./validate');
let observers;

async function addProgramme(programmeObject){
    validate.output(programmeObject.output)
    .then((ok) => {
        return validate.channel(programmeObject.channel);
    }).then((ok) => {
        return validate.destination(programmeObject.destination);
    }).then((ok) => {
        return validate.market(programmeObject.market);
    }).then((ok) => {
        return validate.selection(programmeObject.selection);
    }).then((ok) => {
        let document = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`);
        document.get()
        .then((docSnapshot) => {
            if(docSnapshot.exists){
                firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`).update(programmeObject).then(ref =>{
                    schedule.createOrUpdateJob(programmeObject);
                });
                
            }
            else{
                firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programmeObject.programme}`).set(programmeObject).then(ref =>{
                    //setObservers();
                    schedule.createOrUpdateJob(programmeObject);
                });
            }
        });
    }).catch(err => {
        logging.error(`addProgramme: ${err.toString()}`);
    });
}

function getProgrammeFull(programme){
    return new Promise((resolve) => {
        console.log('getProgrammeFull');
        const programmeRef = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        programmeRef.get()
        .then(programmeDoc => {
            if(programmeDoc.exists){
                const selectionRef = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${programmeDoc.data().selection}`);
                selectionRef.get().then(selectionDoc => {
                    let resObj = programmeDoc.data();
                    resObj.selection = selectionDoc.data();
                    resolve(JSON.stringify(resObj));
                });
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

async function getProgramme(programme){
    return new Promise((resolve) => {
        const programmeDoc = firestore.doc(`${constants.firestoreCollections.programmeCollection}/${programme}`);
        programmeDoc.get()
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
                schedule.deleteJob(programme).then(() => {
                    resolve(`Programme ${programme} was deleted`);
                });
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

async function getRoutingSlip(programme){
    
}


//let firestoreEvents = {
function setObservers(){
    console.log('setObservers called');
    if(observers == null || observers == undefined){
        let observer = firestore.collection(`${constants.firestoreCollections.programmeCollection}`)
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    logging.info('added => createOrupdate ' + JSON.stringify(change.doc.data()));
                    //schedule.createOrUpdateJob(JSON.parse(change.doc.data()));
                    getProgrammeFull(change.doc.data().programme)
                    .then(programmeObject => {
                        schedule.createOrUpdateJob(JSON.parse(programmeObject));
                    });
                }else if(change.type == 'modified'){
                    logging.info('modified => update ' + JSON.stringify(change.doc.data()));
                    //schedule.updateJob(change.doc.data());
                    getProgrammeFull(change.doc.data().programme)
                    .then(programmeObject => {
                        schedule.updateJob(JSON.parse(programmeObject));
                        //schedule.updateJob(change.doc.data());
                    });
                    
                }else if (change.type == 'removed'){
                    logging.info('removed => deleteJob ' + JSON.stringify(change.doc.data()));
                    schedule.deleteJob(change.doc.data());
                }
            });
        }, (error) => {
            logging.error('setObservers: ' + error.toString());
        });
        if(observers == null || observers == undefined){
            console.log('new listeners added');
            observers = observer;
        }
    }
}

function unsubscribe(){
    observers = firestore.collection(`${constants.firestoreCollections.programmeCollection}`).onSnapshot(() => {});
    observers();
    observers = null;
}

module.exports = {
    deleteProgramme:deleteProgramme,
    validateProgramme:validateProgramme,
    listProgrammes:listProgrammes,
    getProgramme:getProgramme,
    getProgrammeFull:getProgrammeFull,
    addProgramme:addProgramme,
    unsubscribe:unsubscribe,
    setObservers:setObservers
}