const global_start_timer=new Date('Nov 5, 2022 15:00:00').getTime() //change this before starting the server
const global_end_timer=new Date('Nov 5,2022 16:00:00').getTime() //this also

const express=require("express")
const database=require("./database")
const app=express()
const questionbase=require('./questions')

app.use(express.json())
app.use('/db',database)
app.use('/qb',questionbase)


app.get('/getTimeRemaining',async(req,res)=>{
    var now=new Date().getTime()
    res.json({
        'remainingTime':global_end_timer-now,
    })
    res.end()
})

app.get('/timeEnded',async(req,res)=>{
    var now=new Date().getTime()
    if(global_end_timer-now<=0)
    {
        res.json({'ended':true})
    }
    else{
        res.json({'ended':false})
    }
})

app.listen(5050,()=>{
    console.log("Up and running!");
})