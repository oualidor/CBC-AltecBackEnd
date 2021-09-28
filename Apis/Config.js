const bcrypt = require('bcrypt');
const PORT = 8080
const TCP_SERVER = "http://164.132.59.129:3000/"
//const TCP_SERVER = "http://localhost:3000/"
const adminMail = "walid.khial@gmail.com"
const adminPassword  = bcrypt.hashSync('16026363', 10);
const jwtPrivateKey = "lkjlfngrpgjefvml,s:;vnsomvfijv";


module.exports = {PORT, TCP_SERVER, adminMail, adminPassword, jwtPrivateKey}