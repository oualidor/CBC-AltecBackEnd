const CurrentActor = require("../Schemas/ClientWallet");
const Validator = require("../Apis/DataValidator");
const bcrypt = require("bcrypt");
const GlOpResult = require("../Structures/GlOpResult");
const ClientGlobalOperations = require("./ClientOperations");
const {UpdateData} = require("../Apis/UpdateData");



const  ClientWalletGlobalOperations = {
    create : async (clientId) => {
        let client = ClientGlobalOperations.findByPk(clientId)
        if(client != false){
            CurrentActor.create({clientId})
        }else {
            return false
        }
    },

    update : async (id, data) => {
        try {
            const preparedData = UpdateData(data)
            let currentActor = await CurrentActor.findByPk(id);
            if(currentActor != null){
                try{
                    if(await currentActor.update(preparedData)){
                        return GlOpResult(true, "Wallet updated")

                    }else {
                        return GlOpResult(false, "could not update the wallet")

                    }
                    return GlOpResult(true, "Wallet updated")
                }catch (error){
                    return GlOpResult(false, "could not update the wallet")
                }
                return GlOpResult(true, "Wallet updated")
            }else{
                return GlOpResult(false, "Wallet  not found")
            }
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "could not update wallet")
        }
    },

    getAll :  async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        CurrentActor.findAll({offset: offset, limit: limit})
            .then(stores =>
                res.send({'finalResult': true, 'result': stores})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': true})
            );
    },

    getOne :  async (id) => {
        try{
            let currentActor = await CurrentActor.findByPk(id)
            if(currentActor != null) return currentActor
            return false
        }catch (error){
            console.log(error)
            return false
        }
    },

}

module.exports = {ClientWalletGlobalOperations}