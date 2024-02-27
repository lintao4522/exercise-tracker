const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const users=[];
const usernames=[];
const ids=[];
const logarray=[];

const logs=[];
app.post('/api/users/',(req,res)=>{
  const username=req.body.username;
  const id=ids.length;
  usernames.push(username);
  ids.push(id);
  const user={username:username,_id:id.toString()};
  users.push(user);
  logs.push({
    _id:id.toString(),
    username:username,
    count:0,
    log:[]
  })
  res.json(user)
   

})
app.get('/api/users',(req,res)=>{
  res.json(users);
})
function findUserIndexById(users, _id) {  
  for (let i = 0; i < users.length; i++) {  
    if (users[i]._id === _id) {  
      return i; // 找到用户，返回其索引  
    }  
  }  
  return -1; // 未找到用户  
}  


const log={};
log.count=0;



app.post('/api/users/:_id/exercises',(req,res)=>{
  const exercise={};
  const description=req.body.description;
  const duration=+req.body.duration;
  let date=new Date().toDateString();
  if (req.body.date){
    date=new Date(req.body.date).toDateString();
  }
  const id=req.params._id;
  
  
  
  logarray.push({
    description:description,
    duration:duration,
    date:date
  });
  logs[findUserIndexById(logs,id)].log=logarray;
  
  logs[findUserIndexById(logs,id)].count=logarray.length;
  
  
  exercise._id=id;
  exercise.username=usernames[findUserIndexById(users,id)];
  exercise.description=description;
  exercise.duration=duration;
  exercise.date=date;
  res.json(exercise);

  
})

app.get('/api/users/:_id/logs',(req,res)=>{
  const id=req.params._id;
  res.json(logs[findUserIndexById(logs,id)]);

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
