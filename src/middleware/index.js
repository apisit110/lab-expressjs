const { ServiceError } = require('../helpers/errorHelper')

const checkAuthMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      throw new ServiceError({
        statusCode: 401,
        resCode: '0401',
        resDesc: {
          en: 'Unauthorized',
          th: 'Unauthorized'
        }
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkAuthMiddleware
}