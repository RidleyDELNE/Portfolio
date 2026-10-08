const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function lireJSON(nomFichier) {
  const chemin = path.join(__dirname, 'data', nomFichier);
  return JSON.parse(fs.readFileSync(chemin, 'utf8'));
}

app.get('/api/profile', (req, res) => {
  res.json(lireJSON('profile.json'));
});

app.get('/api/projects', (req, res) => {
  res.json(lireJSON('projects.json'));
});

app.post('/api/contact', async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
  }

  if (nom.length > 100 || email.length > 200 || message.length > 2000) {
    return res.status(400).json({ erreur: 'Un des champs est trop long.' });
  }

  try {
    const reponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: [process.env.EMAIL_DESTINATAIRE],
        reply_to: email,
        subject: `Nouveau message de ${nom}`,
        text: `Nom : ${nom}\nEmail : ${email}\n\n${message}`,
      }),
    });

    if (!reponse.ok) {
      console.error('Erreur Resend :', await reponse.text());
      return res.status(500).json({ erreur: "Le message n'a pas pu être envoyé." });
    }

    res.status(201).json({ succes: true });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Erreur du serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});