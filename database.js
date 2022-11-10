const express = require("express")
const db = express.Router()
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    password: '',
    database: 'nexus',
    host: 'localhost',
    port: '5432',
})
db.use(express.json())

db.post('/login', async (req, res) => {
    try {
        let { id } = req.body
        let { teamName } = req.body;
        const check = await pool.query('SELECT * FROM user_data WHERE id=$1', [id]);
        if (check.rows.length != 0) {
            res.json({ "entered": true });
            res.end()
        }
        else {
            let score = 0;
            let penalty = 0;
            let questions_solved = []
            console.log(id, teamName, score, questions_solved)
            const newEntry = await pool.query('INSERT INTO user_data VALUES ($1,$2,$3,$4,$5) RETURNING *', [id, teamName, penalty, questions_solved, score])
            res.json({ "entered": true })
        }

    }
    catch (err) {
        res.status(400)
        res.json(err)
    }
})

db.get("/userDetails/:id", async (req, res) => {
    try {
        const entry = await pool.query("SELECT * FROM user_data WHERE id=$1", [req.params.id])
        res.json(entry.rows[0])
    }
    catch (err) {
        res.status(400)
        res.json(err)
    }
})

module.exports = db;