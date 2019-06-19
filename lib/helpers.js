'use strict';

import { builtinModules } from "module";

function validateSchedule(schedule){
    let arrCron = schedule.split(' ');
    if(arrCron.length == 5){
        let minute = arrCron[0];
        let hour = ArrCron[1];
        let dayOfMonth = arrCron[2];
        let month = arrCron[3];
        let dayOfWeek = arrCron[4];
    }


}

function isErrorObject(object){
    return new Promise((resolve) => {
        if(!object.error){
            resolve('true');
        }
        else{
            resolve('false');
        }
    });
}

module.exports = {
    isErrorObject
}

