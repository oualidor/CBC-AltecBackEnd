const bcrypt = require('bcrypt');
const PORT = 8080
const TCP_SERVER = "http://164.132.59.129:3000/"
//const TCP_SERVER = "http://localhost:3000/"
const adminMail = "admin@cbc-altec.dz"
const adminName = "Oualid KHIAL"
const adminPassword  = bcrypt.hashSync('0099', 10);
const jwtPrivateKey = "lkjlfngrpgjefvml,s:;vnsomvfijv";


module.exports = {PORT, TCP_SERVER, adminMail,adminName, adminPassword, jwtPrivateKey}