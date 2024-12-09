const { app, BrowserWindow, ipcMain } = require('electron');
const { startAppScreenTimeTracking } = require('./src/js/screenTimeTracker');
const { trackGame } = require('./src/js/gameTracker');

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Important for accessing node modules in renderer process
        },
    });

    // Load the main page (e.g., login page or game shortcuts page)
    win.loadFile('src/pages/login.html');

    // Start tracking screen time when the app window is created
         startAppScreenTimeTracking();
}


// IPC handler for launching and tracking games
ipcMain.on('launch-game', (event, { gamePath, gameName }) => {
    console.log(`Received request to launch: ${gameName}`);
    console.log(`Received request to launch: ${gamePath}`);

    trackGame(gamePath, gameName);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// const { app, BrowserWindow, ipcMain } = require('electron');
// const { startAppScreenTimeTracking } = require('./src/js/screenTimeTracker');
// const { trackGame } = require('./src/js/gameTracker');

// // Keep a reference to the window object to avoid garbage collection
// let mainWindow;

// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 1100,
//         height: 750,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false, // Important for accessing node modules in renderer process
//         },
//     });

//     // Load the main page (e.g., login page or game shortcuts page)
//     mainWindow.loadFile('src/pages/home.html');

//     // Start tracking screen time when the main window is created
//     startAppScreenTimeTracking(mainWindow); // Pass the window reference if needed for UI updates
// }

// // IPC handler for launching and tracking games
// ipcMain.on('launch-game', (event, { gamePath, gameName }) => {
//     console.log(`Received request to launch: ${gameName}`);
//     trackGame(gamePath, gameName);
// });

// app.whenReady().then(() => {
//     createWindow();

//     app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//         }
//     });
// });

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });
