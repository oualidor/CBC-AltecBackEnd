const GlOpResult = require("../Structures/GlOpResult");
const seq = require('sequelize')
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {UpdateData} = require("../Apis/UpdateData");
class _Model{
    constructor(CurrentActor) {
        this.CurrentActor = CurrentActor
    }

    create = async (data) => {
        try {
            let validatedData = true;
            let dataError = "";
            if (!validatedData) {
                return GlOpResult(false, dataError)
            }
            else{
                try {
                    let newStation = await this.CurrentActor.create(dataError);
                    return GlOpResult(true, newStation)
                }catch (error){
                    let errorMsg = error.errors[0].message
                    return GlOpResult(false, errorMsg)
                }
            }
        }
        catch (error) {
            console.log(error)
            return GlOpResult(false, "Request failed")
        }
    }

    update = async (id, data) => {
        try {
            const preparedData = UpdateData(data)
            let currentActor = await this.CurrentActor.findByPk(id);
            if(currentActor != null){
                await currentActor.update(preparedData);
                return  GlOpResult(true, "Update success")
            }else{
                return  GlOpResult(false, "Entry code not found")
            }
        }catch (error){
            console.log(error)
            return  GlOpResult(false, "could not update entry info")
        }
    }

    getAll = async (offset, limit) => {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 50
        try{
            let result = await this.CurrentActor.findAll({offset: offset, limit: limit})
            return GlOpResult(true, result)
        }
        catch (error){
            return GlOpResult(false , "Operation failed")
        }

    }

    searchBy =  async (attribute, value) => {
        let data = {where: {[attribute]: {[seq.Op.like]: '%' + value + '%'}}};
        try {
        let result = await this.CurrentActor.findAll(data);
        return GlOpResult(true, result)
        } catch (e) {
            console.log(e)
            return GlOpResult(false, e)
        }
    }

    count =  async (Model) => {
        try {
            let total  = await Model.findAll({
                attributes: [
                    [seq.fn('COUNT', seq.col('id')), 'total'] // To add the aggregation...
                ]
            });
            return GlOpResult(true, total)
        }catch (error){
            console.log(error)
            return GlOpResult(false, "Operation failed")
        }
    }
}

module.exports = _Model