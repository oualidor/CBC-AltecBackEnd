const TransactionOperations = require("./Actors/TransactionOperations");
const Transaction = require("./Schemas/Transaction");

async function run(){
    let r = await Transaction.findAll()
    console.log(r)
}

run()


