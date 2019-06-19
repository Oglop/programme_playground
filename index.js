'use strict';

process.env.GCLOUD_PROJECT = process.env.PROJECT_ID;
const logging = require('./lib/logging');

const express = require('express');

//require('dotenv').config();

const PORT = process.env.PORT || 8080;
var app = express();
app.use(express.json());

//routes
const adminRoute = require('./routes/api/admin');
const programmeRoute = require('./routes/api/programme');
const scheduleRoute = require('./routes/api/schedule');

app.use('/admin', adminRoute);
app.use('/programme', programmeRoute);
app.use('/schedule', scheduleRoute);

//TODO error handling and logging

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


