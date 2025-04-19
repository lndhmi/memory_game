document.getElementById("game-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const difficulty = document.getElementById("niveau").value;

    localStorage.setItem("playerName", username);
    localStorage.setItem("difficulty", difficulty);

    
    window.location.href = `jeu.php?username=${encodeURIComponent(username)}&difficulty=${encodeURIComponent(difficulty)}`;
});
