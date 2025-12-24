document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");
    
    if (editId) {
        document.getElementById("submit").textContent = "Update Blog";
        const res = await fetch(`http://localhost:3000/api/blogs/${editId}`);
        const blog = await res.json();
        document.getElementById("heading-input").textContent = blog.title;
        document.getElementById("text-input").innerHTML = blog.content;
    }
});

async function submitBlog() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");

    const blogData = {
        title: document.getElementById("heading-input").textContent.trim(),
        content: document.getElementById("text-input").innerHTML.trim(),
        userId: localStorage.getItem("userId"),
        username: localStorage.getItem("username")
    };

    const url = editId ? `http://localhost:3000/api/blogs/${editId}` : `http://localhost:3000/api/blogs/create`;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
    });

    if (response.ok) {
        alert("Success!");
        window.location.href = "profile.html";
    }
}