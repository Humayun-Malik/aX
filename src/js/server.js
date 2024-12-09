const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let posts = [];
let postId = 1;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload setup
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));

// Get all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Add a new post
app.post('/posts', upload.single('media'), (req, res) => {
  const { text } = req.body;
  const media = req.file ? `/uploads/${req.file.filename}` : null;

  posts.push({
    id: postId++,
    text,
    media,
    likes: 0,
  });

  res.sendStatus(201);
});

// Like a post
app.post('/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.likes += 1;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
