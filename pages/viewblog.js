document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const titleEl = document.getElementById("blog-title");
    const contentEl = document.getElementById("blog-content");
    const authorEl = document.getElementById("blog-author");

    if (!blogId) {
        document.body.innerHTML = "<h1>No Blog ID provided in URL</h1>";
        return;
    }

    try {
        // Must match the prefix in server.js (/api/blogs)
        const res = await fetch(`http://localhost:3000/api/blogs/${blogId}`);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Server Error");
        }

        const blog = await res.json();

        // Fill the page with data
        if (titleEl) titleEl.textContent = blog.title;
        if (authorEl) authorEl.textContent = blog.username || "Anonymous";
        if (contentEl) contentEl.innerHTML = blog.content;

    } catch (err) {
        console.error("Fetch error:", err);
        if (contentEl) contentEl.innerHTML = `<h2 style="color:red;">${err.message}</h2>`;
    }
});