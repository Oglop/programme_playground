const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');
const programme = require('./programme');

async function addMarket(market){
    const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`);
    let marketObject = constants.marketObject;
    marketObject.market = market;
    let setDoc = await document.set(marketObject).then(ref => {
        logging.info('Added document with ID: ', market);
    }).catch(err => {
        logging.error(`firestore.addMarket: ${err.toString()}`);
    });
    return Promise.all([setDoc]);
}

async function validateMarket(market){
    return new Promise((resolve, reject) => {
        console.log('found market function');
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

async function listMarkets(){
    return new Promise((resolve) => {
        let listOfMarkets = [];
        const document = firestore.collection(`${constants.firestoreCollections.marketCollection}`);
        document.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.id;
                listOfMarkets.push(data);
            });
            let responseObject = {markets: listOfMarkets};
            resolve(responseObject);
        }).catch(err => {
            logging.error(`firestore.listMarkets: ${err.toString()}`);
            let errObj = constants.errorObject;
            errorObj.error = constants.responseMessages.internalServerError;
            errorObj.message = err.toString();
            resolve(errObj);
        });
    });
}


async function deleteMarket(market){
    return new Promise((resolve, reject) => {
        console.log(market);
        validateMarket(market)
        .then(ok => {
            return programme.isUsedByProgramme(constants.commonNames.market, market);
        }).then(ok => {
            const document = firestore.doc(`${constants.firestoreCollections.marketCollection}/${market}`)
            .delete()
            .then(() => {
                resolve(`Market ${market} was deleted`);
            })
            .catch(err => {
                logging.error(`firestore.deleteMarket ${err.toString()}.`);
                reject('Faild to remove market');
            });
        })
        .catch(err => {
            logging.error(`firestore.deleteMarket ${err.toString()}.`);
            reject('Faild to remove market');
        });
    });
}

module.exports = {
    addMarket:addMarket,
    validateMarket:validateMarket,
    listMarkets:listMarkets,
    deleteMarket:deleteMarket
}