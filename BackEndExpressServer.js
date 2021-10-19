const express = require('express');
const EventEmitter = require('events')
const cors = require('cors');
const GuestRouters = require("./Routers/GuestRouters");
const AdminRouters = require("./Routers/AdminRouters");
const SettingOperations = require("./Actors/SettingOperations");
const {yitAuthenticator} = require("./Apis/yitAuthenticator");
const {clientRouter} = require("./Routers/ClientRouters");
const PORT = process.env.PORT || 8080;


class BackEndExpressServer extends EventEmitter{
    constructor(Port, logger) {
        super();
        this.logger = logger
        this.isRunning = false
        this.app = express()
        this.port = Port
        if(!this.configure()){

        }else {
            this.setRouters()

        }
    }

    configure(){
        try{
            this.app.use(cors());
            this.app.use(express.urlencoded({ extended: true }))
            this.app.use(express.json());
            if(this.logger != undefined) this.app.use(this.logger)



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
            this.isRunning = true
        }catch (error){
            console.log(error)
        }
    }

    async setRouters() {
        this.app.get("/HeartBit", (req, res) => {
            res.send({finalResult: true, result: true})
        })
        this.app.use("/Admin", yitAuthenticator.authAdmin, AdminRouters)

        this.app.use("/Guest", GuestRouters)
        this.app.use("/Client", yitAuthenticator.authClient, clientRouter)
    }
}

module.exports = BackEndExpressServer



