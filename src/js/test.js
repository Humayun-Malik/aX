const psList = require('ps-list');
const fs = require('fs');

let trackedApps = ['chrome.exe', 'msedge.exe', 'Code.exe']; // Process names for Chrome, Edge, and VS Code
let appTrackingData = {}; // To store active app tracking details

/**
 * Monitor running processes and track specific applications.
 */
async function trackApps() {
    const processes = await psList();
    const runningApps = processes.filter(proc => trackedApps.includes(proc.name));

    const currentTime = new Date();

    // Track new apps that start
    runningApps.forEach(app => {
        if (!appTrackingData[app.name]) {
            appTrackingData[app.name] = {
                startTime: currentTime,
                endTime: null,
            };
            console.log(`Started tracking ${app.name} at ${currentTime}`);
        }
    });

    // Check for apps that have stopped
    Object.keys(appTrackingData).forEach(appName => {
        if (!runningApps.some(app => app.name === appName) && appTrackingData[appName].endTime === null) {
            appTrackingData[appName].endTime = currentTime;
            console.log(`Stopped tracking ${appName} at ${currentTime}`);
            saveAppData(appName, appTrackingData[appName]); // Save to file
            delete appTrackingData[appName]; // Remove app from active tracking
        }
    });
}

/**
 * Save app data to a file for persistent storage.
 */
function saveAppData(appName, data) {
    const logData = {
        app: appName,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: `${Math.round((data.endTime - data.startTime) / 1000)} seconds`,
    };

    fs.appendFileSync('appTrackingLog.json', JSON.stringify(logData, null, 2) + ',\n');
    console.log(`App data saved: ${JSON.stringify(logData)}`);
}

/**
 * Periodically check for active apps.
 */
setInterval(() => {
    trackApps();
}, 5000); // Check every 5 seconds
