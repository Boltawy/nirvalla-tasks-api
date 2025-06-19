import { configDotenv } from 'dotenv'
configDotenv({ path: './config/dev.env' })
import establishDBConnection from "./src/DB/db.connection.js"
import express from 'express'
import authRouter from './src/modules/auth/auth.router.js'
import taskListRouter from './src/modules/taskLists/tasklist.router.js'
// import usersRouter from './src/modules/users/users.router.js'


const app = express()

establishDBConnection()
app.use(express.json())




app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tasklists", taskListRouter)
// app.use("/tasks", tasksRouter)

app.use((err, req, res, next) => { //global error handler
    res.status(500).json({
        "status": err.status,
        "message": err.message,
        "error": err.error
    })
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT, () => console.log(`Sample app listening on port ${process.env.PORT}.`))