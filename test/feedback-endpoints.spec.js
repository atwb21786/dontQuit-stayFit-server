const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray } = require('./test-helpers')

describe('Feedback Endpoints', function() {
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

    before('clean the table', () => db.raw('TRUNCATE feedback, users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE feedback, users RESTART IDENTITY CASCADE;'))

    context('Given there is feedback logged in the database', () => {
        const fb = [
            {
                id: 1,
                content: 'Met all my goals, feeling good!',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 2
            },
            {
                id: 2,
                content: 'Need to be more consistent with workouts',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 3
            },
            {
                id: 3,
                content: 'Ate cereal post workout.  Must do better.',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ];

        const newFeedback = [
            {
                id: 3,
                content: 'Ate cereal post workout.  Must do better.',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ]

        const users = makeUsersArray();

        beforeEach('insert feedback ', () => {
            return db('users').insert(users).then(() => {
                return db
                .into('feedback')
                .insert(fb)
            })
        })

        it('GET /feedback responds with 200 and all the feedback logged', () => {
            return supertest(app)
                .get('/feedback')
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, newFeedback)
        })

        it('GET /feedback/:feedback_id responds with 200 and the specified feedback', () => {
            const feedback = 2
            const expectedFeedback = fb[feedback - 1]
            return supertest(app)
                .get(`/feedback/${feedback}`)
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, expectedFeedback)
        })
    })
})