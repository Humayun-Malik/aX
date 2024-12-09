const fs = require('fs');
const path = require('path');
const activeWin = require('active-win');

let gameUsage = {};
let trackedApps = [];
let currentApp = '';
let appStartTime = Date.now();

// Load games from games.json
function loadGames() {
    try {
        const filePath = path.resolve(__dirname, '../data/games.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const games = JSON.parse(data);

        // Initialize gameUsage object and trackedApps array
        games.forEach((game) => {
            gameUsage[game.name] = 0;
            trackedApps.push(game.name);
        });

        console.log('Loaded games:', trackedApps);
    } catch (error) {
        console.error('Error loading games:', error.message);
        console.error('Make sure the file exists and is correctly formatted.');
    }
}

// Function to fetch active window and calculate screen time for apps
async function trackAppScreenTime() {
    try {
        const window = await activeWin();

        if (window && window.owner) {
            const windowName = window.owner.name;
            console.log(`Active window: ${windowName}`);

            if (trackedApps.includes(windowName)) {
                if (windowName !== currentApp) {
                    // Update elapsed time for the current app
                    const currentTime = Date.now();
                    const elapsedTime = (currentTime - appStartTime) / 1000; // Time in seconds

                    if (currentApp) {
                        gameUsage[currentApp] += elapsedTime; // Update usage for previous app
                    }

                    // Switch to the new app
                    currentApp = windowName;
                    appStartTime = currentTime;
                }
            } else if (currentApp) {
                // Update elapsed time for the current tracked app
                const currentTime = Date.now();
                const elapsedTime = (currentTime - appStartTime) / 1000;

                gameUsage[currentApp] += elapsedTime;

                // Reset tracking as the active window is not tracked
                currentApp = '';
                appStartTime = currentTime;
            }
        }
    } catch (error) {
        console.error('Error tracking screen time:', error.message);
    }

    // Log updated usage data
    console.log('Current game usage:', JSON.stringify(gameUsage, null, 2));
}

// Persist game usage data to a file
function saveGameUsage() {
    try {
        const filePath = path.resolve(__dirname, '../data/game_usage.json');
        fs.writeFileSync(filePath, JSON.stringify(gameUsage, null, 2));
        console.log('Game usage data saved successfully.');
    } catch (error) {
        console.error('Error saving game usage data:', error.message);
    }
}

// Start the tracker
function startAppScreenTimeTracking() {
    loadGames(); // Load games from games.json

    const intervalId = setInterval(() => {
        trackAppScreenTime();
    }, 1000); // Update every second

    return intervalId; // Return the interval ID for later use if needed
}

// Example usage:
const trackerId = startAppScreenTimeTracking();

// Graceful termination (optional, for integration)
process.on('SIGINT', () => {
    clearInterval(trackerId);
    console.log('Final usage data:', JSON.stringify(gameUsage, null, 2));
    saveGameUsage();
    process.exit();
});

module.exports = { startAppScreenTimeTracking };
