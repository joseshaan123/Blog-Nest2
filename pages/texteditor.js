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
        const apiKey = "AIzaSyDB2O692lk8UP2Mr7Iz_UajX0zBF13VZP4";  // <-- Replace with your Gemini 2.5 API key

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: promptText }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        
        try {
            return data?.candidates[0]?.content?.parts[0]?.text || "No response.";
        } catch (e) {
            return "Error: " + JSON.stringify(data);
        }
    }

    document.getElementById("fixGrammarBtn").onclick = async function () {
        let selected = window.getSelection().toString();
        popup.style.display = "none";

        resultBox.style.display = "block";
        resultBox.innerHTML = "Working on grammar…";

        let output = await callGemini("Fix the grammar of this sentence only: " + selected);
        resultBox.innerHTML = "<b>Grammar Fixed:</b><br><br>" + output;
    };

    document.getElementById("rephraseBtn").onclick = async function () {
        let selected = window.getSelection().toString();
        popup.style.display = "none";

        resultBox.style.display = "block";
        resultBox.innerHTML = "Rephrasing…";

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