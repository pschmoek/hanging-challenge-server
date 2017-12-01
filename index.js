const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const FB = require('fb');
const app = express();

const secret = 'aösdfkjsadölkfjsadfölk';
const AppUser = require('./model/app-user');
const Hang = require('./model/hang');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bearerToken());

app.use(morgan('tiny'));

app.post('/api/auth', async (req, res) => {
  const accessToken = req.body.fbAccessToken;
  if (!accessToken) {
    res.status(401).json({ message: 'No token provided.' });
  } else {
    FB.api('/me', { fields: 'id', access_token: accessToken }, async response => {
      if (!response.id) {
        res.status(401).json({ message: 'Invalid token provided.' });
      } else {
        const lookedUpUser = await AppUser.getUser(response.id);
        if (lookedUpUser && lookedUpUser.id) {
          const token = jwt.sign(lookedUpUser.id, secret);
          return res.json({ jwt: token });
        }

        FB.api('/me', { fields: 'id,first_name', access_token: accessToken }, async response => {
          const createdUserId = await AppUser.addUser({
            fbId: response.id,
            firstName: response.first_name
          });

          const token = jwt.sign(createdUserId, secret);
          return res.json({ jwt: token });
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
  const lookedUpUser = await AppUser.getUserById(req.decoded);
  res.json({
    userName: lookedUpUser.first_name
  });
});

app.get('/api/hangs', async (req, res) => {
  const hangs = await Hang.getAll(req.decoded);
  res.json(hangs);
});

app.post('/api/hangs', async (req, res) => {
  const newHang = await Hang.addHang(req.body.start, req.body.end, req.decoded);
  res.status(201).json(newHang);
});

app.listen(4201, () => {
  console.log('running on 4201 ...');
});
