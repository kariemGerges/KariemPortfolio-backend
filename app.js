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


//  Routes
const apiRouter = require('./routes/api/v1/index');
const apiRouterV2 = require('./routes/api/v1/emailSender');
const apiPostsRouter = require('./routes/api/v1/post');
const apiCategoryRouter = require('./routes/api/v1/category');
const authRouters = require('./routes/api/v1/users');

const app = express();

// middleware 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


// cors

const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://kariemgerges.github.io/portfolioPage/#'
      ];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Allow cookies and other credentials in requests
}));


// session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // session secret
  resave: false, // force session to be saved to the store
  saveUninitialized: false, // force the uninitialized session to be saved
  cookie: { secure: false, 
            maxAge: 3600000, // session expires after 1 hour and replace with true when production

          } 
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// passport config
require('./config/passport');

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
