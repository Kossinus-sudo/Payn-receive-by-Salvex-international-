// Remplace par ta config Firebase (issue de ta console Firebase)
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "TON_SENDER_ID",
  appId: "TON_APP_ID"
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const trackBtn = document.getElementById("trackBtn");
const trackingInput = document.getElementById("trackingNumber");
const resultDiv = document.getElementById("result");

// Affichage des infos colis
function displayStatus(data) {
  if (!data) {
    resultDiv.innerHTML = `<p style="color:#cc0000;">Numéro de suivi introuvable.</p>`;
    return;
  }
  let html = `<h2>Statut de votre colis</h2>`;
  html += `<p><strong>Numéro :</strong> ${data.trackingNumber}</p>`;
  html += `<p><strong>Statut :</strong> ${data.status}</p>`;
  html += `<p><strong>Dernière mise à jour :</strong> ${data.lastUpdate}</p>`;
  if(data.location) {
    html += `<p><strong>Localisation :</strong> ${data.location}</p>`;
  }
  if(data.estimatedDelivery) {
    html += `<p><strong>Livraison estimée :</strong> ${data.estimatedDelivery}</p>`;
  }
  resultDiv.innerHTML = html;
}

// Recherche dans Firestore
async function searchTracking(number) {
  try {
    const doc = await db.collection("packages").doc(number).get();
    if (doc.exists) {
      displayStatus(doc.data());
    } else {
      displayStatus(null);
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:#cc0000;">Erreur lors de la récupération des données.</p>`;
    console.error(err);
  }
}

// Gestion bouton
trackBtn.addEventListener("click", () => {
  const num = trackingInput.value.trim();
  if (!num) {
    resultDiv.innerHTML = `<p style="color:#cc0000;">Veuillez entrer un numéro de suivi.</p>`;
    return;
  }
  resultDiv.innerHTML = `<p>Chargement...</p>`;
  searchTracking(num);
});

// Permet appuyer "Entrée" pour lancer la recherche
trackingInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    trackBtn.click();
  }
});
