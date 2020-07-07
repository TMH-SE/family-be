<p align="center">
  <img src="src/assets/images/logo.png" width="320" alt="Logo" />
</p>

## 1. Preparation

### 1.1 Create file .env

```bash
# follow the file .env.example
NODE_ENV=<development|production >
PORT=<PORT_START>
MONGODB_URL=<YOUR_MONGODB_URL>
FB_APP_ID=<YOUR_FACEBOOK_APP_ID>
FB_APP_SECRET=<YOUR_FACEBOOK_APP_SECRECT_KEY>
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GMAIL_USERNAME=<YOUR_EMAIL_ADDRESS>
GMAIL_PASSWORD=<YOUR_EMAIL_PASSWORD>
FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
FIREBASE_DATABASE_URL=<YOUR_FIREBASE_DATABASE_URL>
FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID>
JWT_SECRECT_KEY=<YOUR_JWT_SECRET_KEY>
JWT_VERIFY_EMAIL_SECRECT_KEY=<YOUR_JWT_VERIFY_EMAIL_SECRECT_KEY>
```

### 1.2 Install package

```bash
# using npm
$ npm i

# using yarn
$ yarn add
```

### 1.3 Run generate schema graphql

```bash
$ npm run generate
```

## 2. Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
  #1. build app
  $ npm run build
  #2. start app
  $ npm run start:prod

# Running the app with webpack (Hot-Module Replacement)
$ npm run start:hmr
```

## 3. Git policy

### 3.1 Branch

```bash
  # create branch before perform your task
  # naming branch follow the pattern: yourName_yourTask
  # e.g: hieu_khachHang
  $ git branch <your_branch>

  # check out your branch before start code
  $ git checkout <your_branch>
```

### 3.2 Commit code

```bash
  # save your changes
  $ git add .

  # commit code
  # your comment must be concise and describe what you did
  $ git commit -m 'your comment'
```

### 3.3 Pull code

```bash
  # always pull code before whenever start coding or push code to repository
  $ git pull origin master
```

### 3.4 Push code

```bash
  # push code from local to repository
  $ git push origin <your_branch>
```

\*_*NOTE:*_ Before push code, you must pull code from "test" branch and fix conflict
