const {
	Menu, MenuItem, app, BrowserWindow, dialog
} = require('electron');
const isDev = require('electron-is-dev');
const {
	autoUpdater
} = require("electron-updater");
const DiscordRPC = require('discord-rpc');

//const {app, BrowserWindow} = require('electron');
const path = require('path');

let pluginName
switch (process.platform) {
	case 'win32':
		pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
		break
	case 'darwin':
		pluginName = 'flash/PepperFlashPlayer.plugin'
		break
	case 'linux':
		pluginName = 'flash/libpepflashplayer.so'
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

autoUpdater.checkForUpdatesAndNotify();
let mainWindow;

function clearCache() {
	mainWindow.webContents.session.clearCache();
}

function createMenu() {
	fsmenu = new Menu();
	fsmenu.append(new MenuItem({
		label: 'Y Pantalla Completa',
		accelerator: 'CmdOrCtrl+F',
		click: () => {
			mainWindow.setFullScreen(!mainWindow.isFullScreen());
		}
	}));
		fsmenu.append(new MenuItem({
		label: 'Limpiar Caché',
		click: () => {
			mainWindow.webContents.session.clearCache();
		}
	}));
	return fsmenu
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		title: "Connecting...",
		icon: __dirname + '/favicon.ico',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			plugins: true
		}
	});

	mainWindow.setMenu(null);
	// New URL!
	Menu.setApplicationMenu(createMenu());
	mainWindow.loadURL('https://play.magistralpenguin.com/');

  const clientId = '848126810470088724'; DiscordRPC.register(clientId); const rpc = new DiscordRPC.Client({ transport: 'ipc' }); const startTimestamp = new Date();
  rpc.on('ready', () => {
    rpc.setActivity({
      details: `Versión de escritorio`, 
      state: `Emprendiendo nuevas aventuras y creando nuevas aventuras alrededor de la isla`, 
      startTimestamp, 
      largeImageKey: `icon`, 
		});
	});
	rpc.login({
		clientId
	}).catch(console.error);

	mainWindow.on('closed', function() {
		mainWindow = null
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
	if (mainWindow === null) createWindow();
});
