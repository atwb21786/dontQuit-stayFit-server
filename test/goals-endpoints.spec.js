const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('../test/test-helpers')


describe.only('Goals Endpoints', function() {
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    function makeAuthHeader(user) {
        const token = Buffer.from(`${user.user_id}:${user.password}`).toString('base64')
        console.log(token)
        return `Bearer ${token}`
    }

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('goals').truncate())

    afterEach('cleanup', () => db('goals').truncate())

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

        this.beforeEach('insert goals', () => {
            return db
                .into('goals')
                .insert(goal)
        })

        it('GET /goals responds with 200 and all the goals', () => {
            const users = {user_id: 'ABC', password: '123'}
            console.log(users)
            return supertest(app)
                .get('/goals')
                .set('Authorization', helpers.makeAuthHeader(users))
                .expect(200, goal)
        })

        it('GET /goals/:goals_id responds with 200 and the specified goal', () => {
            const goalsId = 2
            const expectedGoal = goal[goalsId - 1]
            return supertest(app)
                .get(`/goals/${goalsId}`)
                .expect(200, expectedGoal)
        })
    })
})