const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Protected endpoints',() => {
    let db
    const {testUsers,testGoals,testLogs} = helpers.makeThingsFixtures()

    before('make knex instance',() => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })

    before('clear tables', () => helpers.cleanTables(db))

    after('disconnect from db',() => db.destroy())

    afterEach('clean tables', () => helpers.cleanTables(db))

    beforeEach('seed tables', () => 
        helpers.seedGoalsTables(db,testUsers,testGoals,testLogs)
    )

    const protectedEndpoints = [
        {
            name:'GET /api/goals/:goal_id',
            path:'api/goals/1',
            method:supertest(app).get,
        },
        {
            name: 'GET /api/goals/:goal_id/logs',
            path:'/api/goals/1/logs',
            method: supertest(app).get,
        },
        {
            name: 'POST /api/Logs',
            path: '/api/logs',
            method: supertest(app).post,
        },
    ]

    protectedEndpoints.forEach((endpoint) => {
        describe(endpoint.name,() => {
            it(`responds 401 "Missing bearer token" when no bearer token`,() => {
                return endpoint
                .method(endpoint.path)
                .expect(401,{error:"Missing bearer token"})
            })
            it(`responds 401 "Unauthorized request" when invalid JWT secret`, () => {
                const validUser - testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint
                    .method(endpoint.path)
                    .set('authorization',helpers.makeAuthHeader(validUser,invalidSecret))
                    .expect(401,{error:"Unauthorized request"})
            })
            it(`responds 401 "Unauthorized request" when invalid sub in payload`, () => {
                const invalidUser = {user_name:'user-not-exist',id:1}
                return endpoint
                    .method(endpoint.path)
                    .set('authorization',helpers.makeAuthHeader(invalidUser))
                    .expect(401, {error: 'Unauthorized request'})
            })
        })
    })
})