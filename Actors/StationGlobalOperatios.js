const axios = require("axios");
const Station = require("../Schemas/Station");

const {TCP_SERVER} = require("../Apis/Config");


const StationGlobalRouters = {
    create : async (req, res) => {
        let validatedData = true;
        let dataError = "";
        if (!validatedData) {
            res.send({'finalResult': false, 'error': dataError});
        } else {
            try {
                await Station.create(req.body);
                res.send({'finalResult': true, 'result': true})
            } catch (e) {
                res.send({'finalResult': false, 'error': e})
            }
        }
    },

    getAll : async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        Station.findAll({offset: offset, limit: limit})
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
            let station = await Station.findByPk(id);
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
            let stations = await Station.findAll();
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

    getRealTimeInfo:  async (req, res) => {
        let {id} = req.params
        let requestAddress = TCP_SERVER+'Station/QueryInfo/'+id
        try {
            const request  = await axios({url: requestAddress, method: "get", responseType: 'json'})
            res.send(request.data)
        }catch (e){
            res.send({finalResult: false, error: e})
        }
},

    rentPowerBank: async (id) => {
        let requestAddress = TCP_SERVER + 'Station/rent/'+id
        try {
            const request = await axios({url: requestAddress, method: "get", responseType: 'json'})
            return request.data
        } catch (e) {
            return {finalResult: false, error: e}
        }
    }
}

module.exports = {StationGlobalRouters}