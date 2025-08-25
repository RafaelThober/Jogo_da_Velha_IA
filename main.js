const { app, BrowserWindow } = require('electron');
const path = require('path');

// Workarounds para evitar erros de cache em ambientes com permissões restritas:
// - desabilita aceleração por hardware (antes de whenReady)
// - define um diretório de userData local no projeto
app.disableHardwareAcceleration();
app.setPath('userData', path.join(__dirname, 'user-data'));

function createWindow() {
  const WIN_SIZE = 700;
  const win = new BrowserWindow({
    width: WIN_SIZE,
    height: WIN_SIZE,
    useContentSize: true,
    resizable: false,
    minWidth: 420,
    minHeight: 420,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.removeMenu();
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
