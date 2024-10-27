class ServiceError {
  statusCode
  resCode
  resDesc
  payload

  constructor(error, payload) {
    // super()
    this.name = 'Service Error'
    this.statusCode = error.statusCode
    this.resCode = error.resCode
    this.resDesc = {
      en: error.resDesc.en,
      th: error.resDesc.th
    }
    this.payload = payload
  }
}

module.exports = {
  ServiceError
}
