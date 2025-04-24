const Hero = require('./models/hero');
const Pet = require('./models/pet');
const Taxi = require('./models/taxi');
const Driver = require('./models/motorista');
const Pessoa = require('./models/pessoa');
const Morada = require('./models/morada');

var heroes = [];
var pets = [];
var taxis = [];
var drivers = [];
var pessoas = [];
var moradas = [];

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

async function pessoaCreate(index, nif, nome, genero) {
    const pessoadetail = {
        nif: nif,
        nome: nome,
        genero: genero,
    };

    const pessoa = new Pessoa(pessoadetail);
    await pessoa.save();
    pessoas[index] = pessoa;
    console.log(`Added pessoa: ${nome}`);
}

async function moradaCreate(index, numero_porta, rua, codigo_postal, localidade) {
    const moradadetail = {
        numero_porta: numero_porta,
        rua: rua,
        codigo_postal: codigo_postal,
        localidade: localidade,
    };

    const morada = new Morada(moradadetail);
    await morada.save();
    moradas[index] = morada;
    console.log(`Added morada: ${numero_porta} ${rua} ${codigo_postal} ${localidade}`);
}

async function taxiCreate(index, modelo, marca, conforto, matricula, ano_de_compra) {
    const taxidetail = {
        modelo: modelo,
        marca: marca,
        conforto: conforto,
        matricula: matricula,
        ano_de_compra: ano_de_compra,
    };

    const taxi = new Taxi(taxidetail);
    
    await taxi.save();
    taxis[index] = taxi;
    console.log(`Added taxi: ${modelo} ${marca}`);
}

async function driverCreate(index, morada, carta_de_conducao, pessoa, nascimento) {
    const driverdetail = {
        morada: morada,
        carta_de_conducao: carta_de_conducao,
        pessoa: pessoa,
        nascimento: nascimento,
    };

    const driver = new Driver(driverdetail);
    await driver.save();
    drivers[index] = driver;
    console.log(`Added driver: ${morada} ${carta_de_conducao} ${pessoa} ${nascimento}`);
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

async function createMoradas() {
    console.log("Creating Moradas");
    await Promise.all([
        moradaCreate(0, 10, "Rua da Paz", "4000-000", "Porto"),
        moradaCreate(1, 6, "Rua da Liberdade", "1000-000", "Lisboa"),
        moradaCreate(2, 7, "Rua da Restauração", "3000-000", "Coimbra")
    ]);
}

async function createPessoas() {
    console.log("Creating Pessoas");
    await Promise.all([
        pessoaCreate(0, 213421234,"João", "Masculino"),
        pessoaCreate(1, 213421535,"Maria", "Feminino"),
        pessoaCreate(2, 213261836,"António", "Masculino")
    ]);
}

async function createTaxis() {
    console.log("Creating Taxis");
    await Promise.all([
        taxiCreate(0, "Prius", "Toyota", "Normal", "38-33-TH", new Date("2018-01-01")),
        taxiCreate(1, "Classe-E", "Mercedes", "Normal", "15-MF-48", new Date("2017-05-12")),
        taxiCreate(2, "Prius", "Toyota", "Normal", "00-00-AA", new Date("2019-09-23"))
    ]);
}

async function createDrivers() {
    console.log("Creating Drivers");
    await Promise.all([
        driverCreate(0, moradas[0], "1914567890", pessoas[0], new Date("1990-01-01")),
        driverCreate(1, moradas[1], "1232567890", pessoas[1], new Date("1990-01-01")),
        driverCreate(2, moradas[2], "1234561890", pessoas[2], new Date("1990-01-01"))
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

async function deleteMoradas(){
    console.log('Deleting Morada records');
    try {
        await Morada.deleteMany({});
        console.log('Morada records deleted');
    } catch (err) {
        console.log('Error deleting Morada records:', err);
    }
}

async function deletePessoas(){
    console.log('Deleting Pessoa records');
    try {
        await Pessoa.deleteMany({});
        console.log('Pessoa records deleted');
    } catch (err) {
        console.log('Error deleting Pessoa records:', err);
    }
}

async function deleteTaxis(){
    console.log('Deleting Taxi records');
    try {
        await Taxi.deleteMany({});
        console.log('Taxi records deleted');
    } catch (err) {
        console.log('Error deleting Taxi records:', err);
    }
    console.log('Taxis deleted');
}

async function deleteDrivers(){
    console.log('Deleting Driver records');
    try {
        await Driver.deleteMany({});
        console.log('Driver records deleted');
    } catch (err) {
        console.log('Error deleting Driver records:', err);
    }
}

module.exports = {
    createHeroes,
    createPets,
    createTaxis,
    createMoradas,
    createPessoas,
    createDrivers,
    deleteHeroes,
    deletePets,
    deleteTaxis,
    deleteMoradas,
    deletePessoas,
    deleteDrivers
}