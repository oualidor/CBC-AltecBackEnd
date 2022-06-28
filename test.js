const TransactionOperations = require("./Actors/TransactionOperations");
const Transaction = require("./Schemas/Transaction");
const TransactionMetaData = require("./Schemas/TransactionMetaData");
const RechargeCode = require("./Schemas/RechargeCode");
const {Op} = require("sequelize");
const bcrypt = require("bcrypt");
const Serializer = require('sequelize-to-json')
const Client = require("./Schemas/Client");
const ClientOperations = require("./Actors/ClientOperations");
const GlOpResult = require("./Structures/GlOpResult");
async function test() {
    let clients = await Client.findAll({where: {currentPowerBank: "FREE"}, limit: 1})
    clients.forEach(rowClient =>{
        let client  = rowClient.dataValues;

    })
    return  clients
}
async function run(){
    let clients = await Client.findAll({where: {currentPowerBank: "FREE", fullName: "Oualid KHIAL"}, limit: 1})
    clients.forEach(rowClient =>{
        let client  = rowClient.dataValues;
        rowClient.update({currentPowerBank: "FREE", type: 0})
        console.log(client)
    })
}

run()


