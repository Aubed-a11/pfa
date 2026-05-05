const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Mode Atlas/externe: si URI fournie et non vide
  if (uri && uri.trim().length > 0) {
    try {
      await mongoose.connect(uri.trim());
      console.log(`✅ MongoDB Atlas connecté: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.error('❌ Connexion Atlas échouée:', err.message);
      console.log('🔄 Basculement vers MongoDB embarqué...');
    }
  }

  // Mode embarqué automatique — aucune installation requise
  try {
    console.log('🔄 Démarrage MongoDB embarqué (téléchargement au 1er lancement ~30s)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: 'W�nam' },
    });
    const embeddedUri = mongod.getUri();
    await mongoose.connect(embeddedUri);
    console.log('✅ MongoDB embarqué prêt — base de données locale automatique');

    // Seed données initiales
    const { seedAdmin, seedMenu } = require('../utils/seed');
    await seedAdmin();
    await seedMenu();

    // Arrêt propre
    process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
    process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });

  } catch (err) {
    console.error('❌ Erreur MongoDB embarqué:', err.message);
    console.log('\n💡 Solution: ajoutez une URL MongoDB Atlas dans server/.env:');
    console.log('   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/W�nam\n');
    process.exit(1);
  }
};

module.exports = connectDB;


