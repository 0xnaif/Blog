    import epxress from "express";
    import bodyParser from "body-parser";
    const app = epxress();
    const port = 3000;

    app.use(epxress.static("public"));
    app.use(bodyParser.urlencoded({extended : true}));
    app.set("view engine", "ejs");

    app.get("/", (req, res) => {
        res.render("home");
    });

    app.get("/signup", (req, res) => {
        res.render("sign-up");
    });

    app.post("/signup", (req, res) => {
        const { email, password, confirmPassword } = req.body
        if (email == "" || password == "" || confirmPassword == "")
            res.render("sign-up", {error: "Try again, incomplete fields"});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || password.length < 8)
            res.render("sign-up", {error: "Try again, incorrect email or password"});

        if (password != confirmPassword)
            res.render("sign-up", {error: "Try again, Confirm password doesn't match"});

        res.redirect("/");
    });

    app.get("/signin", (req, res) => {
        res.render("sign-in");
    });

    app.post("/signin", (req, res) => {
        const { email, password } = req.body
        if (email == "" || password == "")
            res.render("sign-in", {error: "Try again, incomplete fields"});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || password.length < 8)
            res.render("sign-in", {error: "Try again, incorrect email or password"});

        res.redirect("/");
    })
    app.get("/about", (req, res) => {
        res.render("about");
    });

    app.get("/new-post", (req, res) => {
        res.render("new-post");
    });

    app.post("/home", (req, res) => {
        res.redirect("/");
    })

    app.get("/posts", (req, res) => {
        res.render("posts");
    });

    app.get("view-post", (req, res) => {
        res.render("post_view");
    }); 

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
    });