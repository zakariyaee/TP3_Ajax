// --- FORMULAIRE SIGNATURE ---
const modalSignature = document.getElementById("modalSignature");
const openSignature = document.getElementById("ouvrireFormSignature");
const closeSignature = document.getElementById("fermerSignature");

if (openSignature && closeSignature) {
  openSignature.addEventListener("click", (e) => {
    e.preventDefault();
    modalSignature.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closeSignature.addEventListener("click", () => {
    modalSignature.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  modalSignature.addEventListener("click", (e) => {
    if (e.target === modalSignature) modalSignature.classList.add("hidden");
  });
}

// --- FORMULAIRE PÉTITION ---
const modalPetition = document.getElementById("modalPetition");
const openPetition = document.getElementById("ouvrireFormPetition");
const closePetition = document.getElementById("fermerPetition");

if (openPetition && closePetition) {
  openPetition.addEventListener("click", (e) => {
    e.preventDefault();
    modalPetition.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closePetition.addEventListener("click", () => {
    modalPetition.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  modalPetition.addEventListener("click", (e) => {
    if (e.target === modalPetition) modalPetition.classList.add("hidden");
  });
}

// --- NOTIFICATION ---
const notificationBtn = document.getElementById("notification");
const notificationModal = document.getElementById("Notification");

if (notificationBtn && notificationModal) {
  notificationBtn.addEventListener("click", (e) => {
    e.preventDefault();
    notificationModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    notificationModal.addEventListener("click", (e) => {
      if (e.target === notificationModal) {
        notificationModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  });
}

// --- TRAITEMENT AJAX ET NOTIFICATIONS ---
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPetition");
  const modal = document.getElementById("modalPetition");
  const tableContainer = document.getElementById("Petitionn");

  if (!tableContainer) return; // Sécurité

  // On compte le nombre initial de pétitions
  let petitionCount = tableContainer.querySelectorAll("tbody tr").length;

  // --- GESTION DE L'AJOUT D'UNE PÉTITION ---
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // empêche le rechargement

      const formData = new FormData(form);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "AjouterPetition.php", true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Fermer la modale d'ajout
              modal.classList.add("hidden");
              document.body.style.overflow = "auto";

              // Afficher une notification de succès pour l'utilisateur qui a ajouté
              afficherNotification("✅ Nouvelle pétition ajoutée !");

              // Actualiser la liste immédiatement
              actualiserListeEtNotifier(true);
            } else {
              alert("Erreur lors de l’ajout : " + response.message);
            }
          } catch (error) {
            console.error("Erreur JSON :", error, xhr.responseText);
          }
        }
      };
      xhr.send(formData);
    });
  }

  // --- FONCTION DE NOTIFICATION GÉNÉRIQUE ---
  function afficherNotification(message) {
    if (notificationModal) {
      const title = notificationModal.querySelector("h2");
      if (title) title.innerText = message;
      
      notificationModal.classList.remove("hidden");
      
      // Cacher la notification après 3 secondes
      setTimeout(() => {
        notificationModal.classList.add("hidden");
        if (title) title.innerText = "Notification"; // Reset
      }, 3000);
    }
  }

  // --- FONCTION POUR RECHARGER LA LISTE ET VÉRIFIER LES NOUVEAUTÉS ---
  function actualiserListeEtNotifier(forceUpdate = false) {
    const xhrListe = new XMLHttpRequest();
    xhrListe.open("GET", "ListePetition.php?ajax=1", true);
    xhrListe.onreadystatechange = function () {
      if (xhrListe.readyState === 4 && xhrListe.status === 200) {
        if (tableContainer) {
          tableContainer.innerHTML = xhrListe.responseText;
          const newPetitionCount = tableContainer.querySelectorAll("tbody tr").length;

          // Si le nbr de pétitions a augmenté et que ce n'est pas le 1er chargement
          if (newPetitionCount > petitionCount && !forceUpdate) {
            afficherNotification("🔔 Une nouvelle pétition est disponible !");
          }

          // Mettre à jour le compteur
          petitionCount = newPetitionCount;
        }
      }
    };
    xhrListe.send();
  }

  // Polling: Actualiser la liste toutes les 3 secondes
  setInterval(actualiserListeEtNotifier, 3000);
});
