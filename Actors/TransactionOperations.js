const Transaction = require("../Schemas/Transaction");
const GlOpResult = require("../Structures/GlOpResult");
const TransactionMetaData = require("../Schemas/TransactionMetaData");
Transaction.hasMany(TransactionMetaData, {as : 'MetaData', foreignKey : 'transactionId'});
//StationId, clientId, powerBankId,
const TransactionOperations = {
    create : async (operation, metaData) => {
        try {
            let validatedData = true;
            let dataError = "";
            if (!validatedData) {
                return GlOpResult(false, dataError)
            } else {
                let newTransaction  = await Transaction.create({operation});
                if(metaData !== undefined){
                    let metaDataOperation = await TransactionOperations.addMetadata(newTransaction.id, metaData)
                    if(metaDataOperation.finalResult){
                        return GlOpResult(true, newTransaction)
                    }else {
                        newTransaction.destroy()
                        return GlOpResult(false, "Operation failed")
                    }
                }else {
                    return GlOpResult(true, newTransaction)
                }
            }
        }catch (error){
            console.log(error)
            return GlOpResult(false, "Operation failed")
        }
    },

    getAll : async (operation, offset, limit) => {
        limit = parseInt(limit);
        operation = parseInt(operation);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        let rentTransactions = await Transaction.findAll(
            {
                where: { operation: operation},
                offset: offset, limit: limit,
                include : [
                    {
                        model: TransactionMetaData,
                        as: "MetaData",
                    }
                ],
            })
        if(rentTransactions !== null){
            return GlOpResult(true, rentTransactions)
        }else {
            GlOpResult(true, [])
        }
    },

    getOne: async (req, res) => {
        const {id} = req.params
        try {
            let station = await Transaction.findByPk(
                id,
                {
                    include : [
                        {
                            model: TransactionMetaData,
                            as: "MetaData",
                        }
                    ],
                }
                );
            if (station != null) {
                res.send({'finalResult': true, 'result': station})
            } else {
                res.send({'finalResult': false, 'error': "no station found with id: " +id})
            }
        } catch (err) {
            res.send({'finalResult': false, 'error': err})
        }
    },

    addMetadata :  async (transactionId, data) => {
        let validatedData = true;
        let dataError = "";
        if(!validatedData){
            return GlOpResult(false, dataError)
        }else{
            let preparedData = []
            data.forEach(entry =>{
                preparedData.push(
                    {
                        transactionId,
                        dataTitle: entry.dataTitle,
                        dataValue: entry.dataValue
                    }
                )
            })
            try {
                let transactionMetaData = await TransactionMetaData.bulkCreate(preparedData);
                return GlOpResult(true, transactionMetaData)
            }catch (e) {
                return GlOpResult(false, "request failed")
            }
        }
    }
}

module.exports = TransactionOperations