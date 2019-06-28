const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const validate = require('./validate');

async function addSelection(selection ,inclusion, exclusion){
    const document = firestore.doc(`${constants.firestoreCollections.selectionCollection}/${selection}`);
    let selectionObject = constants.selectionObject;
    selectionObject.selection = selection;
    selectionObject.inclusion = inclusion;
    selectionObject.exclusion = exclusion;
    let setDoc = await document.set(selectionObject).then(ref => {
        logging.info(`Added selection with ID: ${selection}`);
    }).catch(err => {
        console.log(err.toString());
    });
    return Promise.all([setDoc]);
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

async function deleteSelection(selection){
    return new Promise((resolve, reject) => {
        validate.selection(selection)
        .then(ok => {
            return validate.isUsedByProgramme(constants.commonNames.selection, selection);
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
    listSelections:listSelections,
    deleteSelection:deleteSelection,
    getSelection:getSelection
}