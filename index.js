const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URI)
const userSchema=mongoose.Schema({
  username:String
})

const exerciseSchema=mongoose.Schema({
  username:String,
  description:String,
  duration:Number,
  date:Date,
  userId:String
  

})
const User=mongoose.model('user',userSchema)
const Exercise=mongoose.model('exercise',exerciseSchema)

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/users',async (req,res)=>{
  const username=req.body.username;
  const user=await User.create({
    username
  })
  res.json(user)
})
app.get('/api/users',async (req,res)=>{
  const users=await User.find()
  res.json(users)
})
// {
//   username: "fcc_test",
//   description: "test",
//   duration: 60,
//   date: "Mon Jan 01 1990",
//   _id: "5fb5853f734231456ccb3b05"
// }
app.post('/api/users/:_id/exercises',async (req,res)=>{
  let {description,duration,date}=req.body
  date=date? new Date(date):new Date()
  const id=req.params._id
  
  const foundUser=await User.findById(id)

  Exercise.create({
    username:foundUser.username,
    description,
    duration,
    date:date,
    userId:id

  })
  res.json({
    username:foundUser.username,
    description,
    duration:+duration,
    date:date.toDateString(),
    _id:id
  })
  
})
// {
//   username: "fcc_test",
//   count: 1,
//   _id: "5fb5853f734231456ccb3b05",_id: "5fb5853f734231456ccb3b05",_id: "5fb5853f734231456ccb3b05",_id: "5fb5853f734231456ccb3b05",_id: "5fb5853f734231456ccb3b05",_id: "5fb5853f734231456ccb3b05",
//   log: [{
//     description: "test",
//     duration: 60,
//     date: "Mon Jan 01 1990",
//   }]
// }
app.get('/api/users/:_id/logs',async (req,res)=>{
  const userId=req.params._id
  const user=await User.findById(userId)
  let {from,to,limit}=req.query
  let foundExercise
  const filter={userId}
  const datefilter={}
  if(from) {datefilter['$gte']=new Date(from)}
  if(to){datefilter['$lte']=new Date(to)}
  if (from||to){filter.date=datefilter}
  if(limit) {foundExercise=await Exercise.find(filter).limit(+limit)}
  else {foundExercise=await Exercise.find(filter)}
  
  
  const log=foundExercise.map(e=>{
    return {
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()}

    }
  )
  res.json({
    username:user.username,
    count:foundExercise.length,
    _id:userId,
    log:log
  })

})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
