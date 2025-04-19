<?php
// Connexion à la base de données
$mysqlClient = new PDO(
    'mysql:host=localhost;port=3307;dbname=memory_game;charset=utf8', // Assure-toi d'utiliser la bonne base de données
    'root',
    '',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Récupérer la difficulté de l'URL ou de la session (selon le cas)
$difficulty = $_GET['difficulty'] ?? 'moy'; // Par défaut, 'moy' (Moyen)

// Requête SQL pour récupérer les scores par difficulté, triés par temps
$sql = 'SELECT u.username, p.time, p.difficulty 
        FROM performances p
        JOIN users u ON p.user_id = u.id
        WHERE p.difficulty = :difficulty
        ORDER BY p.time ASC';
$stmt = $mysqlClient->prepare($sql);
$stmt->execute(['difficulty' => $difficulty]);

// Récupérer tous les résultats
$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classement Memory Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Classement - Niveau de difficulté: <?= htmlspecialchars($difficulty) ?></h2>

    <table>
        <thead>
            <tr>
                <th>Position</th>
                <th>Nom d'utilisateur</th>
                <th>Temps (en secondes)</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($scores as $index => $score): ?>
                <tr>
                    <td><?= $index + 1 ?></td> <!-- Position du classement -->
                    <td><?= htmlspecialchars($score['username']) ?></td>
                    <td><?= htmlspecialchars($score['time']) ?> sec</td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <a href="index.php">Retour au jeu</a>
</body>
</html>
