var express = require("express");
var router = express.Router();
var pool = require('../queries.js');
var verifyToken = require('../middleware/middleware.js');

//ini kode untuk pagination movies
router.get("/paginate", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    pool.query(
        "SELECT * FROM movies ORDER BY id OFFSET $1 LIMIT $2",
        [offset, limit],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );

});

router.get("/:id", function (req, res) {
    const movieId = req.params.id;

    pool.query(
        "SELECT * FROM movies WHERE id = $1",
        [movieId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else if (results.rows.length === 0) {
                res.status(404).json({
                    message: "Movie Not Found"
                });
            } else {
                res.status(200).json(results.rows[0]);
            }
        }
    );
});

router.post("/", verifyToken, function (req, res) {
    const {
        title,
        genres,
        year
    } = req.body;

    if (!title || !genres || !year) {
        res.status(400).json({
            message: "Bad Request",
        });
    } else {
        pool.query(
            "INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3)",
            [title, genres, year],
            (error, results) => {
                if (error) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
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

router.put("/:id", function (req, res) {
    const {
        title,
        genres,
        year
    } = req.body;
    const movieId = req.params.id;

    if (!title || !genres || !year) {
        res.status(400).json({
            message: "Bad Request",
        });
    } else {
        pool.query(
            "UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4",
            [title, genres, year, movieId],
            (error, results) => {
                if (error) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
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
        "DELETE FROM movies WHERE id = $1",
        [movieId],
        (error, results) => {
            if (error) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                res.send({
                    message: `Movie id ${movieId} removed.`,
                });
            }
        }
    );
});

module.exports = router;