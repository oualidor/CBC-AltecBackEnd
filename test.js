const TransactionOperations = require("./Actors/TransactionOperations");
const Transaction = require("./Schemas/Transaction");
const TransactionMetaData = require("./Schemas/TransactionMetaData");
const {Op} = require("sequelize");

async function run(){
    let r = await TransactionMetaData.findAll({raw: true, where: {[Op.and] : [{dataValue : "PRPH082108250019"}]}})
    for (let transaction of r){
        let tr = await TransactionMetaData.findByPk(transaction.id)
        tr.update({dataValue: "61"})
    }
    console.log(r)

}

run()


