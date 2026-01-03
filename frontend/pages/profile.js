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
    
    const blogsContainer = document.getElementById("blogsContainer");
    const ownerSection = document.getElementById("owner-only-section");
    const createBlogBtn = document.getElementById("blog-create");

    if (isOwner) {
        if (ownerSection) ownerSection.style.display = "block";
        if (usernameElement) usernameElement.textContent = `${myUsername}`;
       
    } else {
        if (createBlogBtn) createBlogBtn.style.display = "none";
        try {
            const res = await fetch(`http://localhost:3000/api/auth/user/${targetUserId}`);
            const data = await res.json();
            if (usernameElement) usernameElement.textContent = `${data.username}'s Profile`;
            
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
        

        let actionButtons = isOwner ? `
            <div class="action-button">
                <button onclick="window.location.href='texteditor.html?edit=${blog._id}'"  id=edit>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg></button>
                <button onclick="deleteBlog('${blog._id}')" id=delete>
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg></button>
            </div>` : "";

        blogCard.innerHTML = `
            <div class="title" onclick="window.location.href='viewblog.html?id=${blog._id}'" style="cursor:pointer">
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

// Inside profile.js
async function loadProfile() {
    const userId = localStorage.getItem("userId");
    
    const res = await fetch(`http://localhost:3000/api/auth/user/${userId}`);
    const user = await res.json();
    
    if(res.ok) {
        // This updates the actual text on your profile page
        document.getElementById("display-username").textContent = user.username;
        document.getElementById("display-fullname").textContent = user.fullName;
    }
}
loadProfile();

  function showSidebar(){
      const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='flex'
    }

    function hideSidebar(){
       const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='none' 
    }

