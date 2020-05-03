const knex = require('knex')
const app = require('../src/app')
const jwt = require("jsonwebtoken")
const { makeUsersArray } = require('./test-helpers')

describe('Auth Endpoints', function() {
    let db
    before(() => {
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

    before('clean the table', () => db.raw('TRUNCATE auth, users RESTART IDENTITY CASCADE;'))

    afterEach('cleanup', () => db.raw('TRUNCATE auth, users RESTART IDENTITY CASCADE;'))

    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () => {
            return db('users').insert(users) 
        })

        const requiredFields = ['user_name', 'password']
        const users = makeUsersArray();

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                user_name: users.user_name,
                password: users.password,
            }

        
        })
    })

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
             const userValidCreds = {
               user_name: users.user_name,
               password: users.password,
             }
             const expectedToken = jwt.sign(
               { user_id: users.id }, // payload
               process.env.JWT_SECRET,
               {
                 subject: users.user_name,
                 algorithm: 'HS256',
               }
             )
             return supertest(app)
               .post('/auth/login')
               .send(userValidCreds)
               .expect(200, {
                 authToken: expectedToken,
               })
           })

// it(`Successful login`, (success) => {
//     const user = "abcdefg"
//     const password = 'abc123'
//     UserService.hashPassword(password).then((pwd) => {
//         UserService.insertUser(db, {user, password: pwd}).then(
//             () => {
//                 supertest(app)
//                 .post('/auth/login')
//                 .send({user, password})
//                 .expect(200)
//         })
    
//     })
// })
})