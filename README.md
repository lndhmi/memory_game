

- Saisie du nom d’utilisateur et choix du niveau (Facile, Moyen, Difficile, Sans chrono)
  Les niveaux possibles:
     - Facile : peu de cartes, chrono plus long
     - Moyen : nombre moyen de cartes, chrono modéré
     - Difficile : beaucoup de cartes, chrono court
     - Sans chrono : libre, sans limite de temps
- Démarrage automatique du chrono dès la première carte retournée
- Bouton **Refresh** pour relancer le jeu avec un nouveau mélange et réinitialiser le chrono
- Message de victoire ou de défaite avec bouton **Enregistrer le score**
- Sauvegarde des scores (nom, niveau, temps, nombre de coups) dans une base de données MySQL
  
- Frontend : HTML, CSS, JavaScript
  - Disposition des cartes avec `display: grid`
  - Chronomètre avec `setInterval()`
  - Mélange des cartes et gestion du niveau avec `.slice()`
  - Comparaison des cartes via des conditions JavaScript
- Backend : PHP
  - Envoi des données à la base MySQL
  - Requête SQL pour insérer les scores
