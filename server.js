    import db from "./db.js";
    import {signup, signin, verifyToken} from "./auth.js"
    import epxress from "express";
    import bodyParser from "body-parser";
    import cookieParser from "cookie-parser";
    const app = epxress();
    const port = 3000;

    app.use(epxress.static("public"));
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
    
    app.get("/about", (req, res) => {
        res.render("about");
    });

    app.get("/new-post", verifyToken, (req, res) => {
        res.render("new-post");
    });

    app.post("/home", (req, res) => {
        res.redirect("/");
    })

    app.get("/posts", verifyToken, (req, res) => {
        res.render("posts");
    });

    app.get("/view-post", verifyToken, (req, res) => {
        res.render("post_view");
    }); 

    db.connect()
        .then(() => {
            app.listen(port, () => {
                console.log(`Server is listening on port ${port}...`);
            });
        })
        .catch((err) => {
            console.error("Error occurring during DB connection: ", err);
        })