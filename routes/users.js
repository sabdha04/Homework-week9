var express = require("express");
var router = express.Router();
var pool = require('../queries.js');
var jwt = require('jsonwebtoken');
var verifyToken = require('../middleware/middleware.js');

// Rute untuk registrasi
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);
    const user = { id: result.rows[0].id, email };
    const token = jwt.sign(user, 'koderahasiayangsangatrahasia', { expiresIn: '1h' });
    res.json({ token });
});

// Rute untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = jwt.sign({ id: user.rows[0].id, email }, 'koderahasiayangsangatrahasia', { expiresIn: '1h' });
    res.json({ token });
});


//ini kode untuk pagination routers
router.get("/paginate", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    pool.query(
        "SELECT * FROM users ORDER BY id OFFSET $1 LIMIT $2",
        [offset, limit],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
});

router.get("/:id",function (req, res) {
    const movieId = req.params.id;

    pool.query(
        "SELECT * FROM users WHERE id = $1",
        [movieId],
        (error, results) => {
            if (error) {
                res.status(500).json({ message: "Internal Server Error" });
            } else if (results.rows.length === 0) {
                res.status(404).json({ message: "Movie Not Found" });
            } else {
                res.status(200).json(results.rows[0]);
            }
        }
    );
});

router.post("/",verifyToken, function (req, res) {
    const { email, gender, password, role } = req.body;

    if (!email || !gender || !password || !role) {
        res.status(400).json({
            message: "Bad Request",
        });
    } else {
        pool.query(
            "INSERT INTO users (email, gender, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
            [email, gender, password, role],
            (error, results) => {
                if (error) {
                    res.status(500).json({ message: "Internal Server Error" });
                } else {
                    const newId = results.rows[0].id;
                    res.json({
                        message: "New movie created.",
                        location: `/movies/${newId}`,
                    });
                }
            }
        );
    }
});

router.put("/:id",validasiData, function (req, res) {
    const { email, gender, password, role } = req.body;
    const movieId = req.params.id;

    if (!email || !gender || !password || !role) {
        res.status(400).json({
            message: "Bad Request",
        });
    } else {
        pool.query(
            "UPDATE users SET email = $1, gender = $2, password = $3, role = $4 WHERE id = $5",
            [email, gender, password, role, movieId],
            (error, results) => {
                if (error) {
                    res.status(500).json({ message: "Internal Server Error" });
                } else {
                    res.json({
                        message: `Movie id ${movieId} updated.`,
                        location: `/movies/${movieId}`,
                    });
                }
            }
        );
    }
});

router.delete("/:id", function (req, res) {
    const movieId = req.params.id;

    pool.query(
        "DELETE FROM users WHERE id = $1",
        [movieId],
        (error, results) => {
            if (error) {
                res.status(500).json({ message: "Internal Server Error" });
            } else {
                res.send({
                    message: `Movie id ${movieId} removed.`,
                });
            }
        }
    );
});

module.exports = router;