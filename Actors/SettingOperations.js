const GlOpResult = require("../Structures/GlOpResult");
const Setting = require("../Schemas/Setting");

const SettingOperations = {

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