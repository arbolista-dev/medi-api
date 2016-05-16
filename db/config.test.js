require('dotenv').load()
import db from './config'

import chai from 'chai'
chai.should()


describe('Database connection', () => {
  it('has database URL set', () => {
    // console.log(process.env.DATABASE_URL)
    process.env.DATABASE_URL.should.include('postgres')
    process.env.DATABASE_URL.should.exist
  })

  it('exists', () => {
    db.should.exist
  })

})
