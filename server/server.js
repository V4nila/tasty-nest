const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require("./routes/authRoutes");
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

const recipeRoutes = require('./routes/recipeRoute')
app.use('/api/recipes', recipeRoutes)
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('API is running')
})
app.get('/test', (req, res) => {
    res.send('Server is working!')
  })
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB") 
    app.listen(3000, () => console.log('Server running on port 3000'))
  })
  .catch(err => console.log(err))
