const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const validate = require('./validate');

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
        validate.channel(channel)
        .then(ok => {
            return validate.isUsedByProgramme(constants.commonNames.channel, channel);
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

module.exports = {
    addChannel:addChannel,
    deleteChannel:deleteChannel,
    listChannels:listChannels
}