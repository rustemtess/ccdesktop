const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        },
        autoHideMenuBar: true, // ЭТО СКРОЕТ МЕНЮ АВТОМАТИЧЕСКИ
        menu: null, // ЭТО ПОЛНОСТЬЮ УДАЛИТ МЕНЮ
        title: 'Центр компетенций'
    });

    win.loadFile('menu.html');

    // Отслеживание настоящих событий
    win.on('maximize', () => {
        win.webContents.send('maximize-changed', true);
    });

    win.on('unmaximize', () => {
        win.webContents.send('maximize-changed', false);
    });
    win.maximize();

    Menu.setApplicationMenu(null);
};

app.whenReady().then(createWindow);
ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.maximize();
    }
});
ipcMain.on('window-close', () => win.close());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
