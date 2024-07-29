document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("edit-form");
    form.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            if (e.submitter.id == "backButton") {
                window.history.back();
            }
            else {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const postID = document.querySelector(".main .post").id;
                const response = await fetch(`/edit-post?id=${postID}`, {
                    method : "PUT",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify(data),
                });
                if (response.ok) {
                    const res = await response.json();
                    document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#63E6BE");
                    document.getElementById("content").style.color = "#63E6BE";
                    document.querySelector("#response i").style.color = "#63E6BE";
                    document.getElementById("response").style.display = "flex";
                    document.getElementById("content").innerText = res.message;
                    console.log(res.message);
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                        window.location.href = "/posts";
                    }, 3000);
                }
                else {
                    const res = await response.json();
                    document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#F00");
                    document.getElementById("content").style.color = "#F00";
                    document.querySelector("#response i").style.color = "#F00";
                    document.getElementById("response").style.display = "flex";
                    document.getElementById("content").innerText = res.message;
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                        window.location.href = "/posts";
                    }, 3000);
                }
            }
        }
        catch(err) {
            alert("Error editing post");
            window.location.href = "/signin";
        }
    })
});