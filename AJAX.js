// --- GESTION DES MODALES (SIGNATURE & PÉTITION) ---

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
  const formPetition = document.getElementById("formPetition");
  const modalPetition = document.getElementById("modalPetition");
  const tableContainer = document.getElementById("Petitionn");
  const notificationBtn = document.getElementById("notification");
  const notificationModal = document.getElementById("Notification");
  const notificationCount = document.getElementById("notification-count");
  const notificationMessage = document.getElementById("notification-message");

  if (!tableContainer) return;

  let latestPetitionId = 0;
  let newPetitions = [];
  let isViewingNotification = false;
  let notificationShown = false;

  const getLatestIdOnPage = () => {
    const firstRow = tableContainer.querySelector("tbody tr[data-id]");
    return firstRow ? parseInt(firstRow.dataset.id, 10) : 0;
  };

  latestPetitionId = getLatestIdOnPage();

  // --- AJOUT D'UNE PÉTITION ---
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
              modalPetition.classList.add("hidden");
              document.body.style.overflow = "auto";
              actualiserListe(); // Met à jour la liste après ajout
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

  // --- POLLING (vérifie s'il y a de nouvelles pétitions) ---
  const checkForNewPetitions = () => {
    if (isViewingNotification) return;

    fetch(`CheckNewPetition.php?last_id=${latestPetitionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.nouvellePetition && !notificationShown) {
          newPetitions = data.petitions;
          latestPetitionId = data.petitions[0].IdP;

          notificationCount.textContent = `+${data.count}`;
          notificationCount.classList.remove("hidden");
          notificationShown = true;

          // On actualise la liste en arrière-plan
          actualiserListe();
        }
      })
      .catch(error => console.error("Erreur de polling:", error));
  };

  setInterval(actualiserListe, 3000);

  // --- CLIC SUR LA CLOCHE ---
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      isViewingNotification = true;

      if (!notificationCount.classList.contains("hidden")) {
        let message = "🆕 Nouvelles pétitions ajoutées :\n\n";
        newPetitions.forEach((petition, index) => {
          message += `${index + 1}. "${petition.TitreP}"\n`;
        });
        notificationMessage.textContent = message;
        notificationModal.classList.remove("hidden");

        // ✅ Cacher le badge et garder l'état bloqué jusqu'à un vrai nouvel ajout
        notificationCount.classList.add("hidden");
        notificationShown = true;
      } else {
        notificationMessage.textContent = "Aucune nouvelle pétition pour le moment.";
        notificationModal.classList.remove("hidden");
      }
    });
  }

  // --- FERMER LA MODALE DE NOTIFICATION ---
  notificationModal.addEventListener("click", (e) => {
    if (e.target === notificationModal) {
      notificationModal.classList.add("hidden");
      isViewingNotification = false;
    }
  });

  // --- FONCTION ACTUALISATION LISTE ---
  function actualiserListe() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "ListePetition.php?ajax=1", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        tableContainer.innerHTML = xhr.responseText;
        latestPetitionId = getLatestIdOnPage();

        // ⚠️ NE PAS réinitialiser notificationShown ici !
        newPetitions = [];
      }
    };
    xhr.send();
  }
});
