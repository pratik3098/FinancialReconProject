const Pool = require('pg').Pool
const xlsx = require('xlsx')
const { getJsDateFromExcel } = require("excel-date-to-js")
const path =require('path')
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

exports.readSTData= async function(file){
    let stripeFile = xlsx.readFile(file.path)
    
    // JSON Arrays of the sheet data
    let stripeData = xlsx.utils.sheet_to_json(stripeFile.Sheets[stripeFile.SheetNames[0]])
    stripeData.forEach(res =>{
    let val ="\'"+res["id"]+"\'"+" , "+"\'"+res["Type"]+"\'"+" , "+"\'"+res["Source"]+"\'"+" , "+res["Amount"]+" , "+res["Fee"]+" , "+res["Net"]+" , "+"\'"+res["Currency"]+"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Created (UTC)"])).format() +"\'"+" , "+"\'"+ moment(getJsDateFromExcel(res["Available On (UTC)"])).format()+"\'"
    Promise.resolve(sql.query(queries.stripeInsertIntoAll + val + queries.close).catch(err=>{console.error(err.message)})) 
    }) 
    console.log("Data inserted into Stripe successfully")
}

exports.dataWithInconsistency= async function(startDate, endDate){
    let result = await sql.query(`select * from disrepency where date >= '` + startDate+ `' and date <= '`+endDate+`'  order by discrepency_id;`).catch(err=>{console.log(err.message)})
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
   id ="\'"+id+"\'"
   let result =await sql.query(queries.getUSerDetails)
   return result.rows
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
    await sql.query(queries.insertAllData).catch(err=>{console.log(err.message)})
    setTimeout(()=>{},3000)
    await sql.query(queries.updateProperStatus).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateProperDes).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateDesrBoth).catch(err=>{console.log(err.message)})
    await sql.query(queries.updateDesrNone).catch(err=>{console.log(err.message)})
    console.log("Data inserted successfully in desrepency")
}

exports.getAllData= async function (){
    let result = await sql.query(queries.getAllfromData).catch(err=>{console.log(err.message)})
    return result.rows
}
this.connectToDb().catch(err=>{console.error(err.message)})
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