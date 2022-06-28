// const TransactionOperations = require("./Actors/TransactionOperations");
// const Transaction = require("./Schemas/Transaction");
// const TransactionMetaData = require("./Schemas/TransactionMetaData");
// const RechargeCode = require("./Schemas/RechargeCode");
// const {Op} = require("sequelize");
// const bcrypt = require("bcrypt");
// const Serializer = require('sequelize-to-json')
//
// async function run(){
//     const RentTransactions = await Transaction.findAll({
//         limit: 1,
//         where: { operation: 1},
//         include : [
//             {
//
//                 model: TransactionMetaData,
//                 as: "MetaData",
//             }
//         ],
//     })
//
//     RentTransactions.forEach(transaction =>{
//         let metaDataArray = transaction.dataValues.MetaData
//         metaDataArray.forEach(transactionMetaEntry =>{
//             console.log(transactionMetaEntry.dataValues)
//         })
//     })
// }
//
// run()
//
//
