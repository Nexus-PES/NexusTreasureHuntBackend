const express=require("express")
const qb=express.Router()
const Pool=require('pg').Pool
const pool=new Pool({
    user:'postgres',
    password:'',
    database:'nexus',
    host:'localhost',
    port:'5432', 
})

let number_of_questions=10;

const questions=[
    {
        id:1,
        question:'What the frick',
        ans:'yes',
        word:"",

    },
    {
        id:2,
        question:'some',
        ans:'no',
        word:"",
    }
]

qb.post('/checkAnswer',async(req,res)=>{
    
    const {id}=req.body  
    const {questionId}=req.body 
    var entry
    try{
        entry=await pool.query('SELECT * FROM user_data WHERE id=$1',[id])
    }
    catch(err){
        res.status(400)
        res.json({"err":err,msg:'0'})
        res.end()
    }
    const {answer}=req.body
    var result=entry.rows[0]
    var {penalty}=result
    var {score}=result
    var {solved_question}=result
    let done=1;
    if(solved_question.indexOf(questionId)!=-1){
        res.json({"err":false,'msg':"solved",'score':score})
        done=0;
    }
    else if(questions[questionId-1].ans==answer){
        score=score+10;
        solved_question.push(questionId)
        var time=new Date()
        time = time.getHours()+":"+time.getMinutes()
        try{
            pool.query("UPDATE user_data SET penalty = $1, score = $2,solved_question=$3,time=$5 WHERE id=$4",[penalty,score,solved_question,id,time])
            res.json({"err":false,"msg":"correct","score":score,"wonWord":questions[questionId-1].word})
        }
        catch(err)
        {
            res.status(400)
            res.json({"err":err,'msg':'1'})
        }
    }
    else{
        score=parseInt(score)-2
        penalty=penalty+1
        try{
            pool.query("UPDATE user_data SET penalty = $1, score = $2,solved_question=$3 WHERE id=$4",[penalty,score,solved_question,id])
            res.json({"err":false,"msg":"wrong","score":score})
        }
        catch(err)
        {
            res.status(400)
            res.json({"err":err,'msg':'2'})
        }
    }


})

qb.get("/leaderBoard",async(req,res)=>{
    try{
        var all=await pool.query("SELECT * FROM user_data ORDER BY score DESC");
        res.json(all.rows)
    }
    catch(err){
        res.status(400)
        res.json({"err":err})
    }
})


module.exports=qb;