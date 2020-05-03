const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray } = require('./test-helpers')

describe('Weigh In Endpoints', function() {
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

    before('clean the table', () => db.raw('TRUNCATE weigh_in, users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE weigh_in, users RESTART IDENTITY CASCADE;'))

    context('Given there are weight logs in the database', () => {
        const weights = [
            {
                id: 1,
                measurement: '150.4',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 2
            },
            {
                id: 2,
                measurement: '155.8',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 3
            },
            {
                id: 3,
                measurement: '185.4',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ];

        const newWeight = [
            {
                id: 3,
                measurement: '185.4',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ]

        const users = makeUsersArray();

        beforeEach('insert weight', () => {
            return db('users').insert(users).then(() => {
                return db
                .into('weigh_in')
                .insert(weights)
            })
        })

        it('GET /weigh_in responds with 200 and all the weights logged', () => {
            return supertest(app)
                .get('/weigh_in')
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, newWeight)
        })

        it('GET /weigh_in/:weigh_in_id responds with 200 and the specified weight', () => {
            const weightId = 2
            const expectedWeight = weights[weightId - 1]
            return supertest(app)
                .get(`/weigh_in/${weightId}`)
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, expectedWeight)
        })
    })
})