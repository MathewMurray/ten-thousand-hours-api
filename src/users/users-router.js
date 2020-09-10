const express = require('express')
const UsersService = require('./users-service')
const {RequireAuth} = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get(RequireAuth,(req,res) => {
        res.json(UsersService.serializeUsers(req.user))
    })
    .post(jsonBodyParser,(req,res,next) => {
        const {full_name,password,user_name} = req.body
        for(const field of ['full_name','user_name','password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
            })
        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({error:passwordError})
        
        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                    return res.status(400).json({error:`Username already taken`})
            return UsersService.hashPassword(password)
                .then(hashedPassword => {
                const newUser = {
                    user_name,
                    password: hashedPassword,
                    full_name,
                    date_created:'now()',
                }

                return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                    .then(user => {
                        res
                            .status(201)
                            .json(UsersService.serializeUsers(user))
                    })
            })
        })
        .catch(next)
    })

module.exports = usersRouter