import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const saltRounds = 10;
const secretKey = crypto.randomBytes(64).toString('hex');

export function signup(req, res) {
    const { email, password, confirmPassword } = req.body
    if (email == "" || password == "" || confirmPassword == "")
        return res.render("sign-up", {error: "Try again, incomplete fields"});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8)
        return res.render("sign-up", {error: "Try again, incorrect email or password"});

    if (password != confirmPassword)
        return res.render("sign-up", {error: "Try again, Confirm password doesn't match"});

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            return res.status(500).send("Internal server error");

        const token = jwt.sign({id : 1, email : email}, secretKey, {expiresIn : "1m"});
        console.log("hashed passwrd: ", hash);
        console.log("token", token);
        res.cookie("jwtToken", token, {
            maxAge : 60000,
            httpOnly: true,
            secure: false,
        });
        res.redirect("/");
    });
}

export function signin(req, res) {
    const { email, password } = req.body
    if (email == "" || password == "")
        return res.render("sign-in", {error: "Try again, incomplete fields"});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8)
        return res.render("sign-in", {error: "Try again, incorrect email or password"});

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            return res.status(500).send("Internal server error");
        
        const token = jwt.sign({id : 1, email : email}, secretKey, {expiresIn : "2m"});
        console.log("hashed passwrd: ", hash);
        console.log("token", token);
        res.cookie("jwtToken", token, {
            maxAge : 120000,
            httpOnly: true,
            secure: false,
        });
        res.redirect("/");
    })
}

function verify(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return { verified : true, decoded : decoded };
    }
    catch (err) {
        return { verified : false, decoded : null };
    }
}

export function verifyToken(req, res, next) {
    const token = req.cookies.jwtToken;
    if (token) {
        const { verified, decoded } = verify(token);
        if (verified) {
            req.decoded = decoded;
            next();
        }
    }
    res.status(401).send("Unauthorized");
}