const { ipcRenderer } = require('electron');
const games = require('../data/games.json'); // Load games.json

document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');

    games.forEach((game) => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <h3>${game.name}</h3>
            <button onclick="launchGame('${game.path}', '${game.name}')">Launch</button>
            <p id="duration-${game.name.replace(/\s+/g, '-')}" class="duration"></p>
        `;
        gameList.appendChild(gameCard);
    });
});

document.getElementById('home-btn').onclick = function() {
    window.location.href = 'profile.html'; // Replace with the correct home page URL
};
document.getElementById('add-game-btn').onclick = function() {
    window.location.href = 'add-game.html'; // Replace with the correct home page URL
};

// Launch the game and start tracking
function launchGame(gamePath, gameName) {
    // Sanitize path and log it
    const sanitizedPath = gamePath.replace(/\\/g, '\\\\');
    const normalizedPath=`"${sanitizedPath}"`
    console.log(`Game/////////////////// Path: ${normalizedPath}`); // Debugging log

    // Send sanitized path to the main process
    ipcRenderer.send('launch-game', { gamePath: normalizedPath, gameName });
}
