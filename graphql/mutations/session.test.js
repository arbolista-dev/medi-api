const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      should = chai.should(),
      expect = chai.expect()

chai.use(chaiAsPromised)

import schema from '../schema'
import { graphql } from 'graphql'

function api(query) {
  var result = graphql(schema, query).then(res => { return res }).catch(err => console.log(err))
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result
}


describe('Session mutations', () => {

  describe('#add session', (done) => {

    it('is successfully created', (done) => {
      var mutation = 'mutation { addSession ( user_id: 3, status: true, location: "In the forest created by test", note: "Feeling good", date: "Mon Jun 06 2016 23:05:00 GMT-0500 (CDT)", duration_planned: 600, duration_success: 600 ) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('addSession')
        res.should.not.have.property('errors')
        res.data.addSession.id.should.not.be.null
        done()
      }).catch(err => console.log(err))
    })

    it('is not created without having existing user specified', (done) => {
      var mutation = 'mutation { addSession ( user_id: 9999, status: true, location: "In the forest", note: "Feeling good", date: "Mon Jun 06 2016 23:05:00 GMT-0500 (CDT)", duration_planned: 600, duration_success: 600 ) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('addSession').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })

  describe('#update session', (done) => {

    it('is successfully updated', (done) => {
      var mutation = 'mutation { updateSession ( id: 3, user_id: 3, status: true, location: "At home updated by test", note: "Feeling", date: "Sat Feb 06 2016 22:05:00 GMT-0600 (CST)", duration_planned: 600, duration_success: 600 ) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('updateSession')
        res.should.not.have.property('errors')
        res.data.updateSession.id.should.not.be.null
        done()
      }).catch(err => console.log(err))
    })

    it('is not updated because it does not exist', (done) => {
      var mutation = 'mutation { updateSession ( id: 9999, user_id: 3, status: true, location: "At home", note: "Feeling", date: "Sat Feb 06 2016 22:05:00 GMT-0600 (CST)", duration_planned: 600, duration_success: 600 ) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('updateSession').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })

  describe('#delete session', (done) => {

    it('is successfully deleted', (done) => {
      var mutation = 'mutation { deleteSession (id: 3) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('deleteSession')
        res.should.not.have.property('errors')
        done()
      }).catch(err => console.log(err))
    })

    it('is not deleted because does not exist', (done) => {
      var mutation = 'mutation { deleteSession (id: 9999) { id } }'


      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('deleteSession').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })
})
