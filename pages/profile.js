document.addEventListener("DOMContentLoaded", async () => {
    const myId = localStorage.getItem("userId");
    const myUsername = localStorage.getItem("username");
    const myEmail = localStorage.getItem("email");

    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('user');
    const isOwner = !targetUserId || targetUserId === myId;
    const userIdToLoad = isOwner ? myId : targetUserId;

    if (!userIdToLoad) { window.location.href = "login.html"; return; }

    const usernameElement = document.getElementById("display-username");
    const emailElement = document.getElementById("display-email");
    const blogsContainer = document.getElementById("blogsContainer");
    const ownerSection = document.getElementById("owner-only-section");
    const createBlogBtn = document.getElementById("createBlogBtn");

    if (isOwner) {
        if (ownerSection) ownerSection.style.display = "block";
        if (usernameElement) usernameElement.textContent = `Welcome, ${myUsername}`;
        if (emailElement) emailElement.textContent = myEmail;
    } else {
        if (createBlogBtn) createBlogBtn.style.display = "none";
        try {
            const res = await fetch(`http://localhost:3000/api/auth/user/${targetUserId}`);
            const data = await res.json();
            if (usernameElement) usernameElement.textContent = `${data.username}'s Profile`;
            if (emailElement) emailElement.textContent = data.email;
        } catch (err) { console.error(err); }
    }

    fetchUserBlogs(userIdToLoad, blogsContainer, isOwner);
});

async function fetchUserBlogs(userId, container, isOwner) {
    const res = await fetch(`http://localhost:3000/api/blogs/user/${userId}`);
    const blogs = await res.json();
    container.innerHTML = blogs.length === 0 ? "<p>No blogs yet.</p>" : "";

    blogs.forEach(blog => {
        const blogCard = document.createElement("div");
        blogCard.className = "blog-card";
        blogCard.style = "border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;";

        let actionButtons = isOwner ? `
            <div style="margin-top:10px;">
                <button onclick="window.location.href='texteditor.html?edit=${blog._id}'">Edit</button>
                <button onclick="deleteBlog('${blog._id}')" style="background:red; color:white;">Delete</button>
            </div>` : "";

        blogCard.innerHTML = `
            <div onclick="window.location.href='viewblog.html?id=${blog._id}'" style="cursor:pointer">
                <h3>${blog.title}</h3>
            </div>
            ${actionButtons}
        `;
        container.appendChild(blogCard);
    });
}

async function deleteBlog(blogId) {
    if (!confirm("Delete this blog?")) return;
    const res = await fetch(`http://localhost:3000/api/blogs/${blogId}`, { method: "DELETE" });
    if (res.ok) location.reload();
}

// SEARCH BAR LOGIC
const searchInput = document.getElementById("user-search-input");
const resultsDiv = document.getElementById("search-results");

searchInput?.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) { resultsDiv.style.display = "none"; return; }

    const res = await fetch(`http://localhost:3000/api/blogs/search/all?q=${query}`);
    const data = await res.json();
    resultsDiv.innerHTML = "";
    resultsDiv.style.display = "block";

    data.users.forEach(u => {
        const div = document.createElement("div");
        div.innerHTML = `👤 ${u.username}`;
        div.onclick = () => window.location.href = `profile.html?user=${u._id}`;
        resultsDiv.appendChild(div);
    });
    data.blogs.forEach(b => {
        const div = document.createElement("div");
        div.innerHTML = `📝 ${b.title}`;
        div.onclick = () => window.location.href = `viewblog.html?id=${b._id}`;
        resultsDiv.appendChild(div);
    });
});
function toggleDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    dropdown.classList.toggle("show");
    
    // Fill the data from localStorage when opened
    document.getElementById("menu-username").textContent = localStorage.getItem("username") || "Guest";
    document.getElementById("menu-email").textContent = localStorage.getItem("email") || "";
}

// Close the dropdown if the user clicks anywhere else on the screen
window.onclick = function(event) {
    if (!event.target.matches('#profile-trigger')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Logout function
function logoutUser() {
    localStorage.clear(); // Clears user ID, email, etc.
    window.location.href = "login.html";
}



