const express = require('express');
const RentTransactionTypes = require("../../Structures/TransactionTypes");
const TransactionOperations = require("../../Actors/TransactionOperations");
const StationOperations = require("../../Actors/StationOperations");
const AnswerHttpRequest = require("../../Structures/AnswerHttpRequest");
const Station = require("../../Schemas/Station");
const Transaction = require("../../Schemas/Transaction");
const Client = require("../../Schemas/Client");
const TransactionMetaData = require("../../Schemas/TransactionMetaData");
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");
const {Op} = require("sequelize");
const path = require("path");
const multer = require("multer");

const AdminToolsRouter = express.Router();

AdminToolsRouter.post('/UploadFiles/:type',  async (req, res) => {
    let dir = req.params.type
    const storage = multer.diskStorage({
        destination: './public/uploads/'+dir+'/',
        filename: function(req, file, cb){
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

// Init Upload
    const upload = multer({
        storage: storage,
        limits:{fileSize: 10000000000* 4},
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }
    }).single('file');

// Check File Type
    function checkFileType(file, cb){
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        return cb(null,true);

    }

    upload(req, res, (err) => {
        if(err){
            res.send({finalResult: false, error:err})
        } else {
            if(req.file === undefined){
                res.send({finalResult: false, error: "no file selected"})
            } else {
                let result =req.protocol+"://"+req.get("host")+"/Images/"+dir+"/"+req.file.filename
                res.send({finalResult: true, result: result})
            }
        }
    });
});


module.exports = AdminToolsRouter;














