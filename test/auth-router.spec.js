const knex = require('knex')
const app = require('../src/app')
const UserService = require('../src/users/users-service')

describe('Auth Endpoints', function() {
    let db
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

it(`Successful login`, (success) => {
    const user = "abcdefg"
    const password = 'abc123'
    UserService.hashPassword(password).then((pwd) => {
        UserService.insertUser(db, {user, password: pwd}).then(
            () => {
                supertest(app)
                .post('/auth/login')
                .send({user, password})
                .expect(200)
        })
    
    })
})
})