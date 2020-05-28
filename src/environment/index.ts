require('dotenv').config()

const PORT = process.env.PORT || 3000

const JWT_SECRECT_KEY = process.env.JWT_SECRECT_KEY || 'default'

const ENDPOINT = process.env.ENDPOINT || 'graphqlfamily'

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://admin:fYivEVbVcKOGYDgg@family-test-db-lx3fm.mongodb.net/test?retryWrites=true&w=majority'

// facebook api
const FB_APP_ID = process.env.FB_APP_ID || ''
const FB_APP_SECRET = process.env.FB_APP_SECRET || ''

// google api
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''

// sendgrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''

export { PORT, JWT_SECRECT_KEY, ENDPOINT, MONGODB_URL, FB_APP_ID, FB_APP_SECRET, GOOGLE_CLIENT_ID, SENDGRID_API_KEY }
