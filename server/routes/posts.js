const express = require('express'),
  router = express.Router(),
  Post = require('../models/post');

router.post('', (req, res, next) => {
  const post = new Post({ title: req.body.title, content: req.body.content });
  post.save().then(newPost => {
    res
      .status(201)
      .json({ message: 'Post addedd successfully', postId: newPost._id });
  });
});

router.get('', async (req, res) => {
  const posts = await Post.find();
  res
    .status(200)
    .json({ message: 'Posts retreived successfully', posts: posts });
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById({ _id: req.params.id });
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  console.log(req.params.id);
  await Post.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Post deleted successfully' });
});

router.put('/:id', async (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  console.log(post._id);
  console.log(post);
  try {
    await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

module.exports = router;
