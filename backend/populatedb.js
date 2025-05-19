const Taxi = require('./models/taxi');
const Driver = require('./models/motorista');
const Pessoa = require('./models/pessoa');
const Morada = require('./models/morada');
const Price = require('./models/price');
const Viagem = require('./models/viagem');

var taxis = [];
var drivers = [];
var pessoas = [];
var moradas = [];
var prices = [];
var viagens = [];

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

async function taxiCreate(index, modelo, marca, conforto, matricula, ano_de_compra, lugares) {
    const taxidetail = {
        modelo: modelo,
        marca: marca,
        conforto: conforto,
        matricula: matricula,
        ano_de_compra: ano_de_compra,
        lugares: lugares,
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

async function priceCreate(index, taxa_normal, taxa_luxo, acrescimo_noturno) {
    const pricedetail = {
        taxa_normal: taxa_normal,
        taxa_luxo: taxa_luxo,
        acrescimo_noturno: acrescimo_noturno,
    };

    const price = new Price(pricedetail);
    await price.save();
    prices[index] = price;
    console.log(`Added price: ${taxa_normal} ${taxa_luxo} ${acrescimo_noturno}`);
}

async function viagemCreate(index, sequencia, numeroPessoas, clienteID, data, horaPartida, horaChegadaEstimada, condutorID, taxiID, quilometros, moradaPartida, moradaChegada, preco, tipoServico, estado) {
    const viagemdetail = {
        sequencia: sequencia,
        numeroPessoas: numeroPessoas,
        clienteID: clienteID,
        data: data,
        horaPartida: horaPartida,
        quilometros: quilometros,
        moradaPartida: moradaPartida,
        moradaChegada: moradaChegada,
        preco: preco,
        tipoServico: tipoServico,
        estado: estado,
    };
    
    // Adicionar campos opcionais apenas se não forem nulos
    if (horaChegadaEstimada) viagemdetail.horaChegadaEstimada = horaChegadaEstimada;
    if (condutorID) viagemdetail.condutorID = condutorID;
    if (taxiID) viagemdetail.taxiID = taxiID;

    const viagem = new Viagem(viagemdetail);
    await viagem.save();
    console.log(`Added viagem: ${moradaPartida} -> ${moradaChegada}`);
    
    // Armazenar a viagem criada no array se necessário
    if (viagens[index] === undefined) {
        viagens[index] = viagem;
    }
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
        taxiCreate(0, "Prius", "Toyota", "Normal", "38-33-TH", new Date("2018-01-01"), 5),
        taxiCreate(1, "Classe-E", "Mercedes", "Normal", "15-MF-48", new Date("2017-05-12"), 5),
        taxiCreate(2, "Prius", "Toyota", "Normal", "00-00-AA", new Date("2019-09-23"), 5)
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

async function createPrices() {
    console.log("Creating Prices");
    await Promise.all([
        priceCreate(0, 0.20, 0.30, 10)
    ]);
}

async function createViagens() {
    console.log("Creating Viagens");
    
    try {
      // Obter táxis existentes
      const taxis = await Taxi.find({});
      if (taxis.length === 0) {
        console.log("Nenhum táxi encontrado para associar às viagens");
        // Continue sem associar táxi
      }
      
      // Obter pessoas existentes para usar como clientes
      const pessoas = await Pessoa.find({});
      if (pessoas.length === 0) {
        console.log("Nenhuma pessoa encontrada para associar como cliente");
        return; // Não podemos criar viagens sem clientes
      }
      
      // Criar viagem sem referência a táxi inicialmente
      await viagemCreate(
        0, // index
        1, // sequencia
        2, // numeroPessoas
        pessoas[0].nif, // clienteID - usando NIF da primeira pessoa
        new Date(), // data
        "14:30", // horaPartida
        "15:00", // horaChegadaEstimada
        null, // condutorID - deixando null inicialmente
        null, // taxiID - deixando null inicialmente
        10, // quilometros
        "Rua A, Lisboa", // moradaPartida
        "Rua B, Lisboa", // moradaChegada
        15.0, // preco
        "Normal", // tipoServico
        "PENDENTE" // estado
      );
      
      // Criar outra viagem se necessário
      if (pessoas.length > 1) {
        await viagemCreate(
          1, // index
          2, // sequencia
          1, // numeroPessoas
          pessoas[1].nif, // clienteID - usando NIF da segunda pessoa
          new Date(), // data
          "16:00", // horaPartida
          "16:30", // horaChegadaEstimada
          null, // condutorID
          null, // taxiID
          5, // quilometros
          "Avenida da República, Lisboa", // moradaPartida
          "Praça do Comércio, Lisboa", // moradaChegada
          8.0, // preco
          "Normal", // tipoServico
          "PENDENTE" // estado
        );
      }
      
      console.log("Viagens criadas com sucesso");
    } catch (error) {
      console.error("Erro ao criar viagens:", error);
      throw error; // Propagar o erro para tratamento adequado
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

async function deletePrices() {
    console.log('Deleting Price records');
    try {
        await Price.deleteMany({});
        console.log('Price records deleted');
    } catch (err) {
        console.log('Error deleting Price records:', err);
    }
}

async function deleteViagens() {
    console.log('Deleting Viagem records');
    try {
        await Viagem.deleteMany({});
        console.log('Viagem records deleted');
    } catch (err) {
        console.log('Error deleting Viagem records:', err);
    }
}

module.exports = {
    createTaxis,
    createMoradas,
    createPessoas,
    createDrivers,
    createPrices,
    createViagens,
    deleteTaxis,
    deleteMoradas,
    deletePessoas,
    deleteDrivers,
    deletePrices,
    deleteViagens
}