const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bibliotheque')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));
