// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Livre = require('./models/Livre');
require('./database'); // Importer la connexion MongoDB

const app = express();
const port = 3001;

// Middleware pour analyser le corps des requêtes en JSON
app.use(bodyParser.json());

// Route racine
app.get('/', (req, res) => {
res.json({ message: 'Bienvenue sur l\'API de la bibliothèque MongoDB. Utilisez /livres pour gérer les livres.' });
});

// Route pour ajouter un livre
app.post('/livres', async (req, res) => {
try {
if (mongoose.connection.readyState !== 1) {
return res.status(500).json({ message: 'Base de données non connectée' });
}
const { titre, auteur, date_publication, genre, disponible } = req.body;
const livre = new Livre({ titre, auteur, date_publication, genre, disponible });
await livre.save();
res.status(201).json({ message: 'Livre ajouté avec succès', livre });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error: err.message });
}
});

// Route pour obtenir tous les livres
app.get('/livres', async (req, res) => {
try {
const livres = await Livre.find();
res.status(200).json(livres);
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la récupération des livres', error: err });
}
});

// Route pour mettre à jour un livre
app.put('/livres/:id', async (req, res) => {
try {
if (mongoose.connection.readyState !== 1) {
return res.status(500).json({ message: 'Base de données non connectée' });
}
const { titre, auteur, date_publication, genre, disponible } = req.body;
const livre = await Livre.findByIdAndUpdate(req.params.id, {
titre,
auteur,
date_publication,
genre,
disponible,
}, { new: true });

if (!livre) {
return res.status(404).json({ message: 'Livre non trouvé' });
}

res.status(200).json({ message: 'Livre mis à jour', livre });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', error: err.message });
}
});

// Route pour supprimer un livre
app.delete('/livres/:id', async (req, res) => {
try {
if (mongoose.connection.readyState !== 1) {
return res.status(500).json({ message: 'Base de données non connectée' });
}
const livre = await Livre.findByIdAndDelete(req.params.id);
if (!livre) {
return res.status(404).json({ message: 'Livre non trouvé' });
}
res.status(200).json({ message: 'Livre supprimé' });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la suppression du livre', error: err.message });
}
});

// Démarrer le serveur
app.listen(port, '0.0.0.0', () => {
console.log(`Serveur démarré sur http://localhost:${port}`);
});
