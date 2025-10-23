<?php
session_start();
include("db.php");

header('Content-Type: application/json');

$lastSeenId = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

// 1. Compter le nombre de nouvelles pétitions
$requeteCount = $conne->prepare("SELECT COUNT(*) as count FROM petition WHERE IdP > ?");
$requeteCount->execute([$lastSeenId]);
$resultCount = $requeteCount->fetch(PDO::FETCH_ASSOC);
$newPetitionsCount = (int)$resultCount['count'];

if ($newPetitionsCount > 0) {
    // 2. Si de nouvelles pétitions existent, récupérer toutes les nouvelles
    $requeteLatest = $conne->prepare("SELECT IdP, TitreP FROM petition WHERE IdP > ? ORDER BY IdP DESC");
    $requeteLatest->execute([$lastSeenId]);
    $newPetitions = $requeteLatest->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'nouvellePetition' => true,
        'count' => $newPetitionsCount,
        'petitions' => $newPetitions
    ]);
} else {
    // Aucune nouvelle pétition
    echo json_encode(['nouvellePetition' => false]);
}
?>