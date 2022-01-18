const TransactionOperations = require("./Actors/TransactionOperations");
const Transaction = require("./Schemas/Transaction");
const TransactionMetaData = require("./Schemas/TransactionMetaData");
const RechargeCode = require("./Schemas/RechargeCode");
const {Op} = require("sequelize");

async function run(){
    let r = await RechargeCode.findAll({raw: true, where: {"stat": 0}})
    for (let transaction of r){
        let tr = await RechargeCode.findByPk(transaction.id)
        tr.update({stat: "1"})
    }
    console.log(r)

}

run()


