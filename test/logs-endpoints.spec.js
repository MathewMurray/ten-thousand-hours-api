const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Logs endpoints', function() {
    let db
    const {
        testGoals,
        testUsers,
    } = helpers.makeThingsFixtures()

    before('make knex instance',() => {
        db=knex({
            client:'pg',
            connection:process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup',() => helpers.cleanTables(db))

    afterEach('cleanup',() => helpers.cleanTables(db))

    describe(`Post /api/logs`, () => {
        beforeEach('insert goals',() => 
        helpers.seedGoalsTables(
            db,
            testUsers,
            testGoalsm
        ))

        it(`creates a log, responding with 201 and the new log`, function() {
            this.retries(3)
            const testGoal = testGoals[0]
            const testUser = testUsers[0]
            const newLog = {
                text:'Test new Log',
                user_hours:4,
                goal_id:testGoal.id,
                user_id:testUser.id
            }
            return supertest(app)
                .post('api/logs')
                .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
                .send(newLog)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_hours).to.eql(newLog.user_hours)
                    expect(res.body.text).to.eql(newLog.text)
                    expect(res.body.goal_id).to.eql(newLog.goal_id)
                    expect(res.body.user.id).to.eql(testUser.id)
                    expect(res.headers.location).to.eql(`/api/logs/${res.body.id}`)
                    const expectedDate = new Date().toLocaleString()
                    const actualDate = new Date(res.body.date_created).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                    .expect(res =>
                        db
                            .from('user_logs')
                            .select('*')
                            .where({id:res.body.id})
                            .first()
                            .then(row => {
                                expect(row.test).to.eql(newLog.text)
                                expect(row.user_hours).to.eql(newLog.user_hours)
                                expect(row.goal_id).to.eql(newLog.goal_id)
                                expect(row.user_id).to.eql(testUser.id)
                                const expectedDate = new Date().toLocaleString()
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)
                            }))
        })
        const requiredFields = ['text','user_hours','goal_id']

        requiredFields.forEach(field => {
            const testGoal = testGoals[0]
            const testUser = testUsers[0]
            const newLog = {
                text:'Test new Log',
                user_hours:3,
                goal_id:testGoal.id,
            }

            it(`responds with 400 and an error message when '${field}' is missing`,() => {
                delete newLog[field]

                return supertest(app)
                    .post('/api/logs')
                    .set('Authorization',helpers.makeAuthHeader(testUser))
                    .send(newLog)
                    .expect(400,{
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
    })
})