const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const { create } = require('domain');

let win;

function createWindow(){
    //Create browser window
    win = new BrowserWindow({width: 1000, height: 800});

    //Load index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.maximize();
    //Open devtools
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});
