const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let demoPath = path.join(__dirname, 'demos', 'space', 'index.html');

async function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    transparent: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(demoPath);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.setAlwaysOnTop(false, 'normal');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setSkipTaskbar(true);

  // Prevent the window from being minimized when "Show Desktop" is pressed
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.restore();
  });
}

function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Hyperpaper Settings',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
}

ipcMain.on('update-demo', (event, demo) => {
  demoPath = path.join(__dirname, 'demos', demo, 'index.html');
  console.log(`Changing wallpaper to: ${demoPath}`);
  if (mainWindow) {
    mainWindow.loadFile(demoPath);
    mainWindow.reload();
  }
});

app.whenReady().then(() => {
  createWindow();

  // Register a global shortcut to open the settings window
  globalShortcut.register('Control+Shift+I', () => {
    createSettingsWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
