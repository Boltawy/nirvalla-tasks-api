import { configDotenv } from 'dotenv'
configDotenv({ path: './config/dev.env' })
import establishDBConnection from "./src/DB/db.connection.js"
import express from 'express'
import authRouter from './src/modules/auth/auth.router.js'
import tasklistRouter from './src/modules/tasklists/tasklist.router.js'
import taskRouter from './src/modules/tasks/task.router.js'
import cors from 'cors'
import syncRouter from './src/modules/sync/sync.router.js'


const app = express()
establishDBConnection()
app.use(express.json())

app.use(cors())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tasklists", tasklistRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/sync", syncRouter)
app.use("/", express.static("./public"))
app.use((req, res, next) => {
    next({
        statusCode: 404,
        status: "Error",
        message: "Route not found"
    })
})


app.use((err, req, res, next) => { //global error handler
    res.status(err.statusCode || 500).json({
        "status": err.status || "Error",
        "message": err.message || "Something went wrong",
        "error": err.error
    })
})

app.get('/', (req, res) => res.sendFile("index.html", { root: "./public" }))
app.listen(process.env.PORT, () => console.log(`Nirvalla Tasks listening on port ${process.env.PORT}.`))
