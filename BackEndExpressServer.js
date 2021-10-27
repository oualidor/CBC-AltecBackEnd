const express = require('express');
const EventEmitter = require('events')
const cors = require('cors');
const GuestRouters = require("./Routers/GuestRouters");
const AdminRouters = require("./Routers/AdminRouters");
const ClientRouter = require("./Routers/ClientRouters");
const AnswerHttpRequest = require("./Structures/AnswerHttpRequest");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerDocument');
const PORT = process.env.PORT || 8080;


class BackEndExpressServer extends EventEmitter{
    constructor(Port, logger) {
        super();
        this.logger = logger
        this.app = express()
        this.port = Port
        if(!this.configure()){

        }else {
            this.setRouters().then(() => {})
            this.app.use((req, res)=> {
                res.status(404);
                AnswerHttpRequest.wrong(res, "end point unknown")
            });

        }
    }

    configure(){
        try{
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
            this.app.listen(PORT, () => {
                console.log(`Server  running on  ${PORT}.`)
            });
        }catch (error){
            console.log(error)
        }
    }

    async setRouters() {
        this.app.get("/HeartBit", (req, res) => {
            res.send({finalResult: true, result: true})
        })
        this.app.use("/Admin",  AdminRouters)

        this.app.use("/Guest", GuestRouters)
        this.app.use("/Client", ClientRouter)
    }
}

module.exports = BackEndExpressServer



