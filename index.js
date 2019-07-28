const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const app = express();
const helmet = require('helmet');

const SECRET = process.env.SECRET || 'hanging-challenge-test-secret';
const AppUser = require('./model/app-user');
const Hang = require('./model/hang');
const HangSession = require('./model/hang-session');
const Facebook = require('./model/facebook');
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bearerToken());

app.post('/auth', async (req, res) => {
  if (!req.body.fbAccessToken) {
    return res.status(400).send('No facebook token provided.');
  }

  try {
    const facebookUser = await Facebook.getUserInfo(req.body.fbAccessToken);
    const lookedUpUser = await AppUser.getUserByFacebookId(facebookUser.facebookId);
    if (lookedUpUser && lookedUpUser.id) {
      res.json({ jwt: jwt.sign(lookedUpUser.id, SECRET) });
    } else {
      const createdUserId = await AppUser.createUser(facebookUser);
      res.json({ jwt: jwt.sign(createdUserId, SECRET) });
    }
  } catch(e) {
    console.error(e);
    res.sendStatus(401);
  }
});

app.use((req, res, next) => {
  if (!req.token) {
    return res.sendStatus(401);
  }

  jwt.verify(req.token, SECRET, function(err, decoded) {      
    if (err) {
      return res.sendStatus(401);
    }

    req.decoded = decoded;    
    next();
  });
});

app.get('/user', async (req, res) => {
  const lookedUpUser = await AppUser.getUserById(req.decoded);
  res.json({
    userName: lookedUpUser.first_name
  });
});

app.get('/hang-sessions', async (req, res) => {
  try {
    const sessions = await HangSession.getSessions(req.decoded, req.query.date);
    res.json(sessions);
  } catch(error) {
    res.status(500).send(error);
  }
});

app.post('/hang-sessions', async (req, res) => {
  try {
    const newSession = await HangSession.addSession(req.decoded, req.body);
    res.status(201).send(newSession);
  } catch(error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.info('running on ' + PORT);
});
