import "dotenv/config"
import express from "express";



const PORT = 8001
const app = express()

app.use(express.json())

app.listen(PORT, () => console.log(`Server starting on port ${PORT}`))