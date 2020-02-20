import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import validator from 'express-validator';
import passport from 'passport';
import session from 'express-session';
import FacebookTokenSTrategy from 'passport-facebook-token';
import DepartmentRouter from './server/routes/departments';
import CategoriesRouter from './server/routes/categories';
import AttributesRouter from './server/routes/attributes';
import ProductRouter from './server/routes/products';
import CustomersRouter from './server/routes/customers';
import ShoppingcartRouter from './server/routes/shoppingcart';

passport.use(new FacebookTokenSTrategy(
  {
    clientID: process.env.facebookClientId,
    clientSecret: process.env.facebookClientSecret,
    fbGraphVersion: 'v3.0',
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  },
));
const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(validator());
app.use('/attributes', AttributesRouter);
app.use('/departments', DepartmentRouter);
app.use('/categories', CategoriesRouter);
app.use('/products', ProductRouter);
app.use('/shoppingcart', ShoppingcartRouter);
app.use(CustomersRouter);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to tucommerce');
});
app.get('*', (req, res) => {
  res.status(404).send({
    message: 'Endpoint not found. Try again',
  });
});

app.listen(port, () => {
  console.log('App listening on port', port);
});
