<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WELCOME</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Memory game</h2>
    <form class="form" id="game-form" action="jeu.php" method="GET">
        <label for="username">Nom d'utilisateur:</label>
        <input type="text" name="username" id="username" required/><br>

        <label for="niveau">Niveau de difficulté :</label>
        <select id="niveau" name="niveau">
            <option value="fac">Facile: 8 cartes, 35 sec</option>
            <option value="moy">Moyen: 12 cartes, 40 sec</option>
            <option value="dif">Difficile: 16 cartes, 45 sec</option>
            <option value="aucun">Aucun</option>
        </select><br>
        
        <button class="btn" type="submit">Entrer</button>

    </form>
</body>
</html>