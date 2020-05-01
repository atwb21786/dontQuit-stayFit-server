const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Weigh In Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('weigh_in').truncate())

    afterEach('cleanup', () => db('weigh_in').truncate())

    context('Given there are weight logs in the database', () => {
        const weights = [
            {
                id: 1,
                measurement: '150.4',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 2,
                measurement: '155.8',
                date_created: '2029-01-22T16:28:32.615Z'
            },
            {
                id: 3,
                measurement: '185.4',
                date_created: '2029-01-22T16:28:32.615Z'
            }
        ];

        this.beforeEach('insert weight', () => {
            return db
                .into('weigh_in')
                .insert(weights)
        })

        it('GET /weigh_in responds with 200 and all the weights logged', () => {
            return supertest(app)
                .get('/weigh_in')
                .expect(200, weights)
        })

        it('GET /weigh_in/:weigh_in_id responds with 200 and the specified weight', () => {
            const weightId = 2
            const expectedWeight = weights[weightId - 1]
            return supertest(app)
                .get(`/weigh_in/${weightId}`)
                .expect(200, expectedWeight)
        })
    })
})