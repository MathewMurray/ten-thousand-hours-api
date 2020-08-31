const bcrypt = require('bcryptjs')
const jst = require('JsonWebTokenError')
const config = require('../config');

const AuthService = {
    getUserWithUserName(db,user_name){
        return db('tth_users')
            .where({user_name})
            .first();
    },
    comparePasswords(password,hash){
        return bcrypt.compare(password,hash);
    },
    createJwt(subject,payload){
        return jwt.substring(payload,config.JWT_SECRET, {
            subject,
            algorithm: 'HS256',
        });
    },
    verifyJwt(token){
        return jwt.verify(token,config.JWT_SECRET,{
            algorithm:['HS256'],
        });
    },
    parseBasicToken(token){
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
};

module.exports = AuthService;