<?php
session_start();
include("db.php");

// On récupère l'ID de la dernière pétition que le client connaît
$lastSeenId = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

// On cherche une pétition plus récente
$requete = $conne->prepare("SELECT IDP, TitreP FROM petition WHERE IDP > ? ORDER BY IDP DESC LIMIT 1");
$requete->execute([$lastSeenId]);

$nouvellePetition = $requete->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

if ($nouvellePetition) {
    // Si on trouve une nouvelle pétition, on renvoie ses détails
    echo json_encode([
        'nouvellePetition' => true,
        'id' => $nouvellePetition['IDP'],
        'titre' => $nouvellePetition['TitreP']
    ]);
} else {
    // Sinon, on renvoie une réponse vide
    echo json_encode(['nouvellePetition' => false]);
}
?>
