<?php
include("db.php");
if($_SERVER['REQUEST_METHOD'] == 'POST') {

    if(isset($_POST['ajouterSignature'])) {
     $NomS=$_POST['NomPorteur'];
     $PrenomS=$_POST['PrenomPorteur'];
     $PaysS=$_POST['PaysPetition'];
     $DescriptionS=$_POST['DescriptionPetition'];
     $TitreP=$_POST['TitrePetition'];
     $EmailS=$_POST['EmailPorteurSignature'];
        $requete = "SELECT IDP FROM petition WHERE TitreP = :titre";
        $stmt = $conne->prepare($requete);
        $stmt->execute([':titre' => $TitreP]);
        $IDP = $stmt->fetchColumn();
    if ($IDP) {
            // 🔹 2. Insérer la signature (on utilise une requête préparée)
            $requete = "INSERT INTO signature (IDP, NomS, PrenomS, PaysS, EmailS) 
                        VALUES (:idp ,:nom, :prenom, :pays, :email)";
            $stmt = $conne->prepare($requete);
            $stmt->execute([
                ':idp' => $IDP,
                ':nom' => $NomS,
                ':prenom' => $PrenomS,
                ':pays' => $PaysS,
                ':email' => $EmailS
            ]);

            // 🔹 3. Redirection après succès
            header("Location: ListePetition.php");
            exit();
        } else {
            echo "⚠️ Erreur : aucune pétition trouvée avec ce titre.";
            
        }
    }
}
