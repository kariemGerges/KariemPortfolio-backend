require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
// passport config
require('./config/passport');


//  Routes
const apiRouter = require('./routes/api/v1/index');
const apiRouterV2 = require('./routes/api/v1/emailSender');
const apiPostsRouter = require('./routes/api/v1/post');
const apiCategoryRouter = require('./routes/api/v1/category');
const authRouters = require('./routes/api/v1/users');

const app = express();

// middleware 
  const corsOptions = {
    origin: [
        'https://kariemgerges.github.io', // Your production frontend
        'http://localhost:3000'           // Your local development frontend
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-JSON"], // Optional: specify any headers that should be exposed
    preflightContinue: false, // Pass to next middleware if options request is valid
    optionsSuccessStatus: 204 // Status code for successful preflight response
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// session middleware
//app.use(session({
//   secret: process.env.SESSION_SECRET, // session secret
//   resave: false, // force session to be saved to the store
//   saveUninitialized: false, // force the uninitialized session to be saved

//   cookie: {
//             secure: false, 
//             maxAge: 3600000, // session expires after 1 hour and replace with true when production
//           } 
// }));
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret from your .env file
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_STRING, // MongoDB connection string from your .env file
    }),
    name: 'sessionIdKG',
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production (requires HTTPS)
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 1 * 60 * 60 * 1000, // hours * minutes * seconds * milliseconds
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site cookies in production
    },
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



// mongo connection 
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/v1', apiRouter);
app.use('/api/v1', apiRouterV2);
app.use('/api/v1', apiPostsRouter);
app.use('/api/v1', apiCategoryRouter);
app.use('/api/v1', authRouters);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
