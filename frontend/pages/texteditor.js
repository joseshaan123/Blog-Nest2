let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  //create options for font names
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  //fontSize allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  //default size
  fontSizeRef.value = 3;
};

//main logic
const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

//link
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  //if link has http then pass directly else add https
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;

        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        //Remove highlight from other buttons
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

window.onload = initializer();
document.addEventListener("DOMContentLoaded", async () => {
    const paramUrl = new URLSearchParams(window.location.search);
    const editId = paramUrl.get("edit");
    
    if (editId) {
        document.getElementById("submit").textContent = "Update Blog";
        const res = await fetch(`http://localhost:3000/api/blogs/${editId}`);
        const blog = await res.json();
        document.getElementById("heading-input").textContent = blog.title;
        document.getElementById("text-input").innerHTML = blog.content;
    }
});

async function submitBlog() {
    const paramUrl = new URLSearchParams(window.location.search);
    const editId = paramUrl.get("edit");

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

const popup = document.getElementById("popupMenu");
    const resultBox = document.getElementById("resultBox");

    document.addEventListener("mouseup", function () {
        let selection = window.getSelection();
        let text = selection.toString().trim();

        if (text.length > 0) {
            let range = selection.getRangeAt(0);
            let rect = range.getBoundingClientRect();

            popup.style.left = rect.left + window.scrollX + "px";
            popup.style.top = rect.top + window.scrollY - 40 + "px";

            popup.style.display = "block";
        } else {
            popup.style.display = "none";
        }
    });

    async function callGemini(promptText) {
    try {
        const response = await fetch("http://localhost:3000/api/auth/ask-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promptText: promptText })
        });

        const data = await response.json();
        
        // If the backend sent an 'output', use it; otherwise show the error
        return data.output || "Error: " + (data.error || "Unknown error");
    } catch (e) {
        console.error("Frontend Fetch Error:", e);
        return "Connection failed. Is the server running?";
    }
}

// Your button logic remains the same!
document.getElementById("fixGrammarBtn").onclick = async function () {
    let selected = window.getSelection().toString();
    if (!selected) return alert("Please select some text first!");
    
    popup.style.display = "none";
    resultBox.style.display = "block";
    resultBox.innerHTML = "Working on grammar...";

    let output = await callGemini("Fix the grammar of this sentence only: " + selected);
    resultBox.innerHTML = "<b>Grammar Fixed:</b><br><br>" + output;
};

document.getElementById("rephraseBtn").onclick = async function () {
    let selected = window.getSelection().toString();
    if (!selected) return alert("Please select some text first!");

    popup.style.display = "none";
    resultBox.style.display = "block";
    resultBox.innerHTML = "Rephrasing...";

    let output = await callGemini("Rephrase this sentence in a clean and natural way: " + selected);
    resultBox.innerHTML = "<b>Rephrased Sentence:</b><br><br>" + output;
};
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

  function showSidebar(){
      const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='flex'
    }

    function hideSidebar(){
       const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='none' 
    }

  const addPhotoBtn = document.getElementById('add-photo-btn');
const fileInput = document.getElementById('hidden-file-input');

// 1. Trigger the file picker when the button is clicked
addPhotoBtn.addEventListener('click', () => {
    fileInput.click(); 
});

// 2. Handle the upload automatically when a file is selected
fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Show a "Loading..." state on the button
    addPhotoBtn.innerText = "Uploading...";

    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
        const response = await fetch(`http://localhost:3000/api/auth/update/${userId}`, {
            method: "PUT",
            // Note: No 'Content-Type' header needed for FormData
            body: formData
        });

       

  if (response.ok) {
            const result = await response.json();
            
            // Check what the result actually contains
            console.log("Server Response:", result);

            const profileImg = document.getElementById("profile-trigger");
            if (profileImg && result.profilePic) {
                // We MUST add the base URL (http://localhost:3000) 
                // because the result is just a string like "/uploads/img.jpg"
                profileImg.src = `http://localhost:3000${result.profilePic}`;
                
                // Save to localStorage so it stays there when you refresh
                localStorage.setItem("userProfilePic", result.profilePic);
            }
            
            alert("Profile picture updated!");
        } // Closing the if (response.ok)
    } catch (err) {
        console.error("Upload error:", err);
        alert("Something went wrong with the upload.");
    } finally {
        addPhotoBtn.innerText = "Add Profile Picture";
    }
});
function toggleDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    dropdown.classList.toggle("show");
    
    // Fill the data from localStorage when opened
    
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
    window.location.href = "signin.html";
}

// Inside profile.js
async function loadProfile() {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`);
    
    // 1. You must define 'result' (or 'user') here!
    const result = await response.json(); 

    if (response.ok) {
        const nameElement = document.getElementById('menu-username');
        if (nameElement) {
            // 2. Now 'result' exists, so this won't crash
            nameElement.textContent = result.username; 
        }
    }
}