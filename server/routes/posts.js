const express = require('express'),
  router = express.Router(),
  Post = require('../models/post'),
  multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (!isValid) {
      return new Error('Invalid file type');
    }
    callback(null, 'server/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now().t + '.' + ext);
  }
});

router.post('', multer({ storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(newPost => {
    res.status(201).json({
      message: 'Posts saved successfully',
      post: { ...newPost, id: newPost._id }
    });
  });
});

router.get('', async (req, res) => {
  try {
    const pageSize = +req.query.pageSize,
      currentPage = +req.query.currentPage;
    let fetchedPosts;
    let maxPostCount;
    if (pageSize && currentPage) {
      fetchedPosts = await Post.find()
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
      maxPostCount = await Post.countDocuments();
    }
    res.status(200).json({
      message: 'Posts retreived successfully',
      posts: fetchedPosts,
      maxPostCount
    });
  } catch (error) {
    res.status(400).json({
      message: "Posts couldn'currentPaget be retreived",
      error: error
    });
  }
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
  await Post.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Post deleted successfully' });
});

router.put('/:id', multer({ storage }).single('image'), async (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  });
  try {
    await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

module.exports = router;
