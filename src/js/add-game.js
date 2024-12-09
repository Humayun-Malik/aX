const fs = require('fs');
const path = require('path');

function addGame() {
    // Get values from the input fields
    const gameName = document.getElementById('gameName').value;
    const gamePath = document.getElementById('gamePath').value;

    // Simple validation to ensure both fields are filled
    if (!gameName || !gamePath) {
        document.getElementById('feedback').textContent = "Both fields are required!";
        return;
    }

    // Format the path (replace single backslashes with double backslashes)
    const formattedPath = gamePath.replace(/\\/g, '\\\\');

    // Read the existing games.json file
    const gamesFilePath = path.join(__dirname, '../data/games.json');
    
    fs.readFile(gamesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(gamesFilePath);  // Log the path to ensure it's correct

            document.getElementById('feedback').textContent = "Error reading the game list.";
            return;
        }

        let games = JSON.parse(data);

        // Check if the game already exists in the list
        const gameExists = games.some(game => game.name === gameName && game.path === formattedPath);

        if (gameExists) {
            document.getElementById('feedback').textContent = "This game already exists in the list.";
            return;
        }

        // Add the new game to the list
        games.push({
            name: gameName,
            path: formattedPath
        });

        // Write the updated game list back to the file
        fs.writeFile(gamesFilePath, JSON.stringify(games, null, 4), 'utf8', (err) => {
            if (err) {
                document.getElementById('feedback').textContent = "Error saving the game list.";
                return;
            }
            document.getElementById('feedback').textContent = "Game added successfully!";
        });
    });
}
