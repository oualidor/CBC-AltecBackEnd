const GlOpResult = require("../Structures/GlOpResult");
const seq = require('sequelize')
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
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