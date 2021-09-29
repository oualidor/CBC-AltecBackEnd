const Client = require("../Schemas/Client");
const Validator = require("../Apis/dataValidator");
const {UpdateData} = require("../Apis/UpdateData");



const  ClientGlobalRouters = {

    create : async (req, res) => {
        let {mail, phone, password, name, image, x, y} = req.body;
        if (password == null){
            password = "";
        }
        let validatedData = true;
        let dataError = "";
        if(!Validator.email(mail)){
            validatedData = false;
            dataError = dataError+'email: wrong email';
        }
        if(!validatedData){
            res.send({'finalResult': false,  'error': dataError});
        }else{
            const hashedPassword  = bcrypt.hashSync(password, 10);
            let data = {mail, phone, 'password' : hashedPassword, name, image, x, y};
            try {
                await Client.create(data);
                res.send({'finalResult': true, 'result': true})
            }catch (e) {
                res.send({'finalResult': false, 'error': e})
            }
        }
    },

    update : async (req, res) => {
        const id = parseInt(req.params.id);
        const preparedData = UpdateData(req.body)
        try {
            let customer = await Client.findByPk(id);
            if(customer != null){
                try {
                    await customer.update(preparedData);
                    res.send({'finalResult': true, 'result': "Client Information updated"})
                }catch (ee) {
                    res.send({'finalResult': false, 'error': ee})
                }
            }else{
                res.send({'finalResult': false, 'error': "No Client with the provided Id"})
            }
        }catch (e){
            res.send({'finalResult': false, 'error': "some thing went wrong"})
        }
    },

    getAll :  async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        Client.findAll({offset: offset, limit: limit})
            .then(stores =>
                res.send({'finalResult': true, 'result': stores})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': true})
            );
    },

    getOne :  async (req, res, id) => {

        Client.findByPk(id)
            .then(customer =>
                res.send({'finalResult': true, 'result': customer})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
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

module.exports = {ClientGlobalRouters}