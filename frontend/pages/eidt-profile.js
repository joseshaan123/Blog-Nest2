document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    console.log("Logged in User ID:", userId);

    if (!userId) {
        alert("No User ID found. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    // --- 1. FETCH AND FILL DATA ---
    try {
        const res = await fetch(`http://localhost:3000/api/auth/user/${userId}`);
        if (!res.ok) throw new Error("Could not find user in database");
        
        const user = await res.json();
        console.log("User data loaded:", user);

        // This puts the DB info into your boxes
        document.getElementById("full-name").value = user.fullName || "";
        document.getElementById("sign-up-email").value = user.email || "";
        document.getElementById("user-name").value = user.username || "";
        if (user.dob) {
            document.getElementById("dob").value = user.dob.split('T')[0];
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Failed to load your details: " + err.message);
    }

    // --- 2. SUBMIT AND REDIRECT ---
    const form = document.getElementById("editProfileForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Update button clicked!");

        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("confirm-signup-password").value;

        if (password && password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        const updatedData = {
            fullName: document.getElementById("full-name").value,
            email: document.getElementById("sign-up-email").value,
            username: document.getElementById("user-name").value,
            dob: document.getElementById("dob").value
        };

        if (password) updatedData.password = password;

        try {
            const response = await fetch(`http://localhost:3000/api/auth/update/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                // Update LocalStorage so the UI reflects the change
                localStorage.setItem("username", updatedData.username);
                
                alert("Update Successful! Redirecting now...");
                window.location.href = "profile.html"; // The Redirect
            } else {
                const errorResult = await response.json();
                alert("Update failed: " + errorResult.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    });
});