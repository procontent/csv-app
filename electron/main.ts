import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface WindowState {
  isReady: boolean;
  isLoading: boolean;
  hasError: boolean;
}

class MainWindow {
  private static instance: MainWindow;
  public window?: BrowserWindow;
  public state: WindowState = {
    isReady: false,
    isLoading: true,
    hasError: false
  };

  private constructor() {}

  public static getInstance(): MainWindow {
    if (!MainWindow.instance) {
      MainWindow.instance = new MainWindow();
    }
    return MainWindow.instance;
  }

  public create(): void {
    console.log("🛠️ Creating main Electron window...");
    this.window = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: path.join(__dirname, '../preload.ts'),
        contextIsolation: true,
        nodeIntegration: false
      },
      show: false // Hide until ready
    });

    const startURL = app.isPackaged
      ? `file://${path.resolve(__dirname, '../dist/index.html')}`
      : 'http://localhost:5173';

    this.setupEventHandlers(startURL);
  }

  private setupEventHandlers(startURL: string): void {
    this.window?.once('ready-to-show', () => {
      this.state.isLoading = false;
      this.state.isReady = true;
      this.window?.show();
      this.window?.webContents.openDevTools();
    });

    this.window?.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(`❌ Failed to load: ${errorDescription} (Error Code: ${errorCode})`);
      this.state.hasError = true;
      this.state.isLoading = false;
      
      if (!app.isPackaged) {
        setTimeout(() => {
          this.window?.reload();
        }, 5000);
      }
    });
  }
}

const mainWindow = MainWindow.getInstance();

// IPC handlers for file operations
ipcMain.handle('get-directory-contents', async (event, directoryPath) => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    return files;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    throw error;
  }
});

app.on('ready', () => {
  console.log("🚀 Electron App Ready");
  mainWindow.create();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log("👋 Quitting Electron App");
    app.quit();
  }
});