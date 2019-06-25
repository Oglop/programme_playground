'use strict';
if (process.env.NODE_ENV === 'production') {
    require('@google-cloud/trace-agent').start();
    require('@google-cloud/debug-agent').start();
}
process.env.GCLOUD_PROJECT = process.env.PROJECT_ID;
const logging = require('./lib/logging');

const express = require('express');

//require('dotenv').config();

const PORT = process.env.PORT || 8080;
var app = express();
app.use(logging.requestLogger);
app.use(express.json());

//routes
const adminRoute = require('./routes/api/admin');
const programmeRoute = require('./routes/api/programme');
const scheduleRoute = require('./routes/api/schedule');

app.use('/admin', adminRoute);
app.use('/programme', programmeRoute);
app.use('/schedule', scheduleRoute);


app.use(logging.errorLogger);
//TODO error handling and logging

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((error, req, res, next) => {
    res.status(500).send(err.response || 'Internal server error');
});

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


