document.addEventListener("DOMContentLoaded", () => {

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    const postForm = document.getElementById("postForm");
    const adminPosts = document.getElementById("adminPosts");

    // Add a post
    postForm.addEventListener("submit", function(e){
        e.preventDefault();

        const parentEmail = document.getElementById("parentEmail").value.trim();
        const childId = document.getElementById("childId").value.trim();
        const postType = document.getElementById("postType").value;
        const title = document.getElementById("postTitle").value.trim();
        const desc = document.getElementById("postDesc").value.trim();
        const fileInput = document.getElementById("postFile");

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const parent = users.find(u => u.email === parentEmail && u.role === "parent");

        if(!parent){
            alert("Parent not found!");
            return;
        }

        const post = {
            childId,
            title,
            desc,
            timestamp: Date.now()
        };

        const file = fileInput.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(){
                post.file = reader.result;
                post.fileName = file.name;
                savePost(parentEmail, postType, post);
            };
            reader.readAsDataURL(file);
        } else {
            savePost(parentEmail, postType, post);
        }
    });

    function savePost(parentEmail, postType, post){
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const parent = users.find(u => u.email === parentEmail);
        if(!parent[postType]) parent[postType] = [];
        parent[postType].push(post);

        const index = users.findIndex(u => u.email === parentEmail);
        users[index] = parent;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Post added successfully!");
        postForm.reset();
        renderPosts();
    }

    // Render all posts for admin
    function renderPosts(){
        adminPosts.innerHTML = "";
        let users = JSON.parse(localStorage.getItem("users")) || [];

        users.forEach(parent => {
            ["reports","letters","meetings","performance"].forEach(type => {
                if(parent[type]){
                    parent[type].forEach((post, index) => {
                        const postDiv = document.createElement("div");
                        postDiv.classList.add("card");

                        const postTime = new Date(post.timestamp);

                        // SHOW delete button immediately for testing
                        const canDelete = true;

                        postDiv.innerHTML = `
                            <h4>${post.title} (Child ID: ${post.childId})</h4>
                            <p>${post.desc}</p>
                            <p>Posted on: ${postTime.toLocaleString()}</p>
                            <a href="#" onclick='downloadItem("${post.title}", "${post.desc}", "${post.file || ""}", "${post.fileName || ""}")'>Download</a>
                            ${canDelete ? `<button onclick="deletePost('${parent.email}','${type}', ${index})">Delete</button>` : ""}
                        `;
                        adminPosts.appendChild(postDiv);
                    });
                }
            });
        });
    }

    // Delete post
    window.deletePost = function(parentEmail, type, index){
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const parent = users.find(u => u.email === parentEmail);
        if(parent && parent[type]){
            parent[type].splice(index, 1);
            const idx = users.findIndex(u => u.email === parentEmail);
            users[idx] = parent;
            localStorage.setItem("users", JSON.stringify(users));
            renderPosts();
        }
    }

    // Download function
    window.downloadItem = function(title, desc, file, fileName){
        if(file){
            const link = document.createElement("a");
            link.href = file;
            link.download = fileName;
            link.click();
        } else {
            const blob = new Blob([title + "\n\n" + desc], { type: "text/plain;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = title + ".txt";
            link.click();
        }
    }

    renderPosts();
});