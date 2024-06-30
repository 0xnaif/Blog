import db from "./db.js";
import {signup, signin, newPassword, verifyToken, verifyEmail} from "./auth.js"
import epxress from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import path from "path";
const app = epxress();
const port = 3000;

app.use(epxress.static("public"));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(epxress.static(path.join(__dirname, 'public')));
// app.use(epxress.static(__dirname, {
//     index: false, 
//     immutable: true, 
//     cacheControl: true,
//     maxAge: "30d"
// }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", verifyToken, (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => {
    res.render("sign-up");
});

app.post("/signup", (req, res) => {
    signup(req, res, db);
});

app.get("/signin", (req, res) => {
    res.render("sign-in");
});

app.post("/signin", (req, res) => {
    signin(req, res, db);
});

app.get("/forgot-password", (req, res) => {
    res.render("forgot_password");
})

app.post("/forgot-password", (req, res) => {
    const { email } = (req.body);
    if (email == "") {
        res.render("forgot_password", { code : false, error : "Try again, incomplete fields" })
    }
    else {
        if (!verifyEmail(email))
            res.render("forgot_password", { code : false, error: "Try again, incorrect field" });
        else {
            // check if email is exist
            // Send email code
            res.cookie("email", email, {
                httpOnly : true,
                secure : false,
            });
            res.render("forgot_password", { code : true })
        }
    }
})

app.post("/verifyCode", (req, res) => {
    const { one, second, third, forth } = req.body;
    const code = `${one}${second}${third}${forth}`;
    if (!code) {
        res.render("forgot_password", { code : true, codeError : "Try again, incomplete fields" })
    }
    else {
       const flag = true;
       if (!flag) {
            res.render("forgot_password", { code : true, codeError : "Try again, incorrect fields" })
       }
       else {
            res.redirect("/new-password")
       }
    }
});

app.get("/new-password", (req, res) => {
    res.render("new_password");
});

app.post("/new-password",async (req, res) => {
    newPassword(req, res, db);
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/new-post", verifyToken, (req, res) => {
    res.render("new-post");
});

app.post("/new-post", verifyToken, async (req, res) => {
    try {
        if (req.body.post === "Post") {
            const title = req.body.title;
            const content =  req.body.content;

            if (title === "" || content === "") {
                const state = "Please complete all empty fields"
                return res.render("new-post", {state : state, type : "error"});
            }
            const state = "New post added successfully"
            const userId = req.decoded.id
            const data = [title, content, userId];
            await db.addNewPost(data);
            res.render("new-post", {state : state, type : "success"});
        }
        else {
            res.redirect("/");
        }
    }
    catch (err) {
        console.error("An error occurred during adding new post: ", err);
        res.status(500).send("Internal server error")
    }
});

app.post("/home", (req, res) => {
    res.redirect("/");
})

app.get("/posts", verifyToken, async (req, res) => {
    const userID = req.decoded.id;
    const posts = await db.getUserPosts([userID]);
    res.render("posts", { posts });
});

app.get("/view-post/", verifyToken, async (req, res) => {
    const postID = req.query.id;
    const post = await db.getPostInfo([postID]);
    res.render("post_view", { post });
});

app.delete("/post/:id", verifyToken, async (req, res) => {
    try {
        const postID = req.params.id;
        const result = await db.deletePost([postID]);
        if (result.rowCount > 0) {
            res.status(200).json({ message : "Post deleted successfully"});
        }
        else {
            res.status(404).json({ message : "Post not found"});
        }
    }
    catch (err) {
        console.error("An error occured during deleting post:\n", err);
        res.status(500).json({ message : "Internal server error"});
    }
})

db.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    })
    .catch((err) => {
        console.error("Error occurring during DB connection: ", err);
    })