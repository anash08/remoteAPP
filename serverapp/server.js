#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('./app');
const http = require('http');
const os = require('os');
const puppeteer = require('puppeteer');

const handleSocketEvents = require('./socket');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const browser = puppeteer.launch();


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

// ...

const io = require('socket.io')(server);

io.on('connection', async (socket) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  handleSocketEvents(socket, page);

  console.log('someone connected');
});

// ...


const ifaces = os.networkInterfaces();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    Object.keys(ifaces).forEach((ifname) => {
      ifaces[ifname].forEach((iface) => {
        if (!iface.internal && iface.family === 'IPv4')
          console.log(`Can access on your network with this http://${iface.address}:${port}`);
      });
    });

    await performPuppeteerOperations(page);

    await browser.close();
  } catch (error) {
    console.error('An error occurred during Puppeteer operations:', error);
  }
}

async function performPuppeteerOperations(page) {
  // Use Puppeteer operations with the `page` object
  // For example, you can navigate to a URL and take a screenshot:
  await page.goto('https://www.example.com');
  await page.screenshot({ path: 'example.png' });
}
