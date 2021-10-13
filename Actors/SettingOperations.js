const GlOpResult = require("../Structures/GlOpResult");
const Setting = require("../Schemas/Setting");

const SettingOperations = {
    create : async (name, dataType, dataTitle, dataValue, stat) => {
        try {
            let validatedData = true;
            let dataError = "";
            if (!validatedData) {
                return GlOpResult(false, dataError)
            } else {
                let newSettingEntry  = await Setting.create(name, dataType, dataTitle, dataValue, stat);
                return GlOpResult(true, newSettingEntry)
            }
        }catch (error){
            console.log(error)
            return GlOpResult(false, "Operation failed")
        }
    },

    getAll : async () => {
        try{
            let settings = await Setting.findAll()
            if(settings !== null){
                return GlOpResult(true, settings)
            }else {
                GlOpResult(false, [])
            }
        }catch (error){
            GlOpResult(false, "Operation failed")
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