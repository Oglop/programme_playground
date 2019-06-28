const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const validate = require('./validate');

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
        validate.output(output)
        .then(ok => {
            return validate.isUsedByProgramme(constants.commonNames.output, output);
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

module.exports = {
    addOutput:addOutput,
    listOutputs:listOutputs,
    deleteOutput:deleteOutput
}