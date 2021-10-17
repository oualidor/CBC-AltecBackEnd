const GlOpResult = require("../Structures/GlOpResult");
const seq = require('sequelize')
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
class _Model{
    constructor(CurrentActor) {
        this.CurrentActor = CurrentActor
    }

    create = async (req, res) => {
        try {
            let validatedData = true;
            let dataError = "";
            if (!validatedData) {
                res.send({'finalResult': false, 'error': dataError});
            }
            else{
                try {
                    let newStation = await this.CurrentActor.create(req.body);
                    AnswerHttpRequest.done(res, newStation)
                }catch (error){
                    let errorMsg = error.errors[0].message
                    AnswerHttpRequest.wrong(res, errorMsg)
                }
            }
        }
        catch (error) {
            console.log(error)
            res.send({'finalResult': false, 'error': "Request failed"})
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
}

module.exports = _Model