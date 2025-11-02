import express from 'express';
import db from '../db.js';

//create specific routes
const router = express.Router();

//get all todos
router.get('/', (req, res) => {
    const getTodos = db.prepare(
        `SELECT * FROM todos where user_id = ?`
    )
    const todos = getTodos.all(req.user_id) //all method to fetch multiple rows
})
//create -> post, and save it to the database
router.post('/', (req, res) => {

})
//modify -> put,,,,,, modification to specific id
router.put('/:id', (req, res) => {

})
router.delete('/:id', (req, res) => {

})

export default router