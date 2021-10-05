const axios = require("axios");
const RentTransaction = require("../Schemas/RentTransaction");
const GlOpResult = require("../Structures/GlOpResult");

const {TCP_SERVER} = require("../Apis/Config");


const RentTransactionGlobalRouters = {
    create : async (StationId, clientId, powerBankId,  type) => {
        let validatedData = true;
        let dataError = "";
        if (!validatedData) {
            return GlOpResult(false, dataError)
            return {'finalResult': false, 'error': dataError};
        } else {
            try {
                let rentTransaction  = await RentTransaction.create({StationId, clientId, powerBankId,  type});
                return GlOpResult(true, rentTransaction)
            } catch (error) {
                return GlOpResult(false, dataError)
            }
        }
    },

    getAll : async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        RentTransaction.findAll({offset: offset, limit: limit})
            .then(stations =>
                res.send({'finalResult': true, 'result': stations})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
    },

    getOne: async (req, res) => {
        const {id} = req.params
        try {
            let station = await RentTransaction.findByPk(id);
            if (station != null) {
                res.send({'finalResult': true, 'result': station})
            } else {
                res.send({'finalResult': false, 'error': "no station found with id: " +id})
            }
        } catch (err) {
            res.send({'finalResult': false, 'error': err})
        }
    },

    getOneByPublicId: async (req, res) => {
        const {id} = req.params

        try {
            let stations = await RentTransaction.findAll();
            if(stations.length > 0){
                let station  = stations[0]
                if (station != null) {
                    res.send({'finalResult': true, 'result': station})
                } else {
                    res.send({'finalResult': false, 'error': "no station found with id: " +id})
                }
            }else {
                res.send({'finalResult': false, 'error': "no station found with id: " +id})
            }

        } catch (err) {
            res.send({'finalResult': false, 'error': err})
        }
    },



}

module.exports = {RentTransactionGlobalRouters}