const files = [];
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-post");
    form.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            if (e.submitter.id == "backButton") {
                window.history.back();
            }
            else {
                const title = document.getElementById("title").value;
                const content = document.getElementById("editor");
                if (title.length == 0 || content.textContent.length == 0) {
                    document.getElementById("content").innerText = "Please complete all empty fields";
                    document.getElementById("response").style.display = "flex";
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                    }, 3000)
                }
                else {
                    const response = await fetch("/new-post", {
                        method : "POST", 
                        headers : {
                            "Content-Type" : "application/json",
                        },
                        body : JSON.stringify({ title : title, content : content.innerHTML }),
                    });
                    if (response.ok) {
                        const res = await response.json();
                        document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#63E6BE");
                        document.getElementById("content").style.color = "#63E6BE";
                        document.querySelector("#response i").style.color = "#63E6BE";
                        document.getElementById("content").innerText = res.message;
                        document.getElementById("response").style.display = "flex";
                        setTimeout(() => {
                            document.getElementById("response").style.display = "none";
                            window.location.href = "/posts";
                        }, 3000)
                    }
                    else {
                        window.location.href = "/signin";
                    }
                }
            }
        }
        catch (err) {
            window.location.href = "/signin";
        }
    })
});

function applyCommand(command) {
    document.execCommand(command, false, null);
    
}

const editor = document.getElementById("editor");
const editorContainer = document.getElementById("editorContainer");

editor.addEventListener("focus", () => {
    editorContainer.classList.add("focused");
});

editor.addEventListener("blur", () => {
    editorContainer.classList.remove("focused");
});

function changeFontSize(size) {
    document.execCommand("fontSize", false, size);
}

function insertImage(fileInput) {
    const filesList = fileInput.files;
    if (filesList.length > 0) {
        for (const file of filesList) {
            files.push(file);
            const reader = new FileReader();

            reader.onload = (event) => {
                const imgTag = `<img src = "${event.target.result}" alt = "Uploaded image" style = "max-width : 100%;">`
                insertImageAtCursor(imgTag);
            };
            
            reader.readAsDataURL(file);
        }
    }
}

function insertImageAtCursor(html) {
    const editor = document.getElementById("editor");
    editor.focus();
    
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();

            const frag = range.createContextualFragment(html);
            range.insertNode(frag);
            range.collapse();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}