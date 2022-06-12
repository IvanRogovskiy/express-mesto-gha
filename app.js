const http = require('http');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('<p>I am started up haha kek lol</p>');
});

server.listen(PORT);
