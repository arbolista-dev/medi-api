import db from './db'
import jsonwebtoken from 'jsonwebtoken'
import passport from 'passport'
var bcrypt = require('bcrypt')
require('dotenv').load()

class User {

    get(id) {
        if (id) {
            return db.any('SELECT * FROM users WHERE id= $1', id)
                .then((data) => {
                    console.log('Get user', data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            return db.any('SELECT * FROM users')
                .then((data) => {
                    console.log('List users', data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    getByEmail(email) {
        if (email) {
            return db.any('SELECT * FROM users WHERE email= $1', email)
                .then((data) => {
                    console.log('Get user by email', data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            throw new Error('No email address specified.')
        }
    }

    add(data) {
        return this.hashPassword(data.password).then(hash => {
            return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id', [data.email, data.first_name, data.last_name, hash])
                .then((user) => {
                    let result = {}
                    result.id = user.id
                    result.token = this.generateJwt(user.id, data)
                    console.log('Created user: ', result)
                    return result
                })
                .catch((error) => {
                    switch (error.code) {
                        case '23505':
                            throw new Error('User already exists.')
                            break;
                        case '23502':
                            throw new Error('Required field ' + error.column + ' not given')
                            break;
                    }
                })
        }).catch((error) => {
            return error
        })
    }

    update(data) {
        console.log('data is:', data)
        return db.result('UPDATE users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name) WHERE id = $1 RETURNING email, id, first_name, last_name', [data.id, data.email, data.first_name, data.last_name])
            .then((result) => {
                console.log('Updated user with ID:', result.rows)
                return result.rows[0]
            })
            .catch((error) => {
                console.log(error)
            })
    }

    delete(id) {
        return db.result('DELETE FROM users WHERE id = $1', id)
            .then((result) => {
                console.log('Deleted user with ID:', id)
                return result
            })
            .catch((error) => {
                console.log(error)
            })
    }

    authenticate(req) {
        console.log('model auth user: ', req)
        if (!req.email || !req.password) {
            throw new Error('All fields required.')
            return
        } else {
            return this.getByEmail(req.email)
                .then((user) => {
                    return this.getHashByUserId(user[0].id)
                        .then((hash) => {
                            return this.checkPassword(hash, req.password)
                                .then((status) => {
                                  let result = {}
                                    console.log('Password is correct? ', status)
                                    result.token = this.generateJwt(user.id, user)
                                    console.log('User authenticated using JWT: ', result)
                                    return result
                                })
                                .catch((error) => console.log('check Password error: ', error))
                        })
                        .catch((error) => console.log('get Hash error: ', error))
                })
                .catch((error) => {
                    throw new Error('getByEmail error: ', error)
                })
        }
    }

    hashPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err)

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return reject(err)

                    return resolve(hash)
                })
            })
        })
    }

    getHashByUserId(user_id) {
        return db.any('SELECT hash FROM users WHERE id= $1', user_id)
            .then((hash) => {
                return hash[0].hash
            })
            .catch((error) => {
                throw new Error('User or corresponding password not found.')
            })
    }

    checkPassword(hash, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) return reject(err)
                return resolve(res)
            })
        })
    }

    generateJwt(id, data) {
        let expiry = new Date()
        expiry.setDate(expiry.getDate() + 7)
        let full_name = data.first_name + ' ' + data.last_name

        return jsonwebtoken.sign({
            _id: id,
            email: data.email,
            name: full_name,
            exp: parseInt(expiry.getTime() / 1000)
        }, process.env.JWT_SECRET)
    }
}

export default User
