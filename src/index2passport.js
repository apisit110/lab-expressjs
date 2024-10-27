const express = require('express')
const session = require('express-session')
const passport = require('./helpers/passportHelper')
const middleware = require('./middleware')

const PORT = 3000

const app = express()
app.use(express.json({ limit: '5mb' }))
app.use(
  session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60000 } // 30min
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(
  (req, res, next) => {
    console.info(`[${new Date().toISOString()}] ${req.path}`)
    next()
  }
)

app.get('/', 
  (req, res, next) => {
  res.json({ success: true, message: 'Hello World' })
  next()
})

app.post('/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res, next) => {
    res.json({ success: true, message: 'login successful' })
    next()
  }
)

app.post('/profile',
  middleware.checkAuthMiddleware,
  (req, res, next) => {
    res.json({ success: true, message: 'hello profile' })
    next()
  }
)

app.post('/logout',
  middleware.checkAuthMiddleware,
  (req, res, next) => {
    req.logOut((err) => {
      req.session.destroy()
      res.json({ success: true, message: 'logout successful' })
      next()
    })
  }
)

// handle response
app.use(
  (req, res, next) => {
    next()
  }
)

// handle response error
app.use(
  (err, req, res, next) => {
    if (err) {
      res.json({ success: false, message: err.resDesc.en })
    }
    next()
  }
)

app.listen(PORT, () => {
  console.log(`server are started on port ${PORT}`)
})