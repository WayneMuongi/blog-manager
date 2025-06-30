let db = {
    posts: [
        { id: 1, title: "Sample Post", content: "This is a test post.", image: "https://via.placeholder.com/150", author: "John Doe" }
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

    // Use post.author directly (string, not object)
    listItem.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p>Author: ${post.author}</p>
        <img src="${post.image}" alt="${post.title}" style="max-width: 100%;">
        <button class="btn btn-primary p-2 m-2 edit-btn">Edit</button>
        <button class="btn btn-danger p-2 m-2 delete-btn">Delete</button>
    `;

    // Edit button event listener
    const editButton = listItem.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
        populateEditForm(post, listItem);
    });

    // Delete button event listener
    const deleteButton = listItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id, listItem);
        }
    });

    // Toggle post details on click (optional)
    listItem.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            listItem.classList.toggle('expanded');
        }
        e.stopPropagation();
    });

    // Append to <ul>
    document.querySelector('ul').appendChild(listItem);
}

function populateEditForm(post, listItem) {
    const form = document.querySelector('#post-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Populate form with post data
    document.querySelector('#title').value = post.title;
    document.querySelector('#content').value = post.content;
    document.querySelector('#image').value = post.image;
    document.querySelector('#author').value = post.author;

    // Change form to edit mode
    submitButton.textContent = 'Update Post';
    form.dataset.editId = post.id; // Store post ID for update
    form.dataset.listItem = listItem; // Store listItem for UI update
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

async function deletePost(id, listItem) {
    try {
        db.posts = db.posts.filter(post => post.id !== id);
        listItem.remove();
    } catch (error) {
        alert('Error deleting post: ' + error);
    }
}

async function getPosts() {
    try {
        document.querySelector('ul').innerHTML = '';
        db.posts.forEach(post => renderOnePost(post));
    } catch (error) {
        alert('Error fetching posts: ' + error);
    }
}

async function addPost(event) {
    const form = event.target;
    const isEdit = form.dataset.editId;
    const listItem = form.dataset.listItem ? document.querySelector(`li:nth-child(${form.dataset.listItem})`) : null;

    try {
        const postData = {
            id: isEdit ? parseInt(isEdit) : (db.posts.length ? Math.max(...db.posts.map(p => p.id)) + 1 : 1),
            title: document.querySelector('#title').value,
            content: document.querySelector('#content').value,
            image: document.querySelector('#image').value,
            author: document.querySelector('#author').value
        };

        if (isEdit) {
            // Update existing post
            const index = db.posts.findIndex(p => p.id === parseInt(isEdit));
            if (index !== -1) {
                db.posts[index] = postData;
                if (listItem) {
                    listItem.innerHTML = `
                        <h1>${postData.title}</h1>
                        <p>${postData.content}</p>
                        <p>Author: ${postData.author}</p>
                        <img src="${postData.image}" alt="${postData.title}" style="max-width: 100%;">
                        <button class="btn btn-primary p-2 m-2 edit-btn">Edit</button>
                        <button class="btn btn-danger p-2 m-2 delete-btn">Delete</button>
                    `;
                    // Re-attach event listeners
                    listItem.querySelector('.edit-btn').addEventListener('click', () => populateEditForm(postData, listItem));
                    listItem.querySelector('.delete-btn').addEventListener('click', () => {
                        if (confirm('Are you sure you want to delete this post?')) {
                            deletePost(postData.id, listItem);
                        }
                    });
                }
            }
        } else {
            // Add new post
            db.posts.push(postData);
            renderOnePost(postData);
        }

        // Reset form
        form.reset();
        form.style.display = 'none';
        form.querySelector('button[type="submit"]').textContent = 'Submit';
        delete form.dataset.editId;
        delete form.dataset.listItem;
    } catch (error) {
        alert('Error saving post: ' + error);
    }
}

// Event Listeners
document.querySelector('#post-form').addEventListener('submit', (event) => {
    event.preventDefault();
    addPost(event);
});

document.getElementById('add-post-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const form = document.querySelector('#post-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
        form.querySelector('button[type="submit"]').textContent = 'Submit';
        form.reset();
        delete form.dataset.editId;
        form.scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize
(async () => {
    await loadDb();
    await getPosts();
})();