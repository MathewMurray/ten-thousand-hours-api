const xss = require('xss')
const Treeize = require('treeize')

const GoalsService = {
    getAllGoals(db){
        return db
            .from('user_goals AS goal')
            .select(
                'goal.id',
                'goal.title',
                'goal.target',
                'goal.date_created',
                ...userFields,
            )
            .groupBy('goal.id','user.id')
    },
    getById(db,id){
        return GoalsService.getAllGoals(db)
            .where('goal.id',id)
            .first()
    },
    getLogsForGoal(db,goal_id){
        return db
            .from('user_logs AS log')
            .select(
                'logs.id',
                'log.text',
                'log.user_hours',
                'log.date_created',
                ...userFields,
            )
            .where('log.goal_id',goal_id)
            .leftJoin(
                'tth_users AS user',
                'log.user_id',
                'user.id',
            )
            .groupBy('log.id','user.id')
    },
    serializeGoal(goal){
        const goalTree = new Treeize()

        const goalData = thingTree.grow([goal]).getData()[0]
        return {
            id: goalData.id,
            title:xss(goalData.title),
            date_created:goalData.date_created,
            target:xss(goalData.target), 
            user: goalData.user || {},
        }
    },
    serializeGoalLogs(logs){
        return logs.map(this.serializeGoalLog)
    },
    serializeGoalLog(log){
        const logTree = new Treeize()
        const logData = logTree.grow([ log ]).getData()[0]
        return {
            id: logData.id,
            text: xss(logData.text),
            user_hours: logData.user_hours,
            date_created: logData.date_created,
            goal_id: logData.goal_id,
            user_id: logData.user_id,
        }
    },
}

const userFields = [
    'user.id AS tth_user.ids',
    'user.user_name AS tth_users.user_name',
    'user.full_name AS tth_users.full_name',
    'user.date_created AS tth_users.date_created',

]

module.exports = GoalsService