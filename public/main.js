const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const expressApp = require('express')();
const server = require('http').Server(expressApp);
const io = require('socket.io')(server);

if (isDev) {
  console.log('Running in development');
} else {
  console.log('Running in production');
}

let mainWindow;

function createWindow() {
  expressApp.use(bodyParser.urlencoded({ extended: true }));
  expressApp.use(bodyParser.json());

  server.listen(3001);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${__dirname}/../dist/index.html`);

  if (isDev) {
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), './Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0'),
    );
  }
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const poster = io.on('connection', (socket) => {
    console.log('a user connected');

    expressApp.post('/posturl', (request, response) => {
      try {
        if (request.headers["content-type"].includes('json') || 
            request.headers["content-type"].includes('x-www-form-urlencoded')) {
              socket.emit('post_received', request.body);
              response.status(200);
              response.end();
        } else {
          response.status(400);
          response.end();
        }
      } catch {
        response.status(500);
        response.end();
      }
    });

    expressApp.patch('/posturl', (request, response) => {
      try {
        if (request.headers["content-type"].includes('json') || 
            request.headers["content-type"].includes('x-www-form-urlencoded')) {
              socket.emit('post_received', request.body);
              response.status(200);
              response.end();
        } else {
          response.status(400);
          response.end();
        }
      } catch {
        response.status(500);
        response.end();
      }
    });

    expressApp.put('/posturl', (request, response) => {
      try {
        if (request.headers["content-type"].includes('json') || 
            request.headers["content-type"].includes('x-www-form-urlencoded')) {
              socket.emit('post_received', request.body);
              response.status(200);
              response.end();
        } else {
          response.status(400);
          response.end();
        }
      } catch {
        response.status(500);
        response.end();
      }
    });

    expressApp.delete('/posturl', (request, response) => {
      try {
        if (request.headers["content-type"].includes('json') || 
            request.headers["content-type"].includes('x-www-form-urlencoded')) {
              socket.emit('post_received', request.body);
              response.status(200);
              response.end();
        } else {
          response.status(400);
          response.end();
        }
      } catch {
        response.status(500);
        response.end();
      }
    });
  });

  io.on('disconnect', () => {
    console.log('a user disconnected');
  });
}
app.on('ready', createWindow);
