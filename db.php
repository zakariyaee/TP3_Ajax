<?php
try {
    $conne = new PDO("mysql:host=localhost;dbname=Petition;charset=utf8", "root", "");
    $conne->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "❌ Erreur de connexion : " . $e->getMessage();
}
?>
