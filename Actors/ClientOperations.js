const Client = require("../Schemas/Client");
const Validator = require("../Apis/DataValidator");
const bcrypt = require("bcrypt");
const GlOpResult = require("../Structures/GlOpResult");
const ClientWallet = require("../Schemas/ClientWallet");
const {UpdateData} = require("../Apis/UpdateData");
Client.hasOne(ClientWallet, {as : 'Wallet', foreignKey : 'clientId'});


const  ClientOperations = {

    create : async (data) => {
        try {
            let {mail, phone, password, fullName, stat, type} = data;
            if (password == null){
                password = "";
            }
            let validatedData = true;
            let dataError = "";
            if(!Validator.email(data.mail)){
                validatedData = false;
                dataError = dataError+'email: wrong email';
            }
            if(!Validator.password(data.password)){
                validatedData = false;
                dataError = dataError+'Password: bad password';
            }
            if(!validatedData){
                return GlOpResult(false, dataError)
            }

            else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                let data = {mail, phone, hashedPassword, fullName, stat, type};
                let client = await Client.create(data);
                return GlOpResult(true, client)
            }
        }
        catch (error) {
            if(error.name.match(/Sequelize/)){
                error = error.errors[0].message
                return GlOpResult(false, error)
            }
            return GlOpResult(false, "Operation failed")
        }
    },

    update : async (id, data) => {
        const preparedData = UpdateData(data)
        if("password" in preparedData){
            const hashedPassword = bcrypt.hashSync(preparedData.password, 10);
            preparedData['hashedPassword'] = hashedPassword
        }
        try {
            let currentActor = await Client.findByPk(id);
            if(currentActor != null){
                try {
                    await currentActor.update(preparedData);
                    return GlOpResult(true, "Client Information updated")
                }catch (error) {
                    return GlOpResult(false, "Could not update teh client")
                }
            }else{
                return GlOpResult(false, "No Client with the provided Id")
            }
        }catch (error){
            return GlOpResult(false, "Request failed")
        }
    },

    findByPk :  async (id, options) => {
        try{
            if(options === undefined) options = {
                include : [
                    {
                        model: ClientWallet,
                        as: "Wallet",
                    }
                ],
            }
            let client = await Client.findByPk(id, options)
            if(client != null)     return GlOpResult(true, client)
            return GlOpResult(false, "User not found")
        }catch (e){
            console.log(e)
            return GlOpResult(false, "request failed")
        }
    },

    findOne :  async (options) => {
        try{
            if(options === undefined) options = {
                include : [
                    {
                        model: ClientWallet,
                        as: "Wallet",
                    }
                ],
            }
            let client = await Client.findOne(options)
            if(client != null) return client
            return false
        }catch (e){
            console.log(e)
            return false
        }
    },

    getOneByAttribute : async (req, res) => {
        const id = parseInt(req.params.id);
        const attribute = req.params.attribute;
        Client.findByPk(id, {attributes: [attribute]})
            .then(customer =>
                res.send({'finalResult': true, 'result': customer})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
    },

    validate : async (req, res) => {
        const id = parseInt(req.params.id);
        let data = {valid: 1};
        try {
            let customer = await Client.findByPk(id);
            if(customer != null){
                try {
                    await customer.update(data);
                    res.send({'finalResult': true, 'result': "Client validated"})
                }catch (ee) {
                    res.send({'finalResult': false, 'error': ee})
                }
            }else{
                res.send({'finalResult': false, 'error': "No customer with the provided Id"})
            }
        }catch (e){
            res.send({'finalResult': false, 'error': "some thing went wrong"})
        }
    },
}

module.exports = ClientOperations