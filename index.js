const express = require('express');
const knex = require('knex');
const cors = require('cors');
const dbConfig = require('./knexfile')

const server = express();
const db = knex(dbConfig.development);
const PORT = process.env.PORT || 5566;


server.use(cors());
server.use(express.json());

server.get('https://cryptic-brook-42672.herokuapp.com/', (req, res) => {
    res.send(`Welcome in the og repo! \o/`)
})

server.post('https://cryptic-brook-42672.herokuapp.com/notes', (req, res) => {
    const note = req.body;
    db('notes2').insert(note)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json({err});
    });
  });

server.get('https://cryptic-brook-42672.herokuapp.com/notes', (req, res) => {
    db('notes2')
    .then(rows => res.json(rows))
    .catch(err => {res.status(500).json({message: `Unable to find notes`})})
});

server.get('/notes/:id', (req, res) => {
    const {id} = req.params;
    db('notes2').where('id', id)
    .then(rows => {
        res.json(rows)
    }).catch(err => {
        res.status(500).json({message: `Unable to find that note`})
    })
});

server.put('https://cryptic-brook-42672.herokuapp.com/notes/:id', (req, res) => {
    const note = req.body;
    const {id} = req.params;

    db('notes2').where('id', id)
    .then(rowCount => {
        res.json(rowCount)
    }).catch(err => {
        res.status(500).json({message: `Unable to put that note`})
    })
});

server.delete('https://cryptic-brook-42672.herokuapp.com/notes/:id', (req, res) => {
    const {id} = req.params;
    db('notes2').where('id', id).truncate()
    .then(rowCount => {
        const success = `Successfully deleted note with id ${id}`
        res.status(201).json(success)
    }).catch(err => {
        res.status(500).json({err: 'Failed to delete note'})
    })
});

server.listen(process.env.PORT , () => {
    console.log(`Server is alive, alert, and enthusiastic on port ${PORT}`)
})