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
const corsOptions = {
  origin: 'https://kariemgerges.github.io/portfolioPage/#/' || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 3600000 // 1 hour
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
