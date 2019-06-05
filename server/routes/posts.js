const express = require('express'),
  router = express.Router(),
  multer = require('multer'),
  auth = require('../middleware/auth'),
  PostController = require('../controllers/posts');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'server/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    callback(null, name + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});

router.post(
  '',
  auth,
  multer({ storage }).single('image'),
  PostController.addPost
);

router.get('', PostController.getAllPosts);

router.get('/:id', PostController.getPost);

router.delete('/delete/:id', auth, PostController.deletePost);

router.put(
  '/:id',
  auth,
  multer({ storage }).single('image'),
  PostController.editPost
);

module.exports = router;
