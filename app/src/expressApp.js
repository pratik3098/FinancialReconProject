const path=require('path')
const express= require('express')
const bodyParser= require('body-parser');
const db= require('./db.js')
const config = require('./configData.js')
const port = 8080
const app = express()
let morgan= require('morgan')
app.set('title','facedrive db')
app.set('view engine','hbs')
app.set('views',path.join(__dirname,"../views"))
app.use(express.static("../views"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.listen(port,()=>{ console.log("Server is running on port: "+port)})

app.get('/',(req,res)=>{
    db.connectToDb().then((res1)=>{
        res.render('index',{val: res1})  
    }).catch(err=>{ res.render('db',{val: err.message})})
})


app.get('/datawithinconsistency',(req,res)=>{
    if (db.isConnected){
        db.dataWithInconsistency(req.body.startDate,req.body.endDate).then(result=>{
          
      // db.dataWithInconsistency('2020-02-12T05:00:00.000Z','2020-02-13T05:00:00.000Z').then(result=>{
        console.log(result)
        res.render('db',{val: result})
        }).catch(err=>{
            res.render('db',{val: err.message})
        })
    }
    else
     res.redirect('/')
})

app.get('/minDate',(req,res)=>{
    db.getMinDate().then(res1=>{
        console.log(res1)
        res.render('db',{val: res1})
    }).catch(err=>{console.error(err.message)
    res.redirect('')})
})

app.get('/maxDate',(req,res)=>{
    db.getMaxDate().then(res1=>{
        console.log(res1)
        res.render('db',{val: res1})
    }).catch(err=>{console.error(err.message)
         res.redirect('/')})
})

app.post('/updateNotes',(req,res)=>{
    db.updateNotes(req.body.id,req.body.notes).then(res1=>{
        let result="Notes updated for id: "+req.body.id
        console.log(result)
        res.render('db',{val: result})
    }).catch(err=>{console.error(err.message)
        res.redirect('/')})
})

app.post('/updateStatus',(req,res)=>{
    db.updateStatus(req.body.id,req.body.status).then(res1=>{
        let result="Status updated for id: "+req.body.id
        console.log(result)
        res.render('db',{val: result})
    }).catch(err=>{console.error(err.message)
        res.redirect('/')})
})

// Api call
//http://localhost:8080/datawithinconsistency?action=post&startDate=2020-02-12T05:00:00.000Z&endDate=2020-02-13T05:00:00.000Z