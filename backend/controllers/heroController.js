const Hero = require('../models/hero');
const asyncHandler = require('express-async-handler');

// Handle Heroes GET
exports.heroesGetAll = asyncHandler(async function(req, res, next) {

    console.log("heroController(heroesGetAll): Fetching all heroes");

    const heroes = await Hero.find();

    if(heroes.length === 0) {
        res.status(404);
        throw new Error("heroController(heroList): No heroes found");
    }
    res.json(heroes);
});

// Handle Hero GET
exports.heroGetId= asyncHandler(async function(req, res, next) {
    
    const heroId = req.params.id;
    const hero = await Hero.findById(heroId);

    if(hero === null) {
        res.status(404);
        throw new Error("heroController(heroDetail): Hero not found");
    }
    res.json(hero);
});

exports.newHero = asyncHandler(async (req, res) => {

    console.log("heroController.js(newHero): adding new hero");
    const hero = new Hero(req.body);

    await hero.save();
    res.status(201).json(hero);

});

// Handle Hero POST.
exports.hero_create_post = asyncHandler(async (req, res, next) => {
    try {
      console.log("about to create a hero");
      const currtcode = await Hero.findOne().sort('-code').exec();
      console.log(`current highest code: " ${currtcode.code}`);
      const newcode = currtcode ? currtcode.code + 1 : 1;
      console.log(` ocodigo do novo hero: ${newcode}`);
  
      const { name } = req.body;
  
      console.log(` o nome do novo hero: ${name}`);
  
      const hero = new Hero({name, code: newcode});
  
      await hero.save();
      console.log(`Added hero: ${newcode} ${name}`);
      res.send(`Added hero: ${newcode} ${name}`);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create hero', error: error.message });
    }
});

// Handle HERO delete
exports.hero_delete = asyncHandler(async (req, res, next) => {
    // Extract hero ID from request parameters
    const heroId = req.params.id;
  
    // Fetch the hero from the database
    const hero = await Hero.findById(heroId);
  
    // Check if hero with the given ID exists
    if (!hero) {
      // If hero is not found, send 404 Not Found response
      return res.status(404).json({ message: 'Hero not found' });
    }
  
    await hero.deleteOne();
  
    res.send(`Deleted hero: ${hero.code} named: ${hero.name}`);
});

// Handle Hero PUT
exports.heroPut = asyncHandler(async (req, res, next) => {
    try {
        // Extract hero ID from request parameters
        const heroId = req.params.id;

        // Fetch the hero from the database, if it exists
        const hero = await Hero.findById(heroId);

        // Check if hero with the given ID exists
        if (!hero) {
            // If hero is not found, send 404 Not Found response
            return res.status(404).json({ message: 'Hero not found' });
        }

        // Extract data from request body
        const { name, pet } = req.body;

        // Update hero
        if(name) {
            hero.name = name;
        }

        // Update hero pet
        if(pet) {
            hero.pet = pet;
        }

        await hero.save();

        console.log(`Updated hero: ${hero.code} named: ${hero.name}`);

        res.json({
            message: `Updated hero: ${hero.code} named: ${hero.name}`,
            hero: hero
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update hero',
            error: error.message
        });
    }
    
})