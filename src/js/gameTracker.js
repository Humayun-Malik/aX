// const { spawn } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// // Function to launch and track the game using Task Manager (tasklist)
// async function trackGame(gamePath, gameName, executableName) {
//     const startTime = new Date();
//     console.log(`Launching ${gameName} from path: ${gamePath}`);

//     // Launch the game process with shell enabled for cross-platform compatibility
//     const gameProcess = spawn(gamePath, [], { shell: true });
//     const gamePid = gameProcess.pid;
//     console.log(`${gameName} process started with PID: ${gamePid}`);

//     // Track the game process using tasklist
//     const intervalId = setInterval(async () => {
//         console.log("Checking task manager...");

//         // Execute tasklist command to check for the game process
//         exec('tasklist', (err, stdout, stderr) => {
//             if (err || stderr) {
//                 console.error(`Error running tasklist: ${err || stderr}`);
//                 return;
//             }

//             // Check if the game's executable is running by looking for its name in the task list
//             if (stdout.toLowerCase().includes(executableName.toLowerCase())) {
//                 const duration = Math.floor((new Date() - startTime) / 1000);  // Duration in seconds
//                 console.log(`${gameName} running for ${formatDuration(duration)}`);
//             } else {
//                 console.log(`${gameName} is no longer running in Task Manager.`);
//                 clearInterval(intervalId);  // Stop tracking once the game is no longer running
//                 const endTime = new Date();
//                 console.log(`Start Time: ${startTime.toISOString()}`);
//                 console.log(`End Time: ${endTime.toISOString()}`);
//                 saveSession(gameName, startTime, endTime, gamePid);  // Save session with game PID
//             }
//         });
//     }, 1000); // Check every second

//     // Handle errors and closure events of the game process
//     gameProcess.on('error', (err) => {
//         console.error(`Error launching ${gameName}: ${err.message}`);
//         clearInterval(intervalId);  // Ensure interval is cleared on error
//     });

//     gameProcess.on('close', (code, signal) => {
//         console.log(`${gameName} process closed with code: ${code}, signal: ${signal}`);
//         clearInterval(intervalId);  // Ensure interval is cleared when the game closes
//     });

//     gameProcess.on('exit', (code) => {
//         console.log(`${gameName} process exited with code: ${code}`);
//         clearInterval(intervalId);  // Ensure interval is cleared when the game exits
//     });
// }

// // Helper function to format the duration into HH:mm:ss
// function formatDuration(durationInSeconds) {
//     const hours = Math.floor(durationInSeconds / 3600);
//     const minutes = Math.floor((durationInSeconds % 3600) / 60);
//     const seconds = durationInSeconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

// // Function to save game session data to a file
// function saveSession(gameName, startTime, endTime, gamePid) {
//     const dirPath = path.join(__dirname, 'data');  // Adjusted for better readability
//     const sessionPath = path.join(dirPath, 'game_sessions.json');
//     const duration = Math.floor((endTime - startTime) / 1000);  // Duration in seconds

//     // Ensure the data directory exists
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//     }

//     const session = {
//         gameName,
//         gamePid,
//         startTime: startTime.toISOString(),
//         endTime: endTime.toISOString(),
//         duration: formatDuration(duration),
//     };

//     // Read and write the session data
//     fs.readFile(sessionPath, 'utf8', (err, data) => {
//         let sessions = [];
//         if (!err && data) {
//             try {
//                 sessions = JSON.parse(data);
//             } catch (parseErr) {
//                 console.error(`Error parsing session data: ${parseErr.message}`);
//             }
//         }

//         // Append new session to existing sessions
//         sessions.push(session);

//         // Write updated sessions data to file
//         fs.writeFile(sessionPath, JSON.stringify(sessions, null, 2), (writeErr) => {
//             if (writeErr) {
//                 console.error(`Error saving session: ${writeErr.message}`);
//             } else {
//                 console.log(`Session for ${gameName} saved successfully.`);
//             }
//         });
//     });
// }

// module.exports = { trackGame };

const { spawn, exec } = require('child_process');

const fs = require('fs');
const path = require('path');

// Function to fetch all user processes (excluding system background processes)
// Function to fetch all user processes (excluding system background processes)
function getUserProcesses() {
    return new Promise((resolve, reject) => {
        // Execute the 'tasklist' command to get all running processes
        exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
            if (err || stderr) {
                return reject(`Error running tasklist: ${err || stderr}`);
            }

            // Parse the output from tasklist into an array of processes
            const processes = parseTasklistOutput(stdout);

            // Filter out background/system processes (i.e., those with "Services" or "Console" as session name, and other system processes)
            const systemProcesses = [
                'System', 'svchost.exe', 'services.exe', 'lsass.exe', 'winlogon.exe', 
                'taskhostw.exe', 'explorer.exe', 'cmd.exe', 'conhost.exe', 'msedge.exe', // Adjust or add based on your environment
            ];

            const userProcesses = processes.filter(process => {
                return (
                    process.sessionName !== '"Services"' &&
                    process.sessionName !== '"Console"' &&
                    !systemProcesses.includes(process.imageName.toLowerCase())
                );
            });

            resolve(userProcesses);
        });
    });
}

// Parse the CSV output from tasklist
function parseTasklistOutput(output) {
    const lines = output.trim().split('\n');
    const processes = lines.map((line) => {
        const [imageName, pid, sessionName, sessionNumber, memUsage] = line.split(',');
        return {
            imageName: imageName.replace(/"/g, ''),
            pid: pid.replace(/"/g, ''),
            sessionName: sessionName.replace(/"/g, ''),
            sessionNumber: sessionNumber.replace(/"/g, ''),
            memUsage: memUsage.replace(/"/g, ''),
        };
    });
    return processes;
}


// Function to display all user processes (apps)
async function displayUserProcesses() {
    try {
        const processes = await getUserProcesses();
        console.log('Active User Applications:\n');
        processes.forEach((process) => {
            console.log(`App Name: ${process.imageName}, PID: ${process.pid}, Memory Usage: ${process.memUsage}`);
        });
    } catch (err) {
        console.error('Error fetching user processes:', err);
    }
}

// Function to launch and track the game using Task Manager (tasklist)
async function trackGame(gamePath, gameName, executableName) {
    const startTime = new Date();
    console.log(`Launching ${gameName} from path: ${gamePath}`);

    // Launch the game process with shell enabled for cross-platform compatibility
    const gameProcess = spawn(gamePath, [], { shell: true });
    const gamePid = gameProcess.pid;
    console.log(`${gameName} process started with PID: ${gamePid}`);

    // Track the game process using tasklist
    const intervalId = setInterval(async () => {
        console.log("Checking task manager...");

        // Execute tasklist command to check for the game process
        exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(`Error running tasklist: ${err || stderr}`);
                return;
            }

            // Parse the output and check if the game's executable is running
            const processes = parseTasklistOutput(stdout);
            const gameRunning = processes.some((process) => process.imageName === executableName);

            if (gameRunning) {
                const duration = Math.floor((new Date() - startTime) / 1000);  // Duration in seconds
                console.log(`${gameName} running for ${formatDuration(duration)}`);
            } else {
                console.log(`${gameName} is no longer running in Task Manager.`);
                clearInterval(intervalId);  // Stop tracking once the game is no longer running
                const endTime = new Date();
                console.log(`Start Time: ${startTime.toISOString()}`);
                console.log(`End Time: ${endTime.toISOString()}`);
                saveSession(gameName, startTime, endTime, gamePid);  // Save session with game PID
            }
        });
    }, 1000); // Check every second

    // Handle errors and closure events of the game process
    gameProcess.on('error', (err) => {
        console.error(`Error launching ${gameName}: ${err.message}`);
        clearInterval(intervalId);  // Ensure interval is cleared on error
    });

    gameProcess.on('close', (code, signal) => {
        console.log(`${gameName} process closed with code: ${code}, signal: ${signal}`);
        clearInterval(intervalId);  // Ensure interval is cleared when the game closes
    });

    gameProcess.on('exit', (code) => {
        console.log(`${gameName} process exited with code: ${code}`);
        clearInterval(intervalId);  // Ensure interval is cleared when the game exits
    });
}

// Helper function to format the duration into HH:mm:ss
function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to save game session data to a file
function saveSession(gameName, startTime, endTime, gamePid) {
    const dirPath = path.join(__dirname, 'data');  // Adjusted for better readability
    const sessionPath = path.join(dirPath, 'game_sessions.json');
    const duration = Math.floor((endTime - startTime) / 1000);  // Duration in seconds

    // Ensure the data directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const session = {
        gameName,
        gamePid,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: formatDuration(duration),
    };

    // Read and write the session data
    fs.readFile(sessionPath, 'utf8', (err, data) => {
        let sessions = [];
        if (!err && data) {
            try {
                sessions = JSON.parse(data);
            } catch (parseErr) {
                console.error(`Error parsing session data: ${parseErr.message}`);
            }
        }

        // Append new session to existing sessions
        sessions.push(session);

        // Write updated sessions data to file
        fs.writeFile(sessionPath, JSON.stringify(sessions, null, 2), (writeErr) => {
            if (writeErr) {
                console.error(`Error saving session: ${writeErr.message}`);
            } else {
                console.log(`Session for ${gameName} saved successfully.`);
            }
        });
    });
}
displayUserProcesses();

module.exports = { trackGame, displayUserProcesses };

