const express = require('express');
const router = express.Router();
const { deleteTaxis, deleteMoradas, deletePessoas, deleteDrivers, deletePrices, deleteViagens, createTaxis, createMoradas, createPessoas, createDrivers, createPrices, createViagens } = require('../populatedb');
const Price = require("../models/price");
const Driver = require("../models/driver");
const Taxi = require("../models/taxi");
const Morada = require("../models/morada");
const Pessoa = require("../models/pessoa");
const Viagem = require("../models/viagem");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Change your MongoDB connection string here
// This is just an example, you should use your own connection string
// It still works locally, however it is best to use the online cluster
const mongoDB = "mongodb://psi001:psi001@localhost:27017/psi001?retryWrites=true&authSource=psi001";



router.get('/', async (req, res) => {
    try {
      console.log("init.js: Initializing database...");
      await mongoose.connect(mongoDB);

      const pricesCount = await Price.countDocuments();
      const driversCount = await Driver.countDocuments();
      const taxisCount = await Taxi.countDocuments();
      const moradasCount = await Morada.countDocuments();
      const pessoasCount = await Pessoa.countDocuments();
      const viagensCount = await Viagem.countDocuments();

      if (pricesCount > 0 || driversCount > 0 || taxisCount > 0 || moradasCount > 0 || pessoasCount > 0 || viagensCount > 0){

        // Delete current records
        console.log("Deleting current records...");
        await Promise.all([
          deleteTaxis(),
          deleteMoradas(),
          deletePessoas(),
          deleteDrivers(),
          deletePrices(),
          deleteViagens()
        ]);

        // Create new records
        console.log("Recreating database records...");
        await createTaxis();
        await createMoradas();
        await createPessoas();
        await createDrivers();
        await createPrices();
        await createViagens();
      }

      if(pricesCount === 0 && driversCount === 0 && taxisCount === 0 && moradasCount === 0 && pessoasCount === 0 && viagensCount === 0){
        // Create new records
        console.log("Creating database records...");
        await createTaxis();
        await createMoradas();
        await createPessoas();
        await createDrivers();
        await createPrices();
        await createViagens();
      }
      
  
      res.status(200).json({ message: 'Database initialized successfully' });
    } catch (err) {
      console.error('Error initializing database:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;