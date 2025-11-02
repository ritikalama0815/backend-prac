import express from 'express';
import bcrypt from 'bcryptjs'; //secure application
import jwt from 'jsonwebtoken'; //generate tokens
import db from '../db.js';

//how to configure ep/routes when u r not defining the in the file

const router = express.Router();

// /auth/register
router.post('/register', (req, res) => {
    const {username, password} = req.body //give us access to incoming JSON body
    //1st encryption
    const hashPassword = bcrypt.hashSync(password, 5); //5 is the salt rounds(cost factor)
    //save user and hashpassword to db
    try{
        //prepare allows to inject some values
        const insertUser = db.prepare(
            `INSERT INTO users (username, password) VALUES (?, ?)` //? are placeholders
        )
        const result = insertUser.run(username, hashPassword) //run method to execute the statement
        
        //automatically add 1st todo
        const defaultTodo = "Add your 1st todo!"
        const insertTodo = db.prepare(
            `INSERT INTO todos (user_id, task) VALUES (?, ?)`
        )
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        //create a token to authenticate a user
        const token = jwt.sign({
            id: result.lastInsertRowid
        }, process.env.JWT_SECRET_KEY, {expiresIn: '24h'}) //payload, secret key, options
        res.json({token})
    }catch(err){
        console.error(err.message)
        return res.sendStatus(500) //500-599 server error
    }
})
router.post('/login', (req, res) => {
    //so basically we need to encrypt the password that user entered so that we can compare
    //it to the encrypted password in the database 
    // so 2 encryptions otherwise we can't compare, same letters give same hashpassword
    const { username, password } = req.body
    try {
        const getUser = db.prepare(
            `SELECT * FROM users WHERE username = ?`
        )
        const user = getUser.get(username) //get method to fetch a single row

        if (!user) {
            return res.status(401).send({ message: 'Invalid username' })
        }
        const passwordMatch = bcrypt.compareSync(password, user.password) //compareSync method to compare plain text password with hashed password
        if(!passwordMatch){
            return res.status(401).send({message: 'Nice try bud, not getting in today'})
        }

        // successful login
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router