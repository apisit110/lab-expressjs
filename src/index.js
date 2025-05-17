const express = require('express')
const app = express()
const router = express.Router()

const USERS = require('./database/user.json')

router.get('/',
  (req, res, next) => {
    res.json('Hello method GET')
    next()
  }
)

router.post('/',
  (req, res, next) => {
    console.log(req.path)
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.send('Hello method POST')
    next()
  }
)

router.get('/:id',
  (req, res, next) => {
    console.log(req.path)
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.send(`Hello, dynamic route ${(req.params.id)}`)
    next()
  }
)

router.get('/:id/profile',
  (req, res, next) => {
    console.log(req.path)
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.send(`Hello, nested route ${(req.params.id)}`)
    next()
  }
)

const settingController = () => (req, res, next) => {
  console.log('This is controller - settingController')

  next()
}
router.get('/:id/setting',
  settingController(),
  (req, res, next) => {
    res.send('Hello, World!')
    next()
  }
)

const validateRequestController = () => (req, res, next) => {
  if (req.query.status && req.query.status !== 'APPROVED') {
    throw new Error('Validation Error')
  }
  next()
}
const validateAccessToken = () => (req, res, next) => {
  // const accessToken = req.query.access_token
  const accessToken = req.headers.access_token
  if (!accessToken || (accessToken && accessToken !== 'TEST')) {
    throw new Error('Invalide Access Token')
  }

  // got userId from access token
  res.locals.userId = 1

  if (res.locals.userId === undefined) {
    throw new Error('not found user id in access token')
  }

  next()
}
const findPermissions = () => (req, res, next) => {
  const userId = res.locals.userId

  const permissions = USERS.find((user) => user.id === userId)
  res.locals.permissions = permissions

  next()
}
const validatePermission = (name, action) => (req, res, next) => {
  if (!res.locals.permissions) {
    throw new Error('Invalide permissions')
  }
  
  const _permission = res.locals.permissions.permissions
    .find((permission) => {
      return permission.name === name
    })

  
  if (!_permission) {
    throw new Error('Unauthorized')
  }

  if (_permission?.[action.toLowerCase()] !== true) {
    throw new Error('Forbidden')
  }
  next()
}
const findUserTransaction = () => (req, res, next) => {
  const userId = res.locals.userId

  const fakeTransactions = [
    {
      user_id: 1,
      transactions: [
        {
          id: '10',
          type: 'PAYMENT',
          status: 'APPROVED'
        }
      ]
    }
  ]

  const transactions = fakeTransactions.find((transaction) => transaction.user_id === userId)?.transactions || []
  res.locals.transactions = transactions
  next()
}
router.get('/:id/transaction',
  validateRequestController(),
  validateAccessToken(),
  findPermissions(),
  validatePermission('USER', 'view'),
  findUserTransaction(),
  (req, res, next) => {
    res.json({
      res_code: '0000',
      res_desc: '',
      data: {
        transactions: res.locals.transactions
      }
    })
    next()
  }
)

const createRequestLogController = () => (req, res, next) => {
  res.locals.requestId = 'EXAMPLE-UUID-' + new Date().toISOString() + String(Math.random())
  res.locals.requestTime = new Date().toISOString()
  console.log(`[${new Date().toISOString()}] - ${res.locals.requestId} - createRequestLogController`)

  next()
}
const createResponseLogController = () => (req, res, next) => {
  const start = res.locals.requestTime
  const end = new Date().toISOString()
  const responseTime = new Date(end) - new Date(start)
  console.log(`[${new Date().toISOString()}] - ${res.locals.requestId} - ${responseTime}ms - createResponseLogController`)

  next()
}
const createErrorLogController = () => (err, req, res, next) => {
  const start = res.locals.requestTime
  const end = new Date().toISOString()
  const responseTime = new Date(end) - new Date(start)
  console.log(`[${new Date().toISOString()}] - ${res.locals.requestId} - ${responseTime}ms - createErrorLogController`)

  next()
}

app.use(createRequestLogController())
app.use(router)
app.use(createResponseLogController())
app.use(createErrorLogController())

app.listen(3000)