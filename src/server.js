import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js' //importing variable and assigning it to todoRoutes
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5003

//get the path from the url of the current module
const __filename = fileURLToPath(import.meta.url) //gives access to filename
//get directory name from the file path
const __dirname = dirname(__filename) //gives access to directory name

//middleware
app.use(express.json())
//serves the HTML file from the public directory and tells express to serve all files from the public directory as static assets
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//for any authentication routes
app.use("/auth", authRoutes)
//endpoint -> middlware -> routes, all routes protected by middleware
app.use("/todos", authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Server run OK port ${PORT}`)
})