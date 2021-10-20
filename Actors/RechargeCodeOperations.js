const CurrentActor = require("../Schemas/RechargeCode");
const GlOpResult = require("../Structures/GlOpResult");
const {UpdateData} = require("../Apis/UpdateData");



const  RechargeCodeOperations = {

    create : async (data) => {
        try {
            let code = await CurrentActor.create(data);
            return code
        }catch (error) {
            console.log(error)
            return  false
        }
    },

    bulkCreate : async (data) => {
        try {
            await CurrentActor.bulkCreate(data);
            return GlOpResult(true, "Multiple create success")
        }catch (error) {
            console.log(error)
            return  GlOpResult(false, error)
        }
    },


    update : async (id, data) => {
        try {
            const preparedData = UpdateData(data)
            let currentActor = await CurrentActor.findByPk(id);
            if(currentActor != null){
                await currentActor.update(preparedData);
                return  GlOpResult(true, "Recharge updated")
            }else{
                return  GlOpResult(false, "Recharge code not found")
            }
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "could not update recharge code")
        }
    },

    getAll :  async (offset, limit) => {
        try{
            let rechargeCodes = await CurrentActor.findAll({offset: offset, limit: limit})
            return  GlOpResult(true, rechargeCodes)
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "request failed")
        }

    },

    getOne :  async (id) => {
        try{
            let currentActor = await CurrentActor.findByPk(id)
            if(currentActor != null) return currentActor
            return false
        }catch (e){
            console.log(e)
            return false
        }
    },

    getOneByHashedCode: async (hashedCode) => {

        try {
            let hashedCodes = await CurrentActor.findAll({
                where: {
                    hashedCode: hashedCode
                }
            });
            if(hashedCodes.length > 0){
                let hashedCode  = hashedCodes[0]
                if (hashedCode != null) {
                    return hashedCode
                } else {
                    return  false
                }
            }else {
                return false
            }
        } catch (error) {
            return false
        }
    },
}

module.exports = {RechargeCodeOperations}