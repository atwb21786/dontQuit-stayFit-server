const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray } = require('./test-helpers')

describe('Fitness Endpoints', function() {
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

    before('clean the table', () => db.raw('TRUNCATE fitness, users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE fitness, users RESTART IDENTITY CASCADE;'))

    context('Given there are workouts logged in the database', () => {
        const workout = [
            {
                id: 1,
                content: 'Go for a run!',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 2
            },
            {
                id: 2,
                content: 'Go to the gym',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 3
            },
            {
                id: 3,
                content: 'Workout with the boxflex',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ];

        const newWorkout = [
            {
                id: 3,
                content: 'Workout with the boxflex',
                date_created: '2029-01-22T16:28:32.615Z',
                user_id: 1
            }
        ]

        const users = makeUsersArray();

        beforeEach('insert fitness workouts', () => {
            return db('users').insert(users).then(() => {
                return db
                .into('fitness')
                .insert(workout)
            })          
        })

        it('GET /fitness responds with 200 and all the fitness workouts', () => {
            return supertest(app)
                .get('/fitness')
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, newWorkout)
        })

        it('GET /fitness/:fitness_id responds with 200 and the specified workout', () => {
            const workoutId = 2
            const expectedWorkout = workout[workoutId - 1]
            return supertest(app)
                .get(`/fitness/${workoutId}`)
                .set('Authorization', makeAuthHeader(users[0]))
                .expect(200, expectedWorkout)
        })
    })
})