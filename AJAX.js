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

// --- TRAITEMENT DU FORMULAIRE PÉTITION ---
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPetition");
  const modal = document.getElementById("modalPetition"); // Renamed to avoid conflict
  const tableContainer = document.getElementById("Petitionn");

  if (!form) return; // sécurité

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // empêche le rechargement

    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "AjouterPetition.php", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // Requête terminée
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);

            if (response.success) {
              // Fermer la modale
              modal.classList.add("hidden");
              document.body.style.overflow = "auto";

              // --- NOTIFICATION CORRIGÉE ---
              if (notificationModal) {
                const title = notificationModal.querySelector("h2");
                if (title) title.innerText = "✅ Nouvelle pétition ajoutée !";
                notificationModal.classList.remove("hidden");
                setTimeout(() => {
                  notificationModal.classList.add("hidden");
                  if (title) title.innerText = "Notification"; // Reset title
                }, 3000);
              }

              // Actualiser la liste des pétitions
              actualiserListe();
            } else {
              alert("Erreur lors de l’ajout de la pétition : " + response.message);
            }
          } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
            console.log("Réponse brute :", xhr.responseText);
          }
        } else {
          console.error("Erreur serveur :", xhr.status);
        }
      }
    };

    xhr.send(formData);
  });

  // Fonction pour recharger la liste des pétitions
  function actualiserListe() {
    const xhrListe = new XMLHttpRequest();
    xhrListe.open("GET", "ListePetition.php?ajax=1", true);
    xhrListe.onreadystatechange = function () {
      if (xhrListe.readyState === 4 && xhrListe.status === 200) {
        if (tableContainer) tableContainer.innerHTML = xhrListe.responseText;
      }
    };
    xhrListe.send();
  }

  // Polling: Actualiser la liste toutes les 3 secondes
  setInterval(actualiserListe, 3000);
});