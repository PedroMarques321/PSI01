const express = require('express');
const router = express.Router();
const { deleteTaxis, deleteMoradas, deletePessoas, deleteDrivers, deletePrices, createTaxis, createMoradas, createPessoas, createDrivers, createPrices } = require('../populatedb');
const Price = require("../models/price");
const Driver = require("../models/driver");
const Taxi = require("../models/taxi");
const Morada = require("../models/morada");
const Pessoa = require("../models/pessoa");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = "mongodb+srv://pedromarques2881997:dSjSww1uXxE6sbJP@cluster0.tj7cu.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0";

  
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


      if (pricesCount > 0 || driversCount > 0 || taxisCount > 0 || moradasCount > 0 || pessoasCount > 0){

        // Delete current records
        console.log("Deleting current records...");
        await Promise.all([
          deleteTaxis(),
          deleteMoradas(),
          deletePessoas(),
          deleteDrivers(),
          deletePrices()
        ]);

        // Create new records
        console.log("Recreating database records...");
        await Promise.all([
          createTaxis(),
          createMoradas(),
          createPessoas(),
          createDrivers(),
          createPrices()
        ]);
      }

      if(pricesCount === 0 && driversCount === 0 && taxisCount === 0 && moradasCount === 0 && pessoasCount === 0){
        // Create new records
        console.log("Creating database records...");
        await Promise.all([
          createTaxis(),
          createMoradas(),
          createPessoas(),
          createDrivers(),
          createPrices()
        ]);
      }
      
  
      res.status(200).json({ message: 'Database initialized successfully' });
    } catch (err) {
      console.error('Error initializing database:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;