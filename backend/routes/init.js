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

//const mongoDB = "mongodb+srv://pedromarques2881997:dSjSww1uXxE6sbJP@cluster0.tj7cu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"  
//const mongoDB = "mongodb+srv://diogo:psi01@cluster0.sacvmdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = "mongodb://psi001:psi001@localhost:27017/psi001?retryWrites=true&authSource=psi001";
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.


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