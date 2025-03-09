// electron/preload.ts
import { contextBridge } from 'electron';
contextBridge.exposeInMainWorld('api', {
    getPath: function () { return import.meta.url; },
});
// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
function createWindow() {
    console.log("🛠️ Creating main Electron window...");
    var mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, '../preload.ts'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    var startURL = app.isPackaged
        ? "file://".concat(path.resolve(__dirname, '../dist/index.html'))
        : 'http://localhost:5173';
    mainWindow.webContents.once('dom-ready', function () {
        console.log("✅ DOM is ready, opening DevTools...");
        mainWindow.webContents.openDevTools();
    });
    console.log("\uD83D\uDD17 Attempting to load URL: ".concat(startURL));
    mainWindow.loadURL(startURL);
    mainWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
        console.error("\u274C Failed to load: ".concat(errorDescription, " (Error Code: ").concat(errorCode, ")"));
    });
    mainWindow.webContents.on('console-message', function (event, level, message) {
        console.log("\uD83D\uDDA5\uFE0F [Renderer Console] ".concat(message));
    });
}
app.whenReady().then(function () {
    console.log("🚀 Electron App Ready");
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        console.log("👋 Quitting Electron App");
        app.quit();
    }
});
