const postsContainer = document.getElementById('posts');
const postInput = document.getElementById('post-input');
const fileUpload = document.getElementById('file-upload');
const postButton = document.getElementById('post-button');

const apiEndpoint = 'http://localhost:3000/posts';

// Fetch and display posts
async function loadPosts() {
  const response = await fetch(apiEndpoint);
  const posts = await response.json();

  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <p>${post.text}</p>
      ${post.media ? `<img src="${post.media}" alt="Post Media">` : ''}
      <div class="post-actions">
        <button onclick="likePost(${post.id})">Like (${post.likes})</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Add a new post
postButton.addEventListener('click', async () => {
  const text = postInput.value;
  const file = fileUpload.files[0];

  if (!text && !file) return alert('Post content cannot be empty');

  const formData = new FormData();
  formData.append('text', text);
  if (file) formData.append('media', file);

  await fetch(apiEndpoint, {
    method: 'POST',
    body: formData,
  });

  postInput.value = '';
  fileUpload.value = '';
  loadPosts();
});

// Example function for liking a post
async function likePost(postId) {
  await fetch(`${apiEndpoint}/${postId}/like`, { method: 'POST' });
  loadPosts();
}

// Initial load
loadPosts();
