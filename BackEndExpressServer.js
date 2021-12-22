const express = require('express');
const EventEmitter = require('events')
const cors = require('cors');
const GuestRouters = require("./Routers/GuestRouters");
const ConsoleMessages = require('./Apis/ConsoleMessages')
const AdminRouters = require("./Routers/AdminRouters");
const ClientRouter = require("./Routers/ClientRouters");
const AnswerHttpRequest = require("./Structures/AnswerHttpRequest");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerDocument');
const PartnerRouter = require("./Routers/PartnerRouter");
const Transaction = require("./Schemas/Transaction");
const TransactionMetaData = require("./Schemas/TransactionMetaData");
const {Op} = require("sequelize");
const PORT = process.env.PORT || 8080;


class BackEndExpressServer extends EventEmitter{
    constructor(Port, logger) {
        super();
        ConsoleMessages.log('- Creating the back end server')
        this.logger = logger
        this.app = express()
        this.port = Port
        ConsoleMessages.success("Server created and ready for configuration")
    }

    configure(){
        try{
            console.log('- Configuring the server')
            this.app.use(cors());
            this.app.use(express.urlencoded({ extended: true }))
            this.app.use(express.json());

            if(this.logger !== undefined) this.app.use(this.logger)
            this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
            return true
        }catch (e){
            console.log(e)
            return false
        }
    }

    start(){
        try{
            console.log("- Attempting to listen on port: " +PORT)
            this.app.listen(PORT);
            return true
        }catch (error){
            return false
            console.log(error)
        }
    }

    async setRouters() {
        try{

            this.app.get("/HeartBit", (req, res) => {
                res.send({finalResult: true, result: true})
            })

            this.app.get("/test", async (req, res) => {

            })

            this.app.use('/Images', express.static(__dirname + '/public/uploads'));
            this.app.use("/Admin",  AdminRouters)

            this.app.use("/Guest", GuestRouters)
            this.app.use("/Client", ClientRouter)
            this.app.use("/Partner", PartnerRouter)
            this.app.use((req, res)=> {
                res.status(404);
                AnswerHttpRequest.wrong(res, "end point unknown")
            });
            return true
        }catch (error){
            return false
        }

    }
}

module.exports = BackEndExpressServer



