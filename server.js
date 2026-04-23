import "dotenv/config"
import express from "express";
import cors from "cors"


const PORT = 8001
const app = express()

app.use(cors({
    origin: process.env.FRONTEND_PORT
}))


app.get("/test", (req,res) => {
    res.json("successful response")
})

app.use(express.json())

app.listen(PORT, () => console.log(`Server starting on port ${PORT}`))