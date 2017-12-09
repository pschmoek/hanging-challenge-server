const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const FB = require('fb');
const app = express();
const helmet = require('helmet');

const SECRET = process.env.SECRET || 'hanging-challenge-test-secret';
const AppUser = require('./model/app-user');
const Hang = require('./model/hang');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(bearerToken());

app.use(morgan('tiny'));

app.post('/auth', async (req, res) => {
  const accessToken = req.body.fbAccessToken;
  if (!accessToken) {
    return res.status(400).send('No facebook token provided.');
  }

  FB.api('/me', { fields: 'id,first_name', access_token: accessToken }, async response => {
    if (!response.id) {
      return res.sendStatus(401);
    }

    const lookedUpUser = await AppUser.getUser(response.id);
    if (lookedUpUser && lookedUpUser.id) {
      const token = jwt.sign(lookedUpUser.id, SECRET);
      return res.json({ jwt: token });
    }

    const newUser = { fbId: response.id, firstName: response.first_name };
    const createdUserId = await AppUser.addUser(newUser);
    const token = jwt.sign(createdUserId, SECRET);

    return res.json({ jwt: token });
  });
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

app.get('/hangs', async (req, res) => {
  const hangs = await Hang.getAll(req.decoded);
  res.json(hangs);
});

app.get('/hangs/:date', async (req, res) => {
  const hangs = await Hang.getByDate(req.decoded, req.params.date);
  res.json(hangs);
});

app.post('/hangs', async (req, res) => {
  if (Array.isArray(req.body.hangs)) {
    const savePromises = req.body.hangs.map(h => Hang.addHang(h.start, h.end, req.decoded));
    const newHangs = await Promise.all(savePromises);

    return res.status(201).json(newHangs);
  }

  res.sendStatus(400);
});

app.listen(PORT, () => {
  console.info('running on ' + PORT);
});
