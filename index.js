const express = require('express');
const cors = require('cors');
const yitLogger  = require('./Apis/yitLogger')
const {adminRouters} = require("./Routers/AdminRouters");


const PORT = process.env.PORT || 8080;
const app = express();


app.use(yitLogger)

app.use(cors());

app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.use("/Admin", adminRouters)

app.listen(PORT, () => {
    console.log(`Server  running on  ${PORT}.`)
});

app.get("/", (req, res)=>{
    res.send("Server running")
})


app.get("/HeartBit", (req, res)=>{
    res.send({finalResult : true, result: true})
})


