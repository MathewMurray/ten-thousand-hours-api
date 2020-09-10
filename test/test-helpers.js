const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        nickname: 'TU1',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        nickname: 'TU2',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        nickname: 'TU3',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
        nickname: 'TU4',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
    ]
  }

  function makeGoalsArray(users){
      return[
          {
            id:1,
            title:'first test goal',
            target: 80,
            user_id: users[0].id,
            date_created: '2029-01-22T16:28:32.615Z',
          },
          {
              id:2,
              title:'Second test goal',
              target:7200,
              user_id:users[1].id,
              date_created: '2029-01-22T16:28:32.615Z',
          },
          {
              id:3,
              title:'Third test goal',
              target:4000,
              user_id:users[2].id,
              date_created:'2029-01-22T16:28:32.615Z',
          },
          {
              id:4,
              title: 'Fourth test goal',
              target: 10000,
              user_id:users[3].id,
              date_created:'2029-01-22T16:28:32.615Z',
          },
      ]
  }

  function makeLogsArray(users,goal){
      return [
          {
              id:1,
              text:'First goal log!',
              user_hours:12
              goal_id:goals[0].id,
              user_id:users[0].id,
              date_created:'2029-01-22T16:28:32.615Z',
          },
          {
              id:2,
              text:'Second goal log',
              user_hours:4,
              goal_id:goals[1].id,
              user_id:users[1].id,
              date_created:'2029-01-22T16:28:32.615Z',
          },
          {
            id:3,
            text:'Third goal log',
            user_hours:4,
            goal_id:goals[2].id,
            user_id:users[2].id,
            date_created:'2029-01-22T16:28:32.615Z',
        },
        {
            id:4,
            text:'Fourth goal log',
            user_hours:6,
            goal_id:goals[0].id,
            user_id:users[0].id,
            date_created:'2029-01-22T16:28:32.615Z',
        },
        {
            id:5,
            text:'Fifth goal log',
            user_hours:2,
            goal_id:goals[1].id,
            user_id:users[1].id,
            date_created:'2029-01-22T16:28:32.615Z',
        },
        {
            id:6,
            text:'Sixth goal log',
            user_hours:4,
            goal_id:goals[2].id,
            user_id:users[2].id,
            date_created:'2029-01-22T16:28:32.615Z',
        },
        {
            id:7,
            text:'seventh goal log',
            user_hours:10,
            goal_id:goals[3].id,
            user_id:users[3].id,
            date_created:'2029-01-22T16:28:32.615Z',
        },
      ];
  }

  function makeExpectedGoal(users,goal,logs = []) {
      const user = users
      .find(users => user.id === goal.user_id)

      const goalLogs = logs
      .filter(log = > log.goal_id === goal.id)

      return {
          id:goal.id,
          title:goal.title,
          target:goal.target,
          date_created:goal.date_created,
          user: {
              id:user.id,
              user_name:user.user_name,
              full_name:user.full_name,
              date_created: user.date_created,
          },
      }
  }

  function makeExpectedGoalLogs(users,goalId,logs) {
      const expectedLogs = logs
      .filter(log => log.goal_id === goalId)

      return expectedLogs.map(log => {
          const logUser = users.find(user => user.id === log.user_id)
          return {
              id: log.id,
              text: log.text,
              user_hours:log.user_hours,
              date_created:log.date_created,
              user: {
                  id:logUser.id,
                  user_name: logUser.user_name,
                  full_name: logUser.full_name,
                  date_created:logUser.date_created,
              }
          }
      })
  }

  function makeMaliciousGoal(user) {
      const maliciousGoal = {
          id:900,
          title: 'evil! <script>alert("xss");</script>',
          target: 1,
          user_id:user.id,
          date_created: new Date().toISOString(),
      }
      const expectedGoal = {
          ...makeExpectedGoal([user],maliciousGoal),
          title:'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      }
      return {
          maliciousGoal,
          expectedGoal,
      }
  }

  function makeThingsFixtures(){
      const testUsers = makeUsersArray()
      const testGoals = makeGoalsArray(testUsers)
      const testLogs = makeLogsArray(testUsers,testGoals)
      return {testUser,testGoals,testLogs}
  }

  function cleanTables(db){
      return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
            thh_users,
            user_goals,
            user_logs
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE user_goals_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE tth_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE user_logs_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('user_goals_id_seq', 0)`),
                trx.raw(`SELECT setval('tth_users_id_seq', 0)`),
                trx.raw(`SELECT setval('user_logs_id_seq',0)`),
            ]))
        )
  }

  function seedUsers(db,users){
      const preppedUsers = users.map(user => ({
          ...user,
          password:bcrypt.hashSync(user.password,1)
      }))
      return db.into('tth_users').insert(preppedUsers)
        .then(() =>
        db.raw(
            `SELECT setval(tth_users_id_seq',?)`,
            [users[users.length -1].id],
        ))
  }
  function seedGoalsTables(db,users,goals,logs=[]){
      return db.transaction(async trx => {
          await seedUsers(trx,users)
          await trx.into('user_goals').insert(goals)
          await trx.raw(
              `SELECT setval('user_goals_id_seq',?)`,
              [goals[goals.length -1].id],
          )
          if(logs.length){
              await trx.into('user_logs').insert(logs)
              await trx.raw(
                  `SELECT setval('user_logs_id_seq',?)`,
                  [logs[logs.length - 1].id],
              )
          }
      })
  }

  function seedMaliciousGoal(db,user,goal){
      return seedUsers(db,[user])
      .then(() => 
      db
        .into('user_goals')
        .insert([goal])
        )
  }

  function makeAuthHeader(user,secret = process.env.JWT_SECRET){
      const token = jwt.sign({user_id:user.id}, secret, {
          subject:user.user_name,
          algorithm:'HS256',
      })
      return `Bearer ${token}`;
  }

  module.exports = {
      makeUsersArray,
      makeGoalsArray,
      makeLogsArray,
      makeExpectedGoal,
      makeExpectedGoalLogs,
      makeMaliciousGoal,
      
      makeThingsFixtures,
      cleanTables,
      seedGoalsTables,
      seedMaliciousGoal,
      makeAuthHeader,
      seedUsers,
    }