const request = require('request');
const http = require('http');

const PORT = 3000;

function render(req, res) {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<a href="/update">обновить картинку</a>');
    res.write('<p><a href="/dogs">Достать 30 собак</a></p>');
    res.end();
  } else if (req.url === '/update') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    request('https://dog.ceo/api/breeds/image/random', (e, r, body) => {
      const image = JSON.parse(body);
      res.write('<a href="/update">обновить картинку</a>');
      res.write(`<p><img src="${image.message}" /></p>`);
      res.end();
    });
  } else if (req.url === '/dogs') {
    const LIMIT = 30;
    let allDogs = [];
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    for (let i = 0; i < LIMIT; i++) {
      const start = Date.now();

      request('https://dog.ceo/api/breeds/image/random', (e, r, body) => {
        const image = JSON.parse(body);
        const download_time = Date.now() - start;
        const breed = image.message
          .split('https://images.dog.ceo/breeds/')[1]
          .split('/')[0];

        allDogs.push({
          url: image.message,
          breed,
          download_time
        });

        if (allDogs.length === LIMIT) {
          console.log('end', allDogs);
          res.end();
        }
      });
    }
  }
}

const server = http.createServer((req, res) => {
  render(req, res);
});

server.listen(PORT, () => console.log('Server started'));
