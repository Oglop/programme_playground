'use strict';
if (process.env.NODE_ENV === 'production') {
    require('@google-cloud/trace-agent').start();
    require('@google-cloud/debug-agent').start();
}
process.env.GCLOUD_PROJECT = 'directed-portal-244205';// process.env.PROJECT_ID;
const logging = require('./lib/logging');

const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 8080;
var app = express();
app.use(logging.requestLogger);
app.use(express.json());


app.use('/market', require('./controllers/market'));
app.use('/channel', require('./controllers/channel'));
app.use('/destination', require('./controllers/destination'));
app.use('/output', require('./controllers/output'));
app.use('/selection', require('./controllers/selection'));
app.use('/programme', require('./controllers/programme'));
app.use('/schedule', require('./controllers/schedule'));

app.use(logging.errorLogger);
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((error, req, res, next) => {
    res.status(500).send(err.response || 'Internal server error');
});

const server = app.listen(PORT, () => {
    logging.info(`Listening to port ${PORT}`);
});


