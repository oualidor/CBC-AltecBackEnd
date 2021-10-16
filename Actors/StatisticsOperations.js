const sequelize = require('sequelize');
const GlOpResult = require("../Structures/GlOpResult");
//StationId, clientId, powerBankId,
const StatisticsOperations = {
    count : async (Model, options) => {
        try {
            let total  = await Model.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total'] // To add the aggregation...
                ]
            });
            return GlOpResult(true, total)
        }catch (error){
            console.log(error)
            return GlOpResult(false, "Operation failed")
        }
    },
}

module.exports = StatisticsOperations