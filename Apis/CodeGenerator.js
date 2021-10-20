const bcrypt = require("bcrypt");
const  codeGenerator =  ()=>{
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 14;
    let password = "";
    for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }
    const hashedCode = bcrypt.hashSync(password.toString(), 14);
    return hashedCode
};

module.exports = codeGenerator