const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const USERS = require('../database/user.json')

passport.use(
  // new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
  new LocalStrategy({}, (username, password, done) => {
    try {
      const user = USERS.find((item) => item.username === username)
      if (!user) throw Error('Not found user')
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  try {
    const _user = {
      ...user,
      mutate_field: 'edit or add more new field'
    }
    done(null, _user)
  } catch (error) {
    done(new Error('TEST CATCH serializeUser'))
  }
})

passport.deserializeUser((user, done) => {
  try {
    done(null, user)
  } catch (error) {
    done(new Error('TEST CATCH deserializeUser'))
  }
})

module.exports = passport
