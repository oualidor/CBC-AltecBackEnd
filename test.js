const TransactionOperations = require("./Actors/TransactionOperations");

async function run(){

    let r = await TransactionOperations.getAll( "0", 0, 9999)
    console.log(r['Transaction'])
}

run()


