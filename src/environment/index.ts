require('dotenv').config()

const PORT = process.env.PORT || 3000

const JWT_SECRECT_KEY = process.env.JWT_SECRECT_KEY || 'default'

const ENDPOINT = process.env.ENDPOINT || 'graphqlfamily'

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://admin:fYivEVbVcKOGYDgg@family-test-db-lx3fm.mongodb.net/test?retryWrites=true&w=majority'

export { PORT, JWT_SECRECT_KEY, ENDPOINT, MONGODB_URL }
