<?php
session_start();
include("db.php");

// Nouvelle fonction qui gère l'affichage des pétitions ET des boutons
function afficherPetitionsEtBoutons($conne) {
    // Logique de AfficherPetitions.php
    $requetePetition = "SELECT * FROM petition ORDER BY DateAjoutP DESC";
    $requ = $conne->query($requetePetition);

    if ($requ->rowCount() > 0) {
        echo '<table>';
        // On ajoute une colonne "Statut"
        echo '<thead><tr><th>Statut</th><th>Titre</th><th>Description</th><th>Porteur</th><th>Date ajout</th><th>Date fin</th></tr></thead>';
        echo '<tbody>';
        
        $compteur = 1; // Initialiser le compteur
        foreach ($requ as $row) {
            echo '<tr>';
            
            // Colonne pour le statut "Nouveau"
            echo '<td>';
            if ($compteur <= 2) { // Pour les 2 pétitions les plus récentes
                echo '<span class="badge-nouveau">Nouveau</span>';
            }
            echo '</td>';

            echo '<td>' . htmlspecialchars($row['TitreP']) . '</td>';
            echo '<td>' . nl2br(htmlspecialchars($row['DescriptionP'])) . '</td>';
            echo '<td>' . htmlspecialchars($row['NomPorteurP']) . '</td>';
            echo '<td>' . htmlspecialchars($row['DateAjoutP']) . '</td>';
            echo '<td>' . htmlspecialchars($row['DateFinP']) . '</td>';
            echo '</tr>';
            
            $compteur++; // Incrémenter le compteur
        }
        echo '</tbody></table>';
    } else {
        echo '<div class="no-data">Aucune pétition trouvée.</div>';
    }

    // On ajoute les boutons juste après le tableau
    echo '<form action="" method="post" style="margin-top: 20px;">
            <button id="ouvrireFormSignature">Ajouter une Signature</button>
            <button id="ouvrireFormPetition">Ajouter une Pétition</button>
          </form>';
}

// Gestion de l'appel AJAX
if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    afficherPetitionsEtBoutons($conne);
    exit; // Important: on arrête le script ici
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pétitions</title>
  <link rel="stylesheet" href="style.css">
</head>

<body class="body">
  <header>
    <h1>📜 Liste des Pétitions</h1>
    <button id="notification">🔔</button>
  </header>

  <div id="Petitionn" class="container">
    <?php 
    // On appelle notre nouvelle fonction pour l'affichage initial
    afficherPetitionsEtBoutons($conne); 
    ?>
  </div>


                <!-- 🪟 Modale Signature -->
        <div id="modalSignature" class="modal hidden">
          <div class="form-container">
            <h2>🖋️ Ajouter une Signature</h2>
            <form action="AjouterSignature.php" method="post">
              <label>Titre de la Pétition</label>
              <input name="TitrePetition" type="text" required>
                
              <label>Description de la Signature</label>
              <textarea name="DescriptionPetition" required></textarea>

              <label>Nom du Signataire</label>
              <input name="NomPorteur" type="text" required>

              <label>Prénom du Signataire</label>
              <input name="PrenomPorteur" type="text" required>

              <label>Email</label>
              <input name="EmailPorteurSignature" type="email" required>

              <label>Pays</label>
              <input name="PaysPetition" type="text" required>

              <button type="submit" name="ajouterSignature" class="btn-valider">Créer la Signature</button>
              <button type="button" id="fermerSignature" class="btn-fermer">Fermer</button>
            </form>
          </div>
        </div>


        <!-- 🪟 Modale Pétition -->
        <div id="modalPetition" class="modal hidden">
          <div class="form-container">
            <h2>📝 Ajouter une Pétition</h2>
            <form id="formPetition" action="AjouterPetition.php" method="POST">
              <label>Titre de la Pétition</label>
              <input name="TitrePetition" type="text" required>

              <label>Description</label>
              <input name="DescriptionPetition" type="text" required>

              <label>Porteur</label>
              <input name="NomPorteur" type="text" required>

              <label>Date de fin</label>
              <input name="DateFinPetition" type="date" required>

              <label>Email</label>
              <input name="EmailPorteurPetition" type="email" required>

              <button type="submit" name="ajouterPetition" class="btn-valider">Créer la Pétition</button>
              <button type="button" id="fermerPetition" class="btn-fermer">Fermer</button>
            </form>
          </div>
        </div>
                <!-- 🪟 Modale Notification -->
                <div id="Notification" class="modal hidden">
                  <div class="form-container" style="text-align: center;">
                    <h2 style="font-size: 1.5em; margin-bottom: 0;">Notification</h2>
                  </div>
                </div>



    <script src="AJAX.js"></script>
  </body>
  </html>
