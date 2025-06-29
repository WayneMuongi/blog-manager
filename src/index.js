
function renderOnePost(post) {
    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-secondary p-2 m-2';
    listItem.className = "card mb-3 p-2 m-2";
    listItem.style.cursor = 'pointer';
    const ul= document.querySelector('ul');
    const postlog= document.getElementById('Postlogs');
    postlog.className = "container";
    const p = document.createElement('p');
    p.className = "text-center";
    p.style.cursor = 'pointer';
    p.addEventListener('click', function(e) {
        const ul = document.querySelector('ul');
        ul.innerHTML = ''; // Clear the list before displaying the clicked post
        listItem.innerHTML = ''; // Clear the list item content
        if (e.target.tagName === 'P') {
            ul.appendChild(listItem);
           listItem.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p>Author: ${post.author.name}</p>
        <img src="${post.image}" alt="${post.title}" >
        <button id="deleteButton"class="btn btn-danger p-2 m-2" onclick="deletePost(${post.id})">Delete</button>
    `;
        }else {
            p.innerHTML = `${post.title}`;
        }
        e.stopPropagation();
        // const deleteButton= getElementById('deleteButton');
        // console.log(deleteButton);
        // // deleteButton.addEventListener('click', function() {
        // //     // listItem.remove();
        // //     // deletePost(post.id);
        // //     alert('Are you sure you want to delete this post?');
        // //     });
    });
    p.textContent = `${post.title}`;
    postlog.appendChild(p);


    // document.querySelector('ul').appendChild(listItem);


}

function deletePost(id) {
    fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => alert('Error deleting post: ' + error))
}
function getPosts(){
    fetch('http://localhost:3000/posts')
    .then(response => response.json())
    .then(posts => posts.forEach(element => renderOnePost(element)))
    .catch(error => alert('Error fetching posts: ' + error))

}
getPosts();
document.querySelector('#post-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addPost();


});

function addPost() {
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            title: document.querySelector('#title').value,
            content: document.querySelector('#content').value,
            image: document.querySelector('#image').value,
            author: {
            name: document.querySelector('#author').value
            }
        })
    })
    .then(response => response.json())
        .then(post => {
            renderOnePost(post);
            document.querySelector('#post-form').reset();
        });

                }
document.getElementById("add-post-btn").addEventListener("click", function(event) {
    event.preventDefault();
    const postForm = document.querySelector('#post-form');
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    if (postForm.style.display === 'block') {
        postForm.scrollIntoView({ behavior: 'smooth' });
    }
});