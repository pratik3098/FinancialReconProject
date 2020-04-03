const Pool = require('pg').Pool
const xlsx = require('xlsx')
const { getJsDateFromExcel } = require("excel-date-to-js")
const path =require('path')
const fs = require('fs')
const moment= require('moment')
const config =require('./configData')
const queries = require('./queries')
let sql
exports.isConnected = false

exports.connectToDb =async function(){
    try{
    const dbConfig= config.dbConfig
    let dbAddr = dbConfig.database +"@" +dbConfig.host+'/'+dbConfig.port
    sql = new Pool (dbConfig)
    await sql.connect().catch(err=>{console.error(err.message)})
    this.isConnected =true
    console.log(dbAddr + " connected successfuly")
    return (dbAddr + " connected successfully")
    }
    catch(err){
        console.error(err)
    }
}

exports.createDefaultTables=async function(){
    if(typeof sql !== 'undefined' && sql ){
           // Creating enums for facedrive
    await sql.query(queries.rideStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.rprideStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.uppaymentStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.couponAppliedStatus).catch(err=>{console.log(err.message)})
    // Creating the facedrive table
    await sql.query(queries.createFacedriveTable)  .catch(err=>{console.log(err.message)})
    console.log("facedrive table created successfully")
    // Creating enums for stripe
    await sql.query(queries.stripetxnType).catch(err=>{console.log(err.message)})
    await sql.query(queries.stripecurrencyType).catch(err=>{console.log(err.message)})
    // Creating the stripe table */
    await sql.query(queries.createStripeTable).catch(err=>{console.log(err.message)})

    console.log("stripe table created successfully")


    // Creating disrepency table 
    await sql.query(queries.disrepencyStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.disrepencyDescription).catch(err=>{console.log(err.message)})
    await sql.query(queries.createDisrepencyTable).catch(err=>{console.log(err.message)})
    console.log("disrepency table created successfully")

    }
    else
    console.error("Error: Database does not  exists")
}

exports.readFCDataFromExcel= async function(){
    let fcFile= xlsx.readFile(path.resolve(__dirname, config.fcFilePath))
    // JSON Arrays of the sheet data
    let fcData = xlsx.utils.sheet_to_json(fcFile.Sheets[fcFile.SheetNames[0]])
   fcData.forEach(res =>{

    let val ="\'"+res["Ride ID"]+"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Ride Created"])).format() +"\'"+" , "+"\'"+res["Ride Status"]+"\'"+" , "+"\'"+res["Ride Region"]+"\'"+" , "+res["RP Client Pay"]+" , "+res["RP Facedrive Fee"]+" , "+"\'"+res["RP Ride Status"]+"\'"+" , "+"\'"+res["RP Toll Roads"]+"\'"+" , "+res["RP Carbon Offset"]+" , "+res["RP Driver Earning"]+" , "+res["RP Driver Tax"]+" , "+res["RP Client Tax"]+" , "+
    res["RP Base Fare"]+" , "+res["RP Facedrive Fee %"]+" , "+res["UP Client Pay"]+" , "+res["UP Facedrive Fee"]+" , "+res["UP Tips"]+" , "+"\'"+res["UP Payment Status"]+"\'"+" , "+"\'"+res["Stripe Reserve Charge ID"]+"\'"+" , "+"\'"+res["Amount Charged ID"]+"\'"+" , "+res["UP Amount Charged"]+" , "+"\'"+res["Coupon Name"]+"\'"+" , "+res["Coupon $ OFF"]+" , "+res["Coupoin % Off"] + " , "+
    "\'"+res["Coupon Applied Status"]+"\'"+" , " + res["Coupon Amount Charged"]

    Promise.resolve(sql.query(queries.facedriveInsertIntoAll + val + queries.close).catch(err=>{console.error(err.message)})) 
  })  

    console.log("Data inserted into facedrive successfully")
}



exports.readSTDataFromExcel= async function(){
    let stripeFile = xlsx.readFile(path.resolve(__dirname,config.stripeFilePath))
    
    // JSON Arrays of the sheet data
    let stripeData = xlsx.utils.sheet_to_json(stripeFile.Sheets[stripeFile.SheetNames[0]])
    stripeData.forEach(res =>{
    let val ="\'"+res["id"]+"\'"+" , "+"\'"+res["Type"]+"\'"+" , "+"\'"+res["Source"]+"\'"+" , "+res["Amount"]+" , "+res["Fee"]+" , "+res["Net"]+" , "+"\'"+res["Currency"]+"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Created (UTC)"])).format() +"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Available On (UTC)"])).format()+"\'"
    Promise.resolve(sql.query(queries.stripeInsertIntoAll + val + queries.close).catch(err=>{console.error(err.message)})) 
    }) 
    console.log("Data inserted into Stripe successfully")
}

exports.readSTData= async function(fileName){
    let accepted = await this.getCount().catch(err=>console.log(err.message))
    let notAccepted=0
    return new Promise((resolve,reject)=>{
     
   async function readData(){ 
     let stripeFile = xlsx.readFile(fileName)
     let stripeData = xlsx.utils.sheet_to_json(stripeFile.Sheets[stripeFile.SheetNames[0]])
    notAccepted =stripeData.length
    stripeData.forEach(res =>{
    let val ="\'"+res["id"]+"\'"+" , "+"\'"+res["Type"]+"\'"+" , "+"\'"+res["Source"]+"\'"+" , "+res["Amount"]+" , "+res["Fee"]+" , "+res["Net"]+" , "+"\'"+res["Currency"]+"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Created (UTC)"])).format() +"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Available On (UTC)"])).format()+"\'"
    Promise.resolve(sql.query(queries.stripeInsertIntoAll + val + queries.close)).catch(err=>{
         //console.error(err.message)
    })
  
    })
}

    readData().then((res)=>{ 
         this.insertDataIntoDes().then(()=>{
           this.getCount().then(res=>{
               let x = res - accepted
               let y =  notAccepted - x
		  if(y<0){
			  y=0
		  }
            resolve({'accepted': x, "notAccepted": y})
           }).catch(err=>console.error(err.message))
          }).catch(err=>console.error(err.message))
         }).catch(err=>console.error(err.message))
    
        })

    
    }

exports.dataWithInconsistency= async function(startDate, endDate){
    let result = await sql.query(`select * from disrepency where (date >= '` + startDate+ `' and date <= '`+endDate+`') or date is NULL  order by discrepency_id;`).catch(err=>{console.log(err.message)})
    return result.rows
}

exports.updateNotes= async function(Id, notes){
    Id ="\'"+Id+"\'"
    notes ="\'"+notes+"\'"
    await sql.query(`update disrepency SET notes = ` + notes + ` where ( Discrepency_ID = `+Id +queries.close).catch(err=>{console.log(err.message)})
    
}
exports.updateStatus= async function(Id, status){
    Id ="\'"+Id+"\'"
    if(status == 'reconciled')
    await sql.query(queries.updateStatutorec+Id+queries.close).catch(err=>{console.log(err.message)})
    else if (status == 'rejected')
    await sql.query(queries.updateStatustorejected+Id+queries.close).catch(err=>{console.log(err.message)})
    else
    await sql.query(queries.updateStatustonew+Id+queries.close).catch(err=>{console.log(err.message)})
}
exports.getRideInfo= async function(id){
   let result =await sql.query(queries.getUSerDetails1+ id + queries.getUSerDetails2)
   return result.rows[0]
}

exports.getMaxDate=async function(){
    let result = await sql.query(queries.maxDate).catch(err=>{console.log(err.message)})
    return result.rows[0]["max"]
}

exports.getMinDate =async function(){
    let result = await sql.query(queries.minDate).catch(err=>{console.log(err.message)})
    return result.rows[0]["min"]
}

exports.insertDataIntoDes= async function (){
    await sql.query(queries.deleteNULL).catch(err=>{console.log(err.message)})
    await this.resetCount().catch(err=>console.error(err.message))
    //await sql.query(queries.insertAllData).catch(err=>{console.log(err.message)})
    await sql.query(`select  (stripe.id) as Stripe_Charge_ID, ('new') as Status , ('amount mis-match') as Description, (' ') as Notes, stripe.amount, facedrive.up_amount_charged, (CAST (facedrive.up_amount_charged - stripe.amount  as int)) as Desrepency_Amount,  (stripe.created_utc) as Date from facedrive FULL JOIN stripe ON facedrive.amount_charged_id = stripe.source;`).then(res=>{
        res.rows.forEach(row =>{
           
           let samt = "\'"+row["amount"]+"\'"
           if (row["amount"] === null)
           samt= 'NULL'
           let famt = "\'"+row["up_amount_charged"]+"\'"
           if (row["up_amount_charged"] === null )
           famt= 'NULL'
           let desr = "\'"+row["desrepency_amount"]+"\'"
           if (row["desrepency_amount"]=== null)
           desr ='NULL'
           let dt = "\'"+ this.sqlDateFormat(moment(row["date"]).format())  + "\'"
           if (row["date"] === null)
           dt = 'NULL'
          // console.log("Desrepecy Amount: "+row["desrepency_amount"])
          let val ="\'"+row["stripe_charge_id"]+"\'"+" , "+"\'"+row["status"]+"\'"+" , "+"\'"+row["description"]+"\'"+" , "+"\'"+row["notes"]+"\'"+" , "+samt+" , "+famt+" , "+desr+" , "+dt
            
           Promise.resolve(sql.query(`insert into disrepency (Stripe_Charge_ID, Status, Description, Notes, Stripe_Amount, FD_Amount, Desrepency_Amount, Date) Values(`+val+`);`).catch(err=>{
           console.log(err.message)
          Promise.resolve(this.resetCount().catch(err=>err.message)).catch(err=>{ console.log(err.message)})
        
        })).catch(err=>{ console.log(err.message)
         })
    
        })

        
    })
    await sql.query(queries.updateProperStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateProperDes).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateDesrBoth).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateDesrNone).catch(err=>{console.log(err.message)})
    await sql.query(queries.deleteNULL).catch(err=>{console.log(err.message)})
    await this.resetCount().catch(err=>console.error(err.message))
    await sql.query(queries.deleteNULL).catch(err=>{console.log(err.message)})
    console.log("Data inserted successfully in disrepency")
}

exports.getAllData= async function (){
    let result = await sql.query(queries.getAllfromData).catch(err=>{console.log(err.message)})
    return result.rows
}

exports.resetCount= async function(){
    sql.query(`select count(stripe_charge_id) from disrepency;`).then(res=>{
        let x = Number(res.rows[0].count) + 1
        console.log( 'Count reset :' + x)
        sql.query(queries.resetCount+ x + ' ;').catch(err=>console.error(err.message))
    }).catch(err=>{console.log(err.message)})
}

exports.getCount=async function(){
   let result =await sql.query('select count(*) from stripe;').catch(err=>console.error(err.message))
   return (Number(result.rows[0].count))
}

exports.sqlDateFormat= function(dt){
    return dt.substring(0,10)+ " " +dt.substring(11,19)
}
//this.connectToDb().catch(err=>{console.error(err.message)})
//this.createDefaultTables().catch(err=>{console.error(err.message)})
//this.readFCDataFromExcel().catch(err=>{console.error(err.message)})
//this.readSTDataFromExcel().catch(err=>{console.error(err.message)})
//this.insertDataIntoDes().catch(err=>{console.log(err)})
/*this.dataWithInconsistency('2020-02-09T05:00:00.000Z','2020-02-12T05:00:00.000Z').then(res=>{
    console.log(res)
}).catch(err=>{console.error(err.message)}) */
//this.getMaxDate().then(res=>{console.log(res)}).catch(err=>{console.error(err)})
//2020-02-13T05:00:00.000Z
//this.getMinDate().then(res=>{console.log(res)}).catch(err=>{console.error(err)})
// 2020-02-12T05:00:00.000Z
//console.log(res)

//this.updateStatus(1, 'reconciled').catch(err=>{console.log(err)})
//this.getRideInfo('1').then(res=>{console.log(res)}).catch(err=>{console.log(err)})
//this.getAllData().then(res=>{console.log(res)}).catch(err=>{console.log(err.message)})
//console.log(condateFormat('2020-02-12T05:00:00.000Z'))
//dateOps1('2020-02-12T05:00:00.000Z')
//this.readSTData().then(res=>{  console.log(res)}).catch(err=>{console.error(err.message)}) 
//this.resetCount().catch(err=>console.error(err.message))
//this.getCount().catch(err=>console.error(err.message))
