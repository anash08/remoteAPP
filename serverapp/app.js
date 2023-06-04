const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

// Set the environment variable NODE_VERSION
process.env.NODE_VERSION = '18.16.0';

const staticPath = process.env.STATIC_PATH || '/home/user/Desktop/remoteapp/client/build';
const indexPath = path.join(staticPath, 'index.html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.sendFile(indexPath);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('Something went wrong!');
});

module.exports = app;
