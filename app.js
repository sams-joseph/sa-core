const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');

const db = require('./models');
const dotenv = require('dotenv');
const cors = require('cors');

const config = require('./config');
const auth = require('./routes/auth');
const users = require('./routes/users');
const products = require('./routes/products');
const sizes = require('./routes/sizes');
const designs = require('./routes/designs');
const designSizes = require('./routes/design_sizes');
const orders = require('./routes/orders');
const uploads = require('./routes/uploads');
const csrs = require('./routes/csr');
const roles = require('./routes/roles');
const search = require('./routes/search');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cors({ origin: true, credentials: true }));
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/sizes', sizes);
app.use('/api/designs', designs);
app.use('/api/design-sizes', designSizes);
app.use('/api/orders', orders);
app.use('/api/uploads', uploads);
app.use('/api/csrs', csrs);
app.use('/api/roles', roles);
app.use('/api/search', search);

app.use('/static', express.static('public'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

db.sequelize.sync().then(() => {
  const server = app.listen(config.PORT || config.BACKEND_PORT, () => {
    console.log(`Running on port ${server.address().port}...`);
  });

  /**
   * Wait for connections to end, then shut down
   * */
  function gracefulShutdown() {
    console.log('Received kill signal, shutting down gracefully.');
    server.close(() => {
      console.log('Closed out remaining connections.');
      process.exit();
    });
    // if after
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit();
    }, 10 * 1000);
  }
  // listen for TERM signal .e.g. kill
  process.once('SIGTERM', gracefulShutdown);
  // listen for INT signal e.g. Ctrl-C
  process.once('SIGINT', gracefulShutdown);
});
module.exports = app;
