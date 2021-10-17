const GlOpResult = require("../Structures/GlOpResult");
const seq = require('sequelize')
class _Model{
    constructor(CurrentActor) {
        this.CurrentActor = CurrentActor
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