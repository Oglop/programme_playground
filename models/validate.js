'use strict';
const constants = require('../constants');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const logging = require('../lib/logging');

async function output(output){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.outputCollection}/${output}`);
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

function channel(channel){
    return new Promise((resolve, reject) => {
        const document = firestore.doc(`${constants.firestoreCollections.channelCollection}/${channel}`);
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

async function destination(destination){
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

function market(market){
    return new Promise((resolve, reject) => {
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

async function selection(selection){
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

module.exports = {
    channel:channel,
    destination:destination,
    market:market,
    output:output,
    selection:selection,
    isUsedByProgramme:isUsedByProgramme
}