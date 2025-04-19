<?php
// Connexion à la base de données
$mysqlClient = new PDO(
    'mysql:host=localhost;port=3307;dbname=memory_game;charset=utf8',
    'root',
    '',
[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION] 
);

// Si l'utilisateur est redirigé depuis la page de formulaire (index.php), récupérez les données
$username = isset($_GET['username']) ? $_GET['username'] : ''; // Récupère le nom d'utilisateur
$difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : ''; // Récupère la difficulté

// Si vous voulez récupérer le score et le temps après avoir joué
$score = $_POST['score'] ?? 0; // Remplacer avec le vrai score calculé dans le jeu
$time = $_POST['time'] ?? ''; // Remplacer avec le temps du jeu

if ($username && $score && $time) {
  // 1. Vérifie si l'utilisateur existe dans la table `users`
  $sql = $mysqlClient->prepare('SELECT id FROM users WHERE username = :username');
  $sql->execute(['username' => $username]);
  $user = $sql->fetch();

  // Si l'utilisateur n'existe pas, on l'ajoute à la table `users`
  if (!$user) {
      $sql = $mysqlClient->prepare('INSERT INTO users (username) VALUES (:username)');
      $sql->execute(['username' => $username]);
      $user_id = $mysqlClient->lastInsertId(); // Récupère l'id de l'utilisateur ajouté
  } else {
      $user_id = $user['id']; // Si l'utilisateur existe, on récupère son id
  }

  // 2. Enregistrer la performance dans la table `performances`
  $sql = $mysqlClient->prepare('INSERT INTO performances (user_id, time, difficulty 
   ) VALUES (:user_id, :score, :time, :difficulty)');
  $sql->execute([
      'user_id' => $user_id,
      'time' => $time,
      'difficulty' => $difficulty
  ]);

}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Jeu de Memory</title>
  <link rel="stylesheet" href="jeu.css"/>
</head>
<body>
  <h2>Memory game</h2>

  <div class="gameInfo">
    <span id="moveCounter">Moves: 0</span>
    <span id="timer">Time: 00:00</span>
  </div>

  <p id="encouragement">Bonne chance !</p>

  <div class="memory-game"></div>

  <!-- Message de victoire -->
  <div class="winning-message" >
    Bravo, vous avez gagné !
    <!-- Formulaire envoyé seulement à la victoire -->
    <form action="jeu.php" method="POST">
        <input type="text" name="username" placeholder="Votre nom" required />
        <input type="text" name="moves" placeholder="Nombre de coups" required />
        <input type="text" name="time" placeholder="Temps" required />
        <button type="submit">Enregistrer mon score</button>
    </form>
    <!-- Afficher les scores -->
    <button id="showScoresBtn">Afficher les scores</button>
  </div>

<!-- Message de défaite -->
  <div class="losing-message">
    Vous avez perdu, essayez encore !
    <!-- Formulaire envoyé seulement à la défaite -->
    <form action="jeu.php" method="POST">
        <input type="text" name="username" placeholder="Votre nom" required />
        <input type="text" name="moves" placeholder="Nombre de coups" required />
        <input type="text" name="time" placeholder="Temps" required />
        <button type="submit">Enregistrer ma tentative</button>
    </form>
    <!-- Afficher les scores -->
    <button id="showScoresBtn">Afficher les scores</button>
  </div>


  <div class="button-group">
    <button id="resetButton" class="btn">Reset</button>
    <button id="backButton" class="btn">Back</button>
  </div>
  
  <script src="jeu.js"></script>
</body>
</html>


