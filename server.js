const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const recipes = require('./util/seed');

app.prepare()
.then(() => {
  const server = express()

  // Fake Api Routes
  // TODO: make them real and move into a separate file
  server.get('/api/recipes', (req, res) => {
    res.json({
      'title': `Ma's Awesome Sauce`,
      'description': 'A totally awesome sauce made by my ma.'
    });
  })

  // super dumb route just to test working with a recipe
  server.get('/api/recipes/:id', (req, res) => {
    // const recipes = require('./util/seed.js');

    res.json(recipes[req.params.id]);
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
