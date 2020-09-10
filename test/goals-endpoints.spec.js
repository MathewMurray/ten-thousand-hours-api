const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('goals endpoints', function() {
    let db

    const {
        testUsers,
        testGoals,
        testLogs,
    } = helpers.makeThingsFixtures()

    before('make knex instance',() => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup',() => helpers.cleanTables(db))

    afterEach('cleanup',() => helpers.cleanTables(db))

    describe(`Get /api/goals`,() => {
        context(`Given no goals`,() => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                .get('/api/goals')
                .expect(200,[])
            })
        })

        context(`Given there are goals in the database`, () => {
            beforeEach('insert goals', () =>
            helpers.seedGoalsTables(
                db,
                testUsers,
                testGoals,
                testLogs,
            ))
            
            it(`responds with 200 and all of the goals`, () => {
                const expectedGoals = testGoals.map(goal =>
                    helpers.makeExpectedGoal(
                        testUsers,
                        goal,
                        testLogs,
                    ))
                    return supertest(app)
                    .get('/api/goals')
                    .expect(200, expectedGoals)
            })
        })

        context(`given an XSS attack goal`, () => {
            const testUsers = helpers.makeUsersArray()[1]
            const {
                maliciousGoal,
                expectedGoal,
            } = helpers.makeMaliciousGoal(testUser)

            beforeEach('insert Malicious Goal', () => {
                return helpers.seedMaliciousGoal(
                db,
                testUser,
                maliciousGoal,
                )
            })

            it(`removes XSS attack content`,() => {
                return supertest(app)
                .get('/api/goals')
                .expect(200)
                .expect(res => {
                    expect(res.body[0].title).to.eql(expectedGoal.title)
                    expect(res.body[0].target).to.eql(expectedGoal.target)
                })
            })
        })
    })

    describe(`GET /api/goals/:goal_id`, () => {
        context(`given no goals`, () => {
            beforeEach(() =>
            helpers.seedUsers(db,testUsers)
            )
        it(`responds with 404`,() => {
            const goalId = 123456
            return supertest(app)
            .get(`/api/goals/${goalId}`)
            .set('Authorication',helpers.makeAuthHeader(testUsers[0]))
            .expect(404,{error:`goal doesn't exist`})
        })
        })
        context(`Given there are goals in the database`, () => {
            beforeEach(`insert Goals`, () =>
            helpers.seedGoalsTables(
                db,
                testUsers,
                testGoals,
                testLogs,
            ))

            it(`responds with 200 and the specified goal`, () => {
                const goalId = 2
                const expectedGoal = helpers.makeExpectedGoal(
                    testUsers,
                    testgoals[goalId -1],
                    testLogs,
                )

                return supertest(app)
                .get(`/api/goals/${goalId}`)
                .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
                .expect(200,expectedGoal)
            })
        })

        context(`Given an XSS attack Goal`, () => {
            const testUser = helpers.makeUsersArray()[1]
            const {
                maliciousGoal,
                expectedGoal,
            } = helpers.makeMaliciousGoal(testUser)

            beforeEach('insert Malicious Goal', () => {
                return helpers.seedMaliciousGoal(
                    db,
                    testUser,
                    maliciousGoal,
                )
            })

            it(`removes XSS attack content`,() => {
                return supertest(app)
                .get(`/api/goals/${maliciousGoal.id}`)
                .set('Authorization',helpers.makeAuthHeader(testUser))
                .expect(200)
                .expect( res => {
                    expect(res.body.title).to.eql(expectedGoal.title)
                    expect(res.body.target).to.eql(expectedGoal.target)
                })
            })
        })
    })

    describe(`GET /api/goals/:goal_id/logs`,() => {
        context(`Given no goals`, () => {
            beforeEach(() => 
            helpers.seedUsers(db,testUsers)
            )
        it(`responds with 404`,() => {
            const thingId = 123456
        })
        })
    })
})