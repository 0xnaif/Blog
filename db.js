import pg from "pg";

class DB {
    #db;

    constructor() {
        this.#db = new pg.Client({
            user : "postgres",
            host : "localhost",
            database : "Blog",
            password : "NnMm@2019",
            port : 5432,
        });
    }

    async connect() {
        try {
            await this.#db.connect();
        }
        catch (err) {
            throw err;
        }
    }

    async searchUser(data) {
        try {
            const result = await this.#db.query('SELECT * FROM "user" WHERE "email" = $1;', data);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async addNewUser(data) {
        try {
            const result =  await this.#db.query('INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *;', data);
            return result.rows[0];
        }
        catch (err) {
            throw err;
        }
    }

    async addNewPost(data) {
        try {
            const result = await this.#db.query('INSERT INTO "post" (title, content, userid) VALUES ($1, $2, $3);', data);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async changePassword(data) {
        try {
            const result = await this.#db.query('UPDATE "user" SET password = $1 WHERE email = $2', data);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async getUserPosts(data) {
        try {
            const result = await this.#db.query('SELECT id, title, content, TO_CHAR(postdate, \'YYYY-MM-DD\') as postdate FROM "post" WHERE userid = $1 ORDER BY postdate DESC', data);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    }

    async getPostInfo(data) {
        try {
            const result = await this.#db.query('SELECT id, title, content, TO_CHAR(postdate, \'YYYY-MM-DD\') as postdate FROM "post" WHERE id = $1', data);
            return result.rows[0];
        }
        catch (err) {
            throw err;
        }
    }

    async editPost(data) {
        try {
            const result = this.#db.query('UPDATE "post" SET title = $1, content = $2, postdate = $3 WHERE id = $4', data);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async deletePost(data) {
        try {
            const result = this.#db.query('DELETE FROM "post" WHERE id = $1', data);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async close() {
        try {
            await this.#db.end();
        }
        catch (err) {
            throw err;
        }
    }
}

const db = new DB();
export default db;