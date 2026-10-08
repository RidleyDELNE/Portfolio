function creerLien(texte, url) {
  const lien = document.createElement('a');
  lien.textContent = texte;
  lien.href = url;
  return lien;
}

async function chargerProfil() {
  const reponse = await fetch('/api/profile');
  const profil = await reponse.json();

  document.getElementById('nom').textContent = profil.nom;
  document.getElementById('titre').textContent = profil.titre;
  document.getElementById('telephone').textContent = 'Tél. ' + profil.telephone;
  document.getElementById('adresse').textContent = profil.adresse;

  document
    .getElementById('email')
    .appendChild(creerLien(profil.email, 'mailto:' + profil.email));
  document
    .getElementById('linkedin')
    .appendChild(creerLien('LinkedIn', profil.linkedin));
}

async function chargerProjets() {
  const reponse = await fetch('/api/projects');
  const projets = await reponse.json();
  const liste = document.getElementById('liste-projets');

  projets.forEach((projet) => {
    const bloc = document.createElement('article');
    bloc.className = 'projet';

    const titre = document.createElement('h3');
    titre.textContent = projet.titre;

    const description = document.createElement('p');
    description.textContent = projet.description;

    const techno = document.createElement('p');
    techno.className = 'techno';
    techno.textContent = projet.technologies.join(' · ');

    bloc.append(titre, description, techno);
    liste.appendChild(bloc);
  });
}

chargerProfil();
chargerProjets();
const formulaire = document.getElementById('form-contact');
const retour = document.getElementById('retour-contact');

formulaire.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();

  const donnees = {
    nom: document.getElementById('nom-visiteur').value,
    email: document.getElementById('email-visiteur').value,
    message: document.getElementById('message').value,
  };

  try {
    const reponse = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees),
    });

    if (reponse.ok) {
      retour.textContent = 'Message envoyé. Merci.';
      formulaire.reset();
    } else {
      const erreur = await reponse.json();
      retour.textContent = erreur.erreur;
    }
  } catch (e) {
    retour.textContent = 'Erreur de connexion avec le serveur.';
  }
});