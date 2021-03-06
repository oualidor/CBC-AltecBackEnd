const axios = require("axios");
const Partner = require("../Schemas/Partner");
const Validator = require("../Apis/DataValidator");
const Station = require("../Schemas/Station");
const bcrypt = require("bcrypt");
const AnswerHttpRequest = require("../Structures/AnswerHttpRequest");
const {UpdateData} = require("../Apis/UpdateData");
const PartnerImages = require("../Schemas/PartnerImages");
const GlOpResult = require("../Structures/GlOpResult");
const TransactionMetaData = require("../Schemas/TransactionMetaData");
Partner.hasMany(Station, {foreignKey: "currentPartner", as: "Stations"})
Partner.hasMany(PartnerImages, {foreignKey: "partnerId", as: "Images"})

const  PartnerOperations = {

    create : async (req, res) => {
        console.log(req.body)
        try {
            let {mail, phone, password, fullName, stat, type, x, y} = req.body;
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
                let data = {mail, phone,  hashedPassword, fullName,  stat, type, x, y};
                await Partner.create(data);
                res.send({'finalResult': true, 'result': true})
            }
        }catch (error) {
            if(error.name.match(/Sequelize/)){
                error = error.errors[0].message
            }
            res.send({'finalResult': false, error: error})
        }
    },

    update : async (req, res) => {
        const id = parseInt(req.params.id);
        const preparedData = UpdateData(req.body)
        try {
            let partner = await Partner.findByPk(id);
            if(partner != null){
                try {
                    await partner.update(preparedData);
                    res.send({'finalResult': true, 'result': "Client Information updated"})
                }catch (ee) {
                    res.send({'finalResult': false, 'error': ee})
                }
            }else{
                res.send({'finalResult': false, 'error': "No Client with the provided Id"})
            }
        }catch (e){
            console.log(e)
            res.send({'finalResult': false, 'error': "some thing went wrong"})
        }
    },

    getAll :  async (req, res) => {
        var {offset, limit} = req.params;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (limit === 0) limit = 99999999
        Partner.findAll({offset: offset, limit: limit})
            .then(partners =>
                res.send({'finalResult': true, 'result': partners})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': true})
            );
    },

    getOne :  async (req, res) => {
        try{
            const id = parseInt(req.params.id);
            let partner = await Partner.findByPk(id, {
                include: [
                    {model: Station, as: "Stations"},
                    {model: PartnerImages, as: "Images"},
                ]
            })
            if(partner !== null){
                AnswerHttpRequest.done(res, partner)
            }else {
                AnswerHttpRequest.wrong(res, "No partner with such ID")
            }
        }catch (error){
            AnswerHttpRequest.wrong(res, "Operation failed")
        }
    },

    getOneByAttribute : async (req, res) => {
        const id = parseInt(req.params.id);
        const attribute = req.params.attribute;
        Partner.findByPk(id, {attributes: [attribute]})
            .then(partner =>
                res.send({'finalResult': true, 'result': partner})
            )
            .catch(err =>
                res.send({'finalResult': false, 'error': err})
            );
    },

    validate : async (req, res) => {
        const id = parseInt(req.params.id);
        let data = {valid: 1};
        try {
            let customer = await Partner.findByPk(id);
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

    addImages :  async (partnerId, imagesData) => {
        let validatedData = true;
        let dataError = "";
        if(!validatedData){
            return GlOpResult(false, dataError)
        }else{
            let preparedData = []
            imagesData.forEach(entry =>{
                preparedData.push(
                    {
                        partnerId,
                        link: entry,
                    }
                )
            })
            try {
                let addImagesResult = await PartnerImages.bulkCreate(preparedData);
                return GlOpResult(true, addImagesResult)
            }catch (e) {

                return GlOpResult(false, "Bad Image link provided")
            }
        }
    },

    removeImage :  async (imageId) => {
        try {
            let partnerImage = await PartnerImages.findByPk(imageId);
            partnerImage.destroy()
            return GlOpResult(true, "image removed")
        }catch (e) {

            return GlOpResult(false, "Bad Image link provided")
        }

    }
}

module.exports = PartnerOperations