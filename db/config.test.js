import chai from 'chai'
chai.should()

require('dotenv').load()
import db from './config'


describe('Database connection', () => {
  it('has database URL set', () => {
    process.env.DATABASE_URL.should.include('postgres')
    process.env.DATABASE_URL.should.exist
  })

  it('exists', () => {
    db.should.exist
  })

})
