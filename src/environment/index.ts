require('dotenv').config()

// basic
const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 3000

// jwt
const JWT_SECRECT_KEY = process.env.JWT_SECRECT_KEY || 'default'
const JWT_VERIFY_EMAIL_SECRECT_KEY = process.env.JWT_VERIFY_EMAIL_SECRECT_KEY || 'verify'

// graphql
const ENDPOINT = process.env.ENDPOINT || 'graphqlfamily'

// mongodb
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://admin:fYivEVbVcKOGYDgg@family-test-db-lx3fm.mongodb.net/test?retryWrites=true&w=majority'

// facebook api
const FB_APP_ID = process.env.FB_APP_ID || ''
const FB_APP_SECRET = process.env.FB_APP_SECRET || ''

// google api
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''

// sendgrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''

// gmail
const GMAIL_USERNAME = process.env.GMAIL_USERNAME
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

export { NODE_ENV, PORT, JWT_SECRECT_KEY, JWT_VERIFY_EMAIL_SECRECT_KEY, ENDPOINT, MONGODB_URL, FB_APP_ID, FB_APP_SECRET, GOOGLE_CLIENT_ID, SENDGRID_API_KEY, GMAIL_USERNAME, GMAIL_PASSWORD }
