const path=require('path')
const express= require('express')
const bodyParser= require('body-parser');
const db= require('./db.js')
const config = require('./configData.js')
const port = 8080
const app = express()
app.set('title','facedrive db')
app.set('view engine','hbs')
app.set('views',path.join(__dirname,"../views"))
app.use(express.static("../views"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers")
})
app.listen(port,()=>{ console.log("Server is running on port: "+port)})

app.get('/',(req,res)=>{
    db.connectToDb().then((res1)=>{
        res.render('index',{val: res1})  
    }).catch(err=>{ res.render('index',{val: err.message})})
})


app.get('/datawithinconsistency',(req,res)=>{
    if (db.isConnected){
        db.dataWithInconsistency().then(dt=>{
        let result=[]
        dt.rows.forEach(row=>{result.push(Object.values(row))})
        //resolve(result)
        res.render('database',{val: result})
        }).catch(err=>{
            res.render('index',{val: err.message})
        })
    }
    else
     res.redirect('/')
})