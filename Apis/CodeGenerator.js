const bcrypt = require("bcrypt");

function generate(){
    let code = Math.floor(Math.random() * 999999999)
    const hashedCode = bcrypt.hashSync(code.toString(), 10);
    return hashedCode
}

const  codeGenerator =  generate();

module.exports = codeGenerator