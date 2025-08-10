import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth' ; 
import jobRoutes from './routes/job-postings' ; 
import candidatesRoutes from './routes/candidates' ;
import questionsRoutes from './routes/questions' ; 
import recruiterRoutes from './routes/recruiters' ; 
import interviewRoutes from './routes/interviews' ; 
dotenv.config() ; 
const app = express()
const port = 5000

app.use(cors()) ; 
app.use(express.json()) ; 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth' , authRoutes) ; 
app.use('/jobPostings' , jobRoutes) ; 
app.use('/candidates' ,  candidatesRoutes) ; 
app.use('/questions' , questionsRoutes) ; 
app.use('/recruiters' , recruiterRoutes) ; 
app.use('/interviews' , interviewRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

