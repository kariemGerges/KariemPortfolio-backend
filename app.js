require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//  Routes
const apiRouter = require('./routes/api/v1/index');
const apiRouterV2 = require('./routes/api/v1/emailSender');
const apiPostsRouter = require('./routes/api/v1/post');
const apiCategoryRouter = require('./routes/api/v1/category');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

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

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
