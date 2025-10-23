// --- GESTION DES MODALES (SIGNATURE & PÉTITION) ---

// Fonction pour initialiser une modale
function initialiserModale(idModale, idOuvrir, idFermer) {
  const modale = document.getElementById(idModale);
  const ouvrir = document.getElementById(idOuvrir);
  const fermer = document.getElementById(idFermer);

  if (modale && ouvrir && fermer) {
    ouvrir.addEventListener("click", (e) => {
      e.preventDefault();
      modale.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });

    const fermerModale = () => {
      modale.classList.add("hidden");
      document.body.style.overflow = "auto";
    };

    fermer.addEventListener("click", fermerModale);
    modale.addEventListener("click", (e) => {
      if (e.target === modale) fermerModale();
    });
  }
}

initialiserModale("modalSignature", "ouvrireFormSignature", "fermerSignature");
initialiserModale("modalPetition", "ouvrireFormPetition", "fermerPetition");

// --- SYSTÈME DE NOTIFICATION ---
document.addEventListener("DOMContentLoaded", function () {
  // Éléments du DOM
  const formPetition = document.getElementById("formPetition");
  const modalPetition = document.getElementById("modalPetition");
  const tableContainer = document.getElementById("Petitionn");
  const notificationBtn = document.getElementById("notification");
  const notificationModal = document.getElementById("Notification");
  const notificationCount = document.getElementById("notification-count");
  const notificationMessage = document.getElementById("notification-message");

  if (!tableContainer) return; // Quitter si le conteneur n'existe pas

  // Variables d'état
  let latestPetitionId = 0;
  let newPetitions = []; // Stocker toutes les nouvelles pétitions
  let isViewingNotification = false; // Pour éviter les race conditions
  let notificationShown = false; // Pour éviter les notifications répétées

  // Initialisation: récupérer l'ID de la pétition la plus récente affichée
  const getLatestIdOnPage = () => {
    const firstRow = tableContainer.querySelector("tbody tr[data-id]");
    return firstRow ? parseInt(firstRow.dataset.id, 10) : 0;
  };

  latestPetitionId = getLatestIdOnPage();

  // --- GESTION DE L'AJOUT D'UNE PÉTITION ---
  if (formPetition) {
    formPetition.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(formPetition);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "AjouterPetition.php", true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Fermer la modale et actualiser la liste
              modalPetition.classList.add("hidden");
              document.body.style.overflow = "auto";
              actualiserListe(); // On actualise pour voir notre ajout
            } else {
              alert("Erreur lors de l’ajout : " + (response.message || "Erreur inconnue."));
            }
          } catch (error) {
            console.error("Erreur JSON lors de l'ajout:", error, xhr.responseText);
          }
        }
      };
      xhr.send(formData);
    });
  }

  // --- VÉRIFICATION PÉRIODIQUE (POLLING) ---
  const checkForNewPetitions = () => {
    // Ne pas vérifier si l'utilisateur regarde déjà une notification
    if (isViewingNotification) return;

    fetch(`CheckNewPetition.php?last_id=${latestPetitionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.nouvellePetition && !notificationShown) {
          // Si de nouvelles pétitions sont trouvées et qu'on n'a pas encore montré la notif
          newPetitions = data.petitions; // On stocke toutes les nouvelles pétitions
          latestPetitionId = data.petitions[0].IdP; // On met à jour l'ID le plus récent
          notificationCount.textContent = `+${data.count}`; // Afficher le nombre exact
          notificationCount.classList.remove("hidden"); // On affiche le badge
          notificationShown = true; // Marquer comme affiché
        }
      })
      .catch(error => console.error("Erreur de polling:", error));
  };

  // Lancer la vérification toutes les 5 secondes
  setInterval(checkForNewPetitions, 5000);

  // --- GESTION DU CLIC SUR LA CLOCHE DE NOTIFICATION ---
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      isViewingNotification = true; // L'utilisateur ouvre la notif

      if (!notificationCount.classList.contains("hidden")) {
        // S'il y a une notification, on affiche toutes les nouvelles pétitions
        let message = "Nouvelles pétitions ajoutées :\n\n";
        newPetitions.forEach((petition, index) => {
          message += `${index + 1}. "${petition.TitreP}"\n`;
        });
        notificationMessage.textContent = message;
        notificationModal.classList.remove("hidden");
        notificationCount.classList.add("hidden"); // Cacher le badge
        actualiserListe(); // Mettre à jour la liste en arrière-plan
        // NE PAS réinitialiser notificationShown ici pour éviter la réapparition
      } else {
        // S'il n'y a pas de nouvelle notif, on peut ouvrir avec un message par défaut
        notificationMessage.textContent = "Aucune nouvelle pétition pour le moment.";
        notificationModal.classList.remove("hidden");
      }
    });
  }
  
  // Fermer la modale de notification
  notificationModal.addEventListener("click", (e) => {
      if (e.target === notificationModal) {
          notificationModal.classList.add("hidden");
          isViewingNotification = false; // L'utilisateur ferme la notif
      }
  });


  // --- FONCTION POUR ACTUALISER LA LISTE DES PÉTITIONS ---
  function actualiserListe() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "ListePetition.php?ajax=1", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        tableContainer.innerHTML = xhr.responseText;
        // On met à jour l'ID après l'actualisation
        latestPetitionId = getLatestIdOnPage();
        // Réinitialiser les notifications après actualisation
        notificationShown = false;
        newPetitions = [];
      }
    };
    xhr.send();
  }
});
setInterval(actualiserListe, 3000); // Actualiser toute la liste toutes les 60 secondes