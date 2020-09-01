const express = require('express')
const path = require('path')
const LogsService = require('./logs-service')
const { RequireAuth } = require('../middleware/jwt-auth')
//const { BasicAuth } = require('../middleware/basic-auth')

const logsRouter = express.Router()
const jsonBodyParser = express.json()

logsRouter
    .route('/')
    .post(RequireAuth,jsonBodyParser, (req,res,next) => {
        const {goal_id,text,user_hours} = req.body
        const user_id = req.user.id
        const newLog = {goal_id,text,user_hours,user_id}

        for(const [key,value] of Object.entries(newLog))
            if(value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        newLog.user_id = req.user.id

        LogsService.insertLog(
            req.app.get('db'),
            newLog
        )
            .then(log => {
                res.status(201).location(path.posix.join(req.originalUrl,`/${log.id}`))
                .json(LogsService.serializeLog(log))
            })
            .catch(next)
    })

    module.exports = logsRouter