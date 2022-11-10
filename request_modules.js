const fetch = require('node-fetch');
const def_url="http://localhost:5050"
var url;


//get the remaining time

url=def_url+"/getTimeRemaining"
fetch(url).then(res=>res.json()).then(
    (json)=>{
        const time=json.remainingTime
        console.log(time) //in seconds
        //if negative then it challenge has ended
    }
)

//check whether time ended or not

url=def_url+"/timeEnded"
fetch(url).then(res=>res.json()).then(
    (json)=>{
        const ended=json.ended
        console.log(ended) //boolean value
    }
)

//Adding user to the database 
url=def_url+"/db/login"
let data={
    id:"5",
    teamName:"pests",
}
fetch(url,{
    method:'POST',
    body:JSON.stringify(data),
    headers:{'Content-Type':'application/json'}
}).then(res=>res.json()).then((json)=>{
    if(!json.entered===true)
    {
        console.log(json)//err
    }
})

//get the user records from the database
let user_id=1 //just an example
url=def_url+"/db/userDetails/"+user_id
fetch(url).then(res=>{
    if(res.ok) return res.json()
    else return console.log("Some error",res.json())
}).then(
    (json)=>{ 
    console.log(json)//id team_name penalty solved_question score time
    }
)


//get all the user according to the score decending order 

url=def_url+"/qb/leaderBoard"
fetch(url).then(res=>{
    if(res.ok) return res.json()
    else return console.log("Some error",res.json())
}).then(
    (json)=>{ 
    console.log(json)//array of user records
    }
)

//check answer 
data={
    questionId:"1", //less than 11
    answer:"yes",
    id:"1" //user_id
}
url=def_url+"/qb/checkAnswer"
fetch(url,{
    method:'POST',
    body:JSON.stringify(data),
    headers:{'Content-Type':'application/json'}
}).then(res=>{
    if(res.ok) return res.json()
    else return console.log("Some error",res.json())
}).then(
    (json)=>{ 
    console.log(json)   //if correct you will get msg as 'correct' ,current score,and the wonWord 
    //if already solved msg as 'solved' and current score
    //if ans is wrong the msg as 'wrong' and current score
    }
)


