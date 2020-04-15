const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Feedback Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('feedback').truncate())

    afterEach('cleanup', () => db('feedback').truncate())

    context('Given there is feedback logged in the database', () => {
        const fb = [
            {
                id: 1,
                content: 'Met all my goals, feeling good!',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 2,
                content: 'Need to be more consistent with workouts',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 3,
                content: 'Ate cereal post workout.  Must do better.',
                date_created: '2029-01-22T16:28:32.615Z'
            }
        ];

        this.beforeEach('insert feedback ', () => {
            return db
                .into('feedback')
                .insert(fb)
        })

        it('GET /feedback responds with 200 and all the feedback logged', () => {
            return supertest(app)
                .get('/feedback')
                .expect(200, fb)
        })

        it('GET /feedback/:feedback_id responds with 200 and the specified feedback', () => {
            const feedback = 2
            const expectedFeedback = fb[feedback - 1]
            return supertest(app)
                .get(`/feedback/${feedback}`)
                .expect(200, expectedFeedback)
        })
    })
})