const express = require('express')
const GoalsService = require('./goals-service')
const { RequireAuth } = require('../middleware/jwt-auth')
//const { BasicAuth } = require('../middleware/basic-auth')

const goalsRouter = express.Router()

goalsRouter
    .route('/')
    .get((req,res,next) => {
        GoalsService.getAllGoals(req.app.get('db'))
            .then(goal => {
                res.json(GoalsService.serializeGoal(goal))
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
    .route('/:goal_id/logs/')
    .all(RequireAuth)
    .all(checkGoalExists)
    .get((req,res,next) => {
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
    try{
        const goal = await GoalsService.getById(
            req.app.get('db'),
            req.params.goal_id
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