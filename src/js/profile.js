document.addEventListener("DOMContentLoaded", async () => {
    const userData = await fetch('../data/users.json').then((res) => res.json());
    const postsData = await fetch('../data/posts.json').then((res) => res.json());
  
    // Populate user information
    document.getElementById("user-name").textContent = userData.name;
    document.getElementById("user-bio").textContent = userData.bio;
    document.getElementById("user-location").textContent = `📍 ${userData.location}`;
    document.getElementById("post-count").textContent = postsData.length;
    document.getElementById("follower-count").textContent = userData.followers;
    document.getElementById("following-count").textContent = userData.following;
  
    // Render user posts
    const postsContainer = document.getElementById("posts-container");
    postsData.forEach(post => {
      const postElement = document.createElement("div");
      postElement.className = "post";
  
      if (post.type === "image") {
        const img = document.createElement("img");
        img.src = post.content;
        postElement.appendChild(img);
      } else {
        const text = document.createElement("p");
        text.textContent = post.content;
        postElement.appendChild(text);
      }
  
      postsContainer.appendChild(postElement);
    });
  
    // Follow button
    const followBtn = document.getElementById("follow-btn");
    followBtn.addEventListener("click", () => {
      if (followBtn.textContent === "Follow") {
        followBtn.textContent = "Unfollow";
      } else {
        followBtn.textContent = "Follow";
      }
    });
  });
  