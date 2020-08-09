const express = require('express');

const router = express.Router();
const datab = require('../data/db');

//GET endpoints

router.get('/', (req, res) => {
  datab
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});
router.get('/:id', (req, res) => {
  datab
    .findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

router.get('/:id/comments', (req, res) => {
  datab
    .findPostComments(req.params.id)
    .then(coms => {
      if (coms) {
        res.status(200).json(coms);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

//POST endpoints

router.post('/', (req, res) => {
  try {
    if (!req.body.title || !req.body.contents) {
      req.status(400).json({
        errorMessage: 'Please provide title and contents for the post.',
      });
    } else {
      datab.insert(req.body);
      req.status(201).end();
    }
  } catch {
    res.status(500).json({
      error: 'There was an error while saving the post to the database',
    });
  }
});

router.post('/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const comment = { ...req.body, post_id: id };
    const post = datab.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    } else if (!req.body.text) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    } else {
      datab.insertComment(comment).then(res.status(201).json(comment));
    }
  } catch {
    res.status(500).json({
      error: 'There was an error while saving the comment to the database',
    });
  }
});

// Delete endpoints

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params.id;
    if ((posts.id = { id })) {
      datab.remove({ id });
      res.status(200).json({ message: 'post deleted' });
    } else {
      res.status(404).json({ message: "that post doesn't exist" });
    }
  } catch {
    res.status(500).json({
      error: 'the post could not be removed',
    });
  }
});

// put endpoints
router.put('/:id', (req, res) => {
  const mypost = datab.findById(req.params.id);

  try {
    if (!mypost) {
      res.status(404).json({ message: 'that post does not exsist' });
    } else if (!req.body.title || !req.body.contents) {
      res.status(400).json({ message: 'Please provide title and content' });
    } else {
      datab.update(req.params.id, { ...req.body });
      res.status(200).json(req.body);
    }
  } catch {
    res.status(500).json({ message: 'error updating post' });
  }
});

module.exports = router;
