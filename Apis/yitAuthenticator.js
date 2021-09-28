const jwt  = require('jsonwebtoken');
const {jwtPrivateKey} = require("./Config");
const yitAuthenticator = {
  authAdmin: (req, res, next)=>{
    const authHead = req.headers['authorization'];
    const token = authHead && authHead.split(' ')[1];
    if(token == null){
        res.send({finalResult: false, error: "UnAuthorised"});
    } else {

        jwt.verify(token, jwtPrivateKey, (err, data) => {
            if (err) res.send({finalResult: false, error: err});
            if(data.userType == "Admin"){
                req.body.email  = data.email;
                req.body.userType = data.userType;
                next()
            }else{
                res.send({finalResult: false, error: "UnAuthorised"});
            }
        })
    }
},
  authCustomer: (req, res, next)=>{
    const authHead = req.headers['authorization'];
    const token = authHead && authHead.split(' ')[1];
    if(token == null){
        console.log("null tokken");
        res.sendStatus(401);
    }else{
        jwt.verify(token, "lkjlfngrpgjefvml,s:;vnsomvfijv", (err, data) => {
            if (err) res.sendStatus(403);
            if(data.userType == "Customer"){
                req.body.internUsersId = data.internUsersId;
                req.body.mail  = data.mail;
                req.body.userType = data.userType;
                next(req.body.internUsersId )
            }else{
                res.sendStatus(403)
            }
        })
    }
}
}





module.exports = {yitAuthenticator};
