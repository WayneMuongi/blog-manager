// Simulated db.json data (fallback if file loading fails)
let db = {
    posts: [
        { id: 1, title: "Sample Post", content: "This is a test post.", image: "https://via.placeholder.com/150", author: { name: "John Doe" } }
    ]
};

// Load db.json from file (if served via static server)
async function loadDb() {
    try {
        const response = await fetch('./db.json');
        if (response.ok) {
            db = await response.json();
        }
    } catch (error) {
        console.warn('Using hardcoded db.json:', error);
    }
}

function renderOnePost(post) {
    const listItem = document.createElement('li');
    listItem.className = 'card mb-3 p-2 m-2';
    listItem.style.cursor = 'pointer';

    // Create post content
    listItem.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p>Author: ${post.author.name}</p>
        <img src="${post.image}" alt="${post.title}" style="max-width: 100%;">
        <button class="btn btn-danger p-2 m-2">Delete</button>
    `;

    // Add delete button event listener
    const deleteButton = listItem.querySelector('button');
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id, listItem);
        }
    });

    // Toggle post details on click (optional)
    listItem.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            listItem.classList.toggle('expanded');
            // Add CSS for .expanded to show/hide details if desired
        }
        e.stopPropagation();
    });

    // Append to <ul>
    document.querySelector('ul').appendChild(listItem);
}

async function deletePost(id, listItem) {
    try {
        // Simulate DELETE by filtering out the post
        db.posts = db.posts.filter(post => post.id !== id);
        listItem.remove(); // Update UI
    } catch (error) {
        alert('Error deleting post: ' + error);
    }
}

async function getPosts() {
    try {
        // Load posts from in-memory db
        document.querySelector('ul').innerHTML = ''; // Clear existing posts
        db.posts.forEach(post => renderOnePost(post));
    } catch (error) {
        alert('Error fetching posts: ' + error);
    }
}

async function addPost() {
    try {
        const postData = {
            id: db.posts.length ? Math.max(...db.posts.map(p => p.id)) + 1 : 1, // Generate new ID
            title: document.querySelector('#title').value,
            content: document.querySelector('#content').value,
            image: document.querySelector('#image').value,
            author: { name: document.querySelector('#author').value }
        };

        // Simulate POST by adding to in-memory db
        db.posts.push(postData);
        renderOnePost(postData);
        document.querySelector('#post-form').reset();
    } catch (error) {
        alert('Error adding post: ' + error);
    }
}

// Event Listeners
document.querySelector('#post-form').addEventListener('submit', (event) => {
    event.preventDefault();
    addPost();
});

document.getElementById('add-post-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const postForm = document.querySelector('#post-form');
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    if (postForm.style.display === 'block') {
        postForm.scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize
(async () => {
    await loadDb(); // Try to load db.json
    await getPosts(); // Render initial posts
})();