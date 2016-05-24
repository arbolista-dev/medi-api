import chai from 'chai'
chai.should()

import schema from '../schema'
import { graphql } from 'graphql'


function api(query) {
  var result = graphql(schema, query).then(res => {
    return res
  }).catch(err => console.error(err))
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result
}

describe('Session queries', () => {
  describe('#get one session by id', () => {
    it('successfully returns valid data', (done) => {
      var query = 'query { session(id:2) { id user_id status date duration_planned duration_success  location note } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then((res) => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.session.should.have.deep.property('[0].id', 2)
        res.data.session.should.have.deep.property('[0].user_id')
        res.data.session.should.have.deep.property('[0].status')
        res.data.session.should.have.deep.property('[0].date')
        res.data.session.should.have.deep.property('[0].duration_planned')
        res.data.session.should.have.deep.property('[0].duration_success')
        res.data.session.should.have.deep.property('[0].location')
        res.data.session.should.have.deep.property('[0].note')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if session does not exist', (done) => {
      var query = 'query { session(id:9999) { id user_id status date duration_planned duration_success  location note } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.errors[0].should.have.property('message').and.include('id')
        res.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#get sessions by user and date range', () => {
    it('successfully returns valid data', (done) => {
      var query = 'query { session(user_id: 2, start_date: "2016-05-01", end_date: "2016-05-31") { id user_id status date duration_planned duration_success  location note } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then((res) => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.session.should.have.deep.property('[0].id')
        res.data.session.should.have.deep.property('[0].user_id', 2)
        res.data.session.should.have.deep.property('[0].status')
        res.data.session.should.have.deep.property('[0].date')
        res.data.session.should.have.deep.property('[0].duration_planned')
        res.data.session.should.have.deep.property('[0].duration_success')
        res.data.session.should.have.deep.property('[0].location')
        res.data.session.should.have.deep.property('[0].note')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if no sessions exist for user within date range', (done) => {
      var query = 'query { session(user_id: 999, start_date: "2016-04-22", end_date: "2016-05-25") { id user_id status date duration_planned duration_success  location note } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.errors[0].should.have.property('message').and.include('user_id')
        res.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#get all sessions', () => {
    it('successfully returns valid data', (done) => {
      var query = 'query { session { id user_id status date duration_planned duration_success  location note } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.session.should.have.lengthOf(3)
        res.data.session.should.have.deep.property('[0].id')
        res.data.session.should.have.deep.property('[0].user_id')
        res.data.session.should.have.deep.property('[0].status')
        res.data.session.should.have.deep.property('[0].date')
        res.data.session.should.have.deep.property('[0].duration_planned')
        res.data.session.should.have.deep.property('[0].duration_success')
        res.data.session.should.have.deep.property('[0].location')
        res.data.session.should.have.deep.property('[0].note')
        done()
      }).catch(err => console.error(err))
    })
  })
})
