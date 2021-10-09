const {UpdateData} = require("../Apis/UpdateData");

const axios = require("axios");
const CurrentActor = require("../Schemas/Station");
const GlOpResult = require("../Structures/GlOpResult");
const Partner = require("../Schemas/Partner");
const {TCP_SERVER} = require("../Apis/Config");

CurrentActor.belongsTo(Partner, {foreignKey: "currentPartner"})

const StationGlobalRouters = {
    create : async (req, res) => {
        let validatedData = true;
        let dataError = "";
        if (!validatedData) {
            res.send({'finalResult': false, 'error': dataError});
        } else {
            try {
                await CurrentActor.create(req.body);
                res.send({'finalResult': true, 'result': true})
            } catch (e) {
                res.send({'finalResult': false, 'error': e})
            }
        }
    },

    update : async (id, data) => {
        try {
            const preparedData = UpdateData(data)
            let currentActor = await CurrentActor.findByPk(id);
            if(currentActor != null){
                console.log(preparedData)
                await currentActor.update(preparedData);
                return  GlOpResult(true, "Station updated")
            }else{
                return  GlOpResult(false, "Station code not found")
            }
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "could not update Station info")
        }
    },

    getAll : async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        CurrentActor.findAll({offset: offset, limit: limit})
            .then(stations =>
                res.send({'finalResult': true, 'result': stations})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
    },

    getOne: async (id) => {
        try {
            let station = await CurrentActor.findByPk(
                id,
                {
                    include : [Partner],
                }

            )
            if (station != null) {
                return GlOpResult(true, station)
            } else {
                return GlOpResult(false, "no station found with id: " +id)
            }
        } catch (err) {
            console.log(err)
            return GlOpResult(false, "Operation failed")
        }
    },

    getOneByPublicId: async (id) => {
        try {
            let station = await CurrentActor.findOne({
                where: {
                    id: id
                }
            });
            if (station != null) {
                return GlOpResult(true, station)
            } else {
                return GlOpResult(false, "no station found with id: " + id)
            }
        } catch (err) {
            return GlOpResult(false, "Operation failed")
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

            console.log(e)
            return {finalResult: false, error: e}
        }
    },

    queryAPNNs: async (stationId, index) => {
        let requestAddress = TCP_SERVER + 'Station/QueryAPN/'+stationId+"/"+index
        try {
            const request = await axios({url: requestAddress, method: "get", responseType: 'json'})
            return request.data
        } catch (e) {

            console.log(e)
            return {finalResult: false, error: e}
        }
    }

}

module.exports = StationGlobalRouters