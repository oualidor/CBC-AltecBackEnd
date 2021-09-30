const axios = require("axios");
const RentTransaction = require("../Schemas/RentTransaction");

const {TCP_SERVER} = require("../Apis/Config");


const RentTransactionGlobalRouters = {
    create : async (StationId, clientId, powerBankId,  type) => {
        let validatedData = true;
        let dataError = "";
        if (!validatedData) {
            return {'finalResult': false, 'error': dataError};
        } else {
            try {
                await RentTransaction.create({StationId, clientId, powerBankId,  type});
                return {'finalResult': true, 'result': true}
            } catch (e) {
                return {'finalResult': false, 'error': e}
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