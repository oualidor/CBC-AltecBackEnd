const GlOpResult = require("../Structures/GlOpResult");
const Setting = require("../Schemas/Setting");

const SettingOperations = {

    getAll : async (offset, limit) => {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 50
        try{
            let settings = await Setting.findAll({offset: offset, limit: limit})
            settings.forEach(setting=>{
                switch (setting.dataType){
                    case "boolean":
                        setting["dataValue"] = (setting.dataValue === "true")
                        break;
                    case "int":
                        setting["dataValue"] = parseInt(setting["dataValue"])
                }
            })
            return GlOpResult(true, settings)
        }
        catch (error){
            return GlOpResult(false , "Operation failed")
        }

    },

    getOne: async (name) => {
        try {
            let setting = await Setting.findByPk(name);
            if (setting != null){
                switch (setting.dataType){
                    case "boolean":
                        setting["dataValue"] = (setting.dataValue === "true")
                        break;
                    case "int":
                        setting["dataValue"] = parseInt(setting["dataValue"])
                }
                return GlOpResult(true, setting)
            } else {
                GlOpResult(false, "no setting with this name")
            }
        } catch (err) {
            GlOpResult(false, "Operation failed")
        }
    },
}

module.exports = SettingOperations