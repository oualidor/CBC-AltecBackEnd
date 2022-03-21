const TransactionOperations = require("./Actors/TransactionOperations");
const Transaction = require("./Schemas/Transaction");
const TransactionMetaData = require("./Schemas/TransactionMetaData");
const RechargeCode = require("./Schemas/RechargeCode");
const {Op} = require("sequelize");
const bcrypt = require("bcrypt");
const Serializer = require('sequelize-to-json')

async function run(){
    const hashedPassword = bcrypt.hashSync("habiba2022", 10);
    console.log(hashedPassword)
}

run()


