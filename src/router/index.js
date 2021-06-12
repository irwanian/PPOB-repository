const express = require('express')
const tunnel = require('tunnel-ssh')
const bodyParser = require('body-parser')
const cors = require('cors')
const { sequelize } = require('../models')
const port = process.env.PORT || 7000

const { SSH_USERNAME, SSH_PASSWORD, SSH_HOST, SSH_DST_HOST, SSH_DST_PORT } = process.env

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
    res.success = ({ payload, message, code, meta }) => {
        res.status(code || 200).send({
            code: code || 200,
            message: message || 'success',
            payload: payload || {},
            meta: meta
        })
    }

    res.error = (error) => {
        res.status(error.code || 400).send({
            code: error.code || 400,
            message: error.message || 'error',
            payload: error.payload || {}
        })
    }

    next()
})

app.get('/', (req, res) => {
    res.success({ payload: 'BANZAI!!! '})
})

app.use('/api/v1/ppob', require('./ppob'))
app.use('/api/v1/payment', require('./payment'))
app.use('/api/v1/payment-channel', require('./midtrans_payment_channel'))
app.use('/api/v1/ppob-transaction', require('./ppob_transaction'))

if (process.env.ENVIRONMENT === 'local') {
    const tunnelConfig = {
        username: SSH_USERNAME,
        password: SSH_PASSWORD,
        host: SSH_HOST,
        dstHost: SSH_DST_HOST,
        dstPort: SSH_DST_PORT
      }
      
      tunnel(tunnelConfig, (error, success) => {
          if (error) {
              console.log('Error Connecting SSH Tunnel')
          } else {
              console.log('connected to DB')
          }
        })
}

sequelize.sync()
.then(() => {
        app.listen(port, () => {
                console.log(`App listening on port: ${port}`)
        })
})
.catch((err) => {
    throw err
})

module.exports = app