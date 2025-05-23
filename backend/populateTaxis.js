const mongoose = require("mongoose");
const Taxi = require("./models/taxi"); // Modelo de Taxi

// Conectar ao MongoDB pela appServer

mongoose.connect("mongodb://psi001:psi001@localhost:27017/psi001?retryWrites=true&authSource=psi001",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Conexão bem-sucedida ao MongoDB.");
})
.catch((err) => {
  console.error("Erro ao conectar ao MongoDB:", err);
});

// Conectar ao MongoDB 
/*
mongoose.connect("mongodb://localhost:27017/webtaxi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Conexão bem-sucedida ao MongoDB.");
})
.catch((err) => {
  console.error("Erro ao conectar ao MongoDB:", err);
});
*/
// Dados de exemplo de taxis para popular a base de dados
const taxis = [
  {
    modelo: "Sedan",
    marca: "Toyota",
    conforto: "Normal",
    matricula: "00-00-AA",
    ano_de_compra: new Date("2018-01-01"),
  },
  {
    modelo: "SUV",
    marca: "Honda",
    conforto: "Normal",
    matricula: "00-00-AA",
    ano_de_compra: new Date("2017-05-12"),
  },
  {
    modelo: "Hatch",
    marca: "Ford",
    conforto: "Normal",
    matricula: "00-00-AA",
    ano_de_compra: new Date("2019-09-23"),
  },
];

// Função para popular a base de dados com taxis
async function populateTaxis() {
  try {
    // Limpar dados existentes na coleção "taxis"
    await Taxi.deleteMany();

    // Inserir os dados de exemplo
    await Taxi.insertMany(taxis);
    console.log("Dados de taxis inseridos com sucesso!");
    mongoose.disconnect(); // Desconectar após a inserção
  } catch (error) {
    console.error("Erro ao popular dados de taxis:", error);
    mongoose.disconnect(); // Desconectar em caso de erro
  }
}

// Chamar a função para popular a base de dados
populateTaxis();
