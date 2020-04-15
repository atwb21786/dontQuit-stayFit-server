const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Goals Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('goals').truncate())

    afterEach('cleanup', () => db('goals').truncate())

    context('Given there are goals in the database', () => {
        const goal = [
            {
                id: 1,
                content: 'To lose weight and feel great!',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 2,
                content: 'To workout everyday',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 3,
                content: 'To sleep 8 hours a night',
                date_created: '2029-01-22T16:28:32.615Z'
            }
        ];

        this.beforeEach('insert goals', () => {
            return db
                .into('goals')
                .insert(goal)
        })

        it('GET /goals responds with 200 and all the goals', () => {
            return supertest(app)
                .get('/goals')
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