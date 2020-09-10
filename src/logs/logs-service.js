const xss = require('xss')

const LogsService = {
    getById(db,id){
        return db
            .from('user_logs')
            .select(
                'user_logs.id',
                'user_logs.text',
                'user_logs.user_hours',
                'user_logs.date_created',
                'user_logs.goal_id',
                'user_logs.user_id',
                db.raw(
                    `row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                                usr.id,
                                usr.user_name,
                                usr.full_name,
                                usr.date_created,
                                usr.date_modified
                        ) tmp)
                    ) AS "user"`
                )
            )
            .leftJoin(
                'tth_users AS usr',
                'user_logs.user_id',
                'usr.id',
            )
            .where('user_logs.id', id)
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