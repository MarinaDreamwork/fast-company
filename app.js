require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('config');
const cors = require('cors');
const path = require('path');
const initDatabase = require('./startUp/initDatabase');
const routes = require('./routes');
const PORT = process.env.PORT || 8080;

const app = express();

app.set('port', PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}));
app.use('/api', routes);

if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  const indexPath = path.join(__dirname, 'client', 'build', 'index.html');
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  console.log(chalk.bgCyan('development mode'));
};

async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase();
    });
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(PORT, () => {
      console.log(chalk.greenBright(`Server has been started on port: ${PORT}`));
    });
  } catch(error) {
    console.log(chalk.bgRed(error.message));
    process.exit(1);
  }

};

start();