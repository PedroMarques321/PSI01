const Hero = require('./models/hero');
const Pet = require('./models/pet');

var heroes = [];
var pets = [];

async function heroCreate(index, code, name, pet) {
    const herodetail = {
        code: code, 
        name: name, 
        pet: pet,
      };
  
    const hero = new Hero(herodetail);
  
    await hero.save();
    heroes[index] = hero;
    console.log(`Added hero: ${code} ${name}`);
}

async function petCreate(index, code, name, owner) {
    const petdetail = {
        code: code,
        name: name,
        owner: owner,
    };
  
    const pet = new Pet(petdetail);
    await pet.save();
    pets[index] = pet;
    console.log(`Added pet: ${code} ${name}`);
}

async function createHeroes() {
    console.log("Creating Heroes");
    await Promise.all([
        heroCreate(0, 12, "Dr. Nice"),
        heroCreate(1, 13, "Bombasto"),
        heroCreate(2, 14, "Celeritas"),
        heroCreate(3, 15, "Magneta"),
        heroCreate(4, 16, "RubberMan"),
        heroCreate(5, 17, "Dynama"),
        heroCreate(6, 18, "Dr. IQ"),
        heroCreate(7, 19, "Magma"),
        heroCreate(8, 20, "Tornado")
    ]);
}

async function createPets() {
console.log("Creating Pets");
    await Promise.all([
        petCreate(0, 21, "Rato Esquilo", heroes[0]),
        petCreate(1, 22, "Bolinhas"),
        petCreate(2, 23,"Stitch"),
        petCreate(3, 24, "Lady", heroes[3]),
        petCreate(4, 25, "Dynamox"),
        petCreate(5, 26, "Lemos"),
        petCreate(6, 27, "Pingu"),
        petCreate(7, 28, "Peaners"),
        petCreate(8, 29, "JJ"),
        petCreate(9, 30, "Bimbo")
    ]);
}

async function deleteHeroes() {
    console.log('Deleting Hero records');
    try {
        await Hero.deleteMany({});
        console.log('Hero records deleted');
    } catch (err) {
        console.log('Error deleting Hero records:', err);
    }
    console.log('Heroes deleted');
}

async function deletePets(){
    console.log('Deleting Pet records');
    try {
        await Pet.deleteMany({});
        console.log('Pet records deleted');
    } catch (err) {
        console.log('Error deleting Pet records:', err);
    }
}

module.exports = {
    createHeroes,
    createPets,
    deleteHeroes,
    deletePets
}
