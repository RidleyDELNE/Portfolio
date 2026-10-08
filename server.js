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

app.post('/api/contact', (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ erreur: 'Message trop long (2000 caractères max).' });
  }

  const messages = lireJSON('messages.json');
  messages.push({ nom, email, message, date: new Date().toISOString() });

  const chemin = path.join(__dirname, 'data', 'messages.json');
  fs.writeFileSync(chemin, JSON.stringify(messages, null, 2));

  res.status(201).json({ succes: true });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});