const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray } = require('./test-helpers')


describe.only('Goals Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.user_name, 
            algorithm: 'HS256'
        })
        return `Bearer ${token}`
    }

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE goals, users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE goals, users RESTART IDENTITY CASCADE;'))

    context('Given there are goals in the database', () => {
        const goal = [
            {
                id: 1,
                content: 'To lose weight and feel great!',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 2
            },
            {
                id: 2,
                content: 'To workout everyday',
                date_created: '2029-01-22T16:28:32.615Z', 
                user_id: 3
            },
            {
                id: 3,
                content: 'To sleep 8 hours a night',
                date_created: '2029-01-22T16:28:32.615Z', 
                user_id: 1
            }
        ];

        const newGoal = [
            {
                id: 3,
                content: 'To sleep 8 hours a night',
                date_created: '2029-01-22T16:28:32.615Z', 
                user_id: 1
            }
        ]

        const users = makeUsersArray();

        beforeEach('insert goals', () => {
            return db('users').insert(users).then(() => {
                return db
                .into('goals')
                .insert(goal)
            }) 
        })

        it('GET /goals responds with 200 and all the goals', () => {
            return supertest(app)
                .get('/goals')
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, newGoal)
        })

        it('GET /goals/:goals_id responds with 200 and the specified goal', () => {
            const goalsId = 2
            const expectedGoal = goal[goalsId - 1]
            return supertest(app)
                .get(`/goals/${goalsId}`)
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, expectedGoal)
        })
    })
})