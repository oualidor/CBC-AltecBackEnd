const {UpdateData} = require("../Apis/UpdateData");

const axios = require("axios");
const CurrentActor = require("../Schemas/Station");
const GlOpResult = require("../Structures/GlOpResult");
const Partner = require("../Schemas/Partner");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {TCP_SERVER} = require("../Apis/Config");
CurrentActor.belongsTo(Partner, {foreignKey: "currentPartner"})

const StationOperations = {
    
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
                },
                include : [Partner],

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
        } catch (error) {
            console.log(error)
            return {finalResult: false, error: "Operation failed"}
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
    },

    sendRequest: {
        GET: async (point) => {
            let URL = TCP_SERVER + point
            try {
                const request = await axios({url: URL, method: "get", responseType: 'json'})
                return request.data
            } catch (e) {
                console.log(e)
                return {finalResult: false, error: e}
            }
        },

        POST: async (point, postData)=>{
            let URL = TCP_SERVER + point
            try{
                const response  = await axios(
                    {
                        url: URL,
                        method: "post",
                        responseType: 'json',
                        headers: {'Content-Type': 'application/json', authorization: 'Bearer ' + "adminToken"},
                        data: postData,
                    })
                const result = await response.data;
                return result
            }catch (error){
                console.log(error)
                return {finalResult: false, error: error}
            }
        }
    },
}

module.exports = StationOperations