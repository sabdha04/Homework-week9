/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Movie API
 *   description: API for managing movies
 *   version: 1.0.0
 *
 * servers:
 *   - url: http://localhost:3000
 *     description: Local Development Server
 *
 * paths:
 *   /movies/paginate:
 *     get:
 *       summary: Get a list of paginated movies
 *       parameters:
 *         - name: page
 *           in: query
 *           description: Page number
 *           required: false
 *           schema:
 *             type: integer
 *         - name: limit
 *           in: query
 *           description: Number of items per page
 *           required: false
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: A list of paginated movies
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Movie'
 *         '500':
 *           description: Internal Server Error
 *
 *   /movies/{id}:
 *     get:
 *       summary: Get a movie by ID
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Movie ID
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Movie details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Movie'
 *         '404':
 *           description: Movie Not Found
 *         '500':
 *           description: Internal Server Error
 *     post:
 *       summary: Create a new movie
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       responses:
 *         '201':
 *           description: Movie created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Movie'
 *         '400':
 *           description: Bad Request
 *         '500':
 *           description: Internal Server Error
 *     put:
 *       summary: Update a movie by ID
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Movie ID
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Movie updated successfully
 *         '404':
 *           description: Movie Not Found
 *         '500':
 *           description: Internal Server Error
 * 
 *     delete:
 *       summary: Delete a movie by ID
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Movie ID
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Movie deleted successfully
 *         '404':
 *           description: Movie Not Found
 *         '500':
 *           description: Internal Server Error
 * 
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Movie ID
 *         title:
 *           type: string
 *           description: Movie title
 *         genres:
 *           type: string
 *           description: Movie genres
 *         year:
 *           type: integer
 *           description: Release year
 *       example:
 *         id: 1
 *         title: "Reckless"
 *         genres: "Comedy|Drama|Romance"
 *         year: 2001
 */
var express = require("express");
var router = express.Router();

module.exports = router;