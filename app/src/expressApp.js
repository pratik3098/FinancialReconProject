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
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
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

db.connectToDb().then(res=>{console.log(res)}).catch(err=>{console.error(err.message)})
app.post('/dt1',(req,res)=>{
    if (db.isConnected){
        console.log("Body is: "+Object.values(req.body))
 
        db.dataWithInconsistency(req.body.startDate,req.body.endDate).then(result=>{
          
     //  db.dataWithInconsistency('2020-02-12T05:00:00.000Z','2020-02-13T05:00:00.000Z').then(result=>{
      // result.sort((a,b)=>{a.discrepency_id - b.discrepency_id})
        return res.status(200).send({
            success: 'true',
            data: result
        })
        
            }).catch(err=>{
                return res.status(404).send({
                    success: 'false',
                    message: err.message
                })

        })
    }
    else
     res.redirect('/')
})


app.get('/getAll',(req,res)=>{
    if (db.isConnected){
    db.getAllData().then(res1=>{
        return res.status(200).send({
            success: 'true',
            data: res1
        })
    }).catch(err=>{
        return res.status(404).send({
            success: 'false',
            message: err.message
        })
    })
   }
   else
    res.redirect('/') 
})
app.get('/minDate',(req,res)=>{
    if (db.isConnected){
    db.getMinDate().then(res1=>{
        return res.status(200).send({
            success: 'true',
            data: res1
        })
    }).catch(err=>{
        return res.status(404).send({
            success: 'false',
            message: err.message
        })
    })
   }
   else
    res.redirect('/') 
})

app.get('/maxDate',(req,res)=>{
    if(db.isConnected){
    db.getMaxDate().then(res1=>{
        return res.status(200).send({
            success: 'true',
            data: res1
        })
    }).catch(err=>{console.error(err.message)
        return res.status(404).send({
            success: 'false',
            message: err.message
        })
    })
    }
    else
    res.redirect('/')
})

app.post('/updateNotes',(req,res)=>{
    if(db.isConnected){
    db.updateNotes(req.body.id,req.body.notes).then(res1=>{
        let result="Notes updated for id: "+ req.body.id
       console.log(req.body.notes)
        return res.status(200).send({
            success: 'true',
            data: result
        })
    }).catch(err=>{console.error(err.message)
        return res.status(404).send({
            success: 'false',
            message: err.message
        })})
    }else
      redirect('/')
})

app.post('/updateStatus',(req,res)=>{
    if(db.isConnected){
    db.updateStatus(req.body.id,req.body.status).then(res1=>{
        let result="Status updated for id: "+req.body.id
        console.log(res1)
        return res.status(200).send({
            success: 'true',
            data: result
        })
    }).catch(err=>{console.error(err.message)
        return res.status(404).send({
            success: 'false',
            message: err.message
        })})
    }else
       res.redirect('/')
})

app.post('/newData',(req,res)=>{
    if(db.isConnected){
      console.log(req.body.file)
    db.readSTData(req.body.file).then(res1=>{
       console.log("File upload:" +req.body.file)
       console.log("File upload: "+ res1)
        return res.status(200).send({
            success: 'true',
            data: result
        })
    }).catch(err=>{console.error(err.message)
        return res.status(404).send({
            success: 'false',
            message: err.message
        })})
    }else
      redirect('/')
})