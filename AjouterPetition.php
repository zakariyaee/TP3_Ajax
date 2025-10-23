<?php
ob_start(); 
session_start();
include("db.php");

$response = [
    'success' => false,
    'message' => 'Requête non traitée.'
];

if($_SERVER['REQUEST_METHOD'] == 'POST') {

    
        $TitreP = $_POST['TitrePetition'];
        $DescriptionP = $_POST['DescriptionPetition'];
        $PorteurP = $_POST['NomPorteur'];
        $DateFinP = $_POST['DateFinPetition'];
        $Email = $_POST['EmailPorteurPetition']; 

    
        $requete = "INSERT INTO petition (TitreP, DescriptionP, DateFinP, NomPorteurP, Email) 
                    VALUES (:titre, :description, :datefin, :porteur, :email)";
        
        $stmt = $conne->prepare($requete);
        $ok = $stmt->execute([
            ':titre' => $TitreP,
            ':description' => $DescriptionP,
            ':datefin' => $DateFinP,
            ':porteur' => $PorteurP,
            ':email' => $Email
        ]);

        if ($ok) {
            $response['success'] = true;
            $response['message'] = 'Pétition ajoutée avec succès.';
        } else {
            $response['message'] = 'Échec de l\'insertion en base.';
        }
    
}

header('Content-Type: application/json');
ob_end_clean();
echo json_encode($response);
exit();
