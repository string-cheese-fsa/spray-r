const router = require('express').Router()
module.exports = router

router.use('/drawings', require('./drawing'))
// router.use('/user', require('./user'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
