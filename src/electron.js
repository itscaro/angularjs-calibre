const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Report crashes
require('crash-reporter').start(
  {
    productName: 'angularjs-calibre',
    companyName: 'itscaro',
    submitURL: 'https://your-domain.com/url-to-submit',
    autoSubmit: false
  }
);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Start server
  //require('./server/server');

  // Menu bar
  require('./menu')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    // fullscreen: true,
    kiosk: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app/jspm.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
});
