const xss = require('xss')

const LogsService = {
    getById(db,id){
        return db
            .from('user_logs AS log')
            .select(
                'log.id',
                'log.text',
                'log.user_hours',
                'log.date_created',
                'log.goal_id',
                'log.user_id',
            )
            .where('log.id', id)
            .first()
    },

    insertLog(db,newLog){
        return db
            .insert(newLog)
            .into('user_logs')
            .returning('*')
            .then(([log]) => log)
            .then(log => LogsService.getById(db,log.id))
    },

    serializeLog(log){
        return {
            id:log.id,
            text:xss(log.text),
            user_hours:log.user_hours,
            date_created:log.date_created,
            goal_id:log.goal_id,
            user_id:log.user_id || {}
            }
    }
}

module.exports = LogsService