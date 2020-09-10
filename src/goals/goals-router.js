const express = require('express')
const GoalsService = require('./goals-service')
const { RequireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const UsersService = require('../users/users-service')
//const { BasicAuth } = require('../middleware/basic-auth')

const goalsRouter = express.Router()
const jsonBodyParser = express.json()

goalsRouter
    .route('/')
    .all(RequireAuth)
    .get((req,res,next) => {
        const user_id = req.user.id
        GoalsService.getAllGoals(req.app.get('db'),user_id)
            .then(goals => {
                res.json(
                    {
                        user:UsersService.serializeUsers(req.user),
                        goals:goals.map(goals => GoalsService.serializeGoal(goals))
                    }
                )
                })
            .catch(next)
    })
    .post(RequireAuth,jsonBodyParser,(req,res,next) => {
        const {title,target} = req.body
        const user_id = req.user.id
        const newGoal = {title,target,user_id}

        for(const [key,value] of Object.entries(newGoal))
        if(value == null)
            return res.status(400).json({
                error:`Missing '${key}' in request body`
            })
        newGoal.user_id = req.user.id
        GoalsService.insertGoal(
            req.app.get('db'),
            newGoal
        )
        .then(goal => {
            res.status(200).location(path.posix.join(req.originalUrl,`/${newGoal.id}`))
            .json(GoalsService.serializeGoal(goal))
        })
        .catch(next)

    })
goalsRouter
    .route('/:goal_id')
    .all(RequireAuth)
    .all(checkGoalExists)
    .get((req,res) => {
        res.json(GoalsService.serializeGoal(res.goal))
    })

goalsRouter
    .route('/:goal_id/logs')
    .all(RequireAuth)
    .all(checkGoalExists)
    .get((req,res,next) => {
        console.log(req.params.goal_id)
        GoalsService.getLogsForGoal(
            req.app.get('db'),
            req.params.goal_id
        )
        .then(logs => {
            res.json(GoalsService.serializeGoalLogs(logs))
        })
        .catch(next)
    })
async function checkGoalExists(req,res,next){
    const user_id = req.user.id
    try{
        const goal = await GoalsService.getById(
            req.app.get('db'),
            req.params.goal_id,
            user_id,
        )
        if(!goal)
            return res.status(404).json({
                error: `Goal doesn't exist`
            })
        res.goal = goal
        next()
    } catch(error) {
        next(error)
    }
}
module.exports = goalsRouter