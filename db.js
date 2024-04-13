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
            const result = await this.#db.query('SELECT * FROM "user" WHERE "email" = $1;', [data]);
            return result;
        }
        catch (err) {

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
            const result =  await this.#db.query('INSERT INTO "post" (title, content, userid) VALUES ($1, $2, $3) RETURNING *;', data);
            return result.rows[0];
        }
        catch (err) {
            throw err;
        }
    }

    async addNewPost() {

    }

    async addNewPost() {

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