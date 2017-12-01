const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const FB = require('fb');
const app = express();

const secret = 'aösdfkjsadölkfjsadfölk';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bearerToken());

app.use(morgan('tiny'));

app.post('/api/auth', async (req, res) => {
  const accessToken = req.body.fbAccessToken;
  if (!accessToken) {
    res.status(401).json({ message: 'No token provided.' });
  } else {
    FB.api('/me', { fields: 'id', access_token: accessToken }, response => {
      if (!response.id) {
        res.status(401).json({ message: 'Invalid token provided.' });
      } else {
        // TODO Look up user.
        const token = jwt.sign(response.id, secret);
        res.json({
          jwt: token
        });
      }
    });
  }
});

app.use((req, res, next) => {
  if (req.token) {
    jwt.verify(req.token, secret, function(err, decoded) {      
      if (err) {
        res.status(403).json({ message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'No token provided.' });
  }
});

app.get('/api/user', async (req, res) => {
  res.json({
    userName: 'Otto'
  });
});

app.listen(4201, () => {
  console.log('running on 4201 ...');
});
