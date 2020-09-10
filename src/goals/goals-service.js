const xss = require('xss')
//const Treeize = require('treeize')

const GoalsService = {
    getAllGoals(db,user_id){
        return db
            .from('user_goals')
            .select('*')
            .where('user_goals.user_id', user_id)
            .orderBy('user_goals.id')
    },
    getById(db,id,user_id){
        return GoalsService.getAllGoals(db,user_id)
            .from('user_goals')
            .select('*')
            .where('user_goals.id',id)
            .first()
    },
    insertGoal(db,newGoal){
        return db
            .insert(newGoal)
            .into('user_goals')
            .returning('*')
            .then(([goal]) => goal)
    },
    getLogsForGoal(db,goal_id){
        return db
            .from('user_logs')
            .select(
                'user_logs.id',
                'user_logs.text',
                'user_logs.user_hours',
                'user_log.date_created',
                ...userFields,
            )
            .where('user_logs.goal_id',goal_id)
            .leftJoin(
                'tth_users',
                'log.user_id',
                'tth_users.id',
            )
            .groupBy('user_logs.id','tth_users.id')
    },

    serializeGoals(goals){
        return goals.map(this.serializeGoal)
    },
    serializeGoal(goal){

        //const goalData = goalTree.grow([goal]).getData()[0]
        return {
            id: goal.id,
            title:xss(goal.title),
            target:xss(goal.target), 
            date_created:goal.date_created,
            user: goal.user_id,
        }
    },
    serializeGoalLogs(logs){
        return logs.map(this.serializeGoalLog)
    },
    serializeGoalLog(log){
        //const logTree = new Treeize()
        //const logData = logTree.grow([ log ]).getData()[0]
        return {
            id: log.id,
            text: xss(log.text),
            user_hours: log.user_hours,
            date_created: log.date_created,
            goal_id: log.goal_id,
            user_id: log.user_id,
        }
    },
}

const userFields = [
    'tth_users.id',
    'tth_users.user_name',
    'tth_users.full_name',
    'tth_users.date_created',

]

module.exports = GoalsService