const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const programme = require('./programme');

async function addSelection(selection ,inclusion, exclusion){
    const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
    let selectionObject = constants.selectionObject;
    //let inclusionObject = constants.inclusionObject;
    //let exclusionObject = constants.exclusionObject;
    selectionObject.selection = selection;
    /*inclusionObject.table = inclusion.table;
    inclusionObject.where = inclusion.where;
    inclusionObject.condition = inclusion.condition;
    inclusionObject.params = inclusion.params;
    exclusionObject.table = exclusion.table;
    exclusionObject.where = exclusion.where;
    exclusionObject.condition = exclusion.condition;
    exclusionObject.params = exclusion.params;*/
    selectionObject.inclusion = inclusion;
    selectionObject.exclusion = exclusion;
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

async function getSelection(selection){
    return new Promise((resolve, reject) => {
        let getDoc = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`).get().then(doc => {
            resolve(doc.data());
        }).catch(err => {
            logging.error(err.toString());
            reject(err.toString());
        });
    });
}

module.exports.getSel = (selection, callback) => {
    let getDoc = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
    let document = getDoc.get().then(doc => {
        if(doc.exists){
            callback(null, doc.data());
        }
        else{ callback(new Error('Selection not found'), null);}
    })
}

async function deleteSelection(selection){
    return new Promise((resolve, reject) => {
        validateSelection(selection)
        .then(ok => {
            return programme.isUsedByProgramme(constants.commonNames.selection, selection);
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

module.exports = {
    addSelection:addSelection,
    validateSelection:validateSelection,
    listSelections:listSelections,
    deleteSelection:deleteSelection,
    getSelection:getSelection
}