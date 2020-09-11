/* eslint-disable strict */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router')
const logsRouter = require('./logs/logs-router');
const goalsRouter = require('./goals/goals-router');
const usersRouter = require('./users/users-router');


const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' :'common',{
    skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());
app.use('/goals', goalsRouter)
app.use('/logs',logsRouter)
app.use('/auth',authRouter)
app.use('/users',usersRouter)

app.use(function errorHandler(error,req,res,next){
   let response
   if(NODE_ENV === 'production'){
       response = {error: {message:'server error'}}
   } else {
       response = {message: error.message, error}
   }
   res.status(500).json(response)
})
module.exports = app;