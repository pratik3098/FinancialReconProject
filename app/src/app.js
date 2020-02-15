const Pool = require('pg').Pool
const xlsx = require('xlsx')
const path =require('path')
const moment= require('moment')
const config =require('./configData')
const queries = require('./queries')
let sql


async function connectToDb(){
    try{
    const dbConfig= config.dbConfig
    let dbAddr = dbConfig.database +"@" +dbConfig.host+'/'+dbConfig.port
    sql = new Pool (dbConfig)
    await sql.connect()
    console.log(dbAddr + " connected successfuly")
    }
    catch(err){
        console.error(err)
    }
}


async function createDefaultTables(){
    if(typeof sql !== 'undefined' && sql ){
           // Creating enums for facedrive
    await sql.query(queries.rideStatus)
    await sql.query(queries.rprideStatus)
    await sql.query(queries.uppaymentStatus)
    await sql.query(queries.couponAppliedStatus)
    // Creating the facedrive table
    await sql.query(queries.createFacedriveTable)  
    console.log("facedrive table created successfully")
    // Creating enums for stripe
    await sql.query(queries.stripetxnType)
    await sql.query(queries.stripecurrencyType)
    // Creating the stripe table */
    await sql.query(queries.createStripeTable)

    console.log("stripe table created successfully")
    }
    else
    console.error("Error: Database does not  exists")
}

async function readDataFromExcel(){
    let fcFile= xlsx.readFile(path.resolve(__dirname, config.fcFilePath))
    let stripeFile = xlsx.readFile(path.resolve(__dirname,config.stripeFilePath))
    
    // JSON Arrays of the sheet data
    let fcData = xlsx.utils.sheet_to_json(fcFile.Sheets[fcFile.SheetNames[0]])
    let stripeData = xlsx.utils.sheet_to_json(stripeFile.Sheets[stripeFile.SheetNames[0]])
    
   fcData.forEach(res =>{
    let val ="\'"+res["Ride ID"]+"\'"+" , "+"\'"+moment(new Date(1900,0,res["Ride Created"])).format() +"\'"+" , "+"\'"+res["Ride Status"]+"\'"+" , "+"\'"+res["Ride Region"]+"\'"+" , "+res["RP Client Pay"]+" , "+res["RP Facedrive Fee"]+" , "+"\'"+res["RP Ride Status"]+"\'"+" , "+"\'"+res["RP Toll Roads"]+"\'"+" , "+res["RP Carbon Offset"]+" , "+res["RP Driver Earning"]+" , "+res["RP Driver Tax"]+" , "+res["RP Client Tax"]+" , "+
    res["RP Base Fare"]+" , "+res["RP Facedrive Fee %"]+" , "+res["UP Client Pay"]+" , "+res["UP Facedrive Fee"]+" , "+res["UP Tips"]+" , "+"\'"+res["UP Payment Status"]+"\'"+" , "+"\'"+res["Stripe Reserve Charge ID"]+"\'"+" , "+"\'"+res["Amount Charged ID"]+"\'"+" , "+res["UP Amount Charged"]+" , "+"\'"+res["Coupon Name"]+"\'"+" , "+res["Coupon $ OFF"]+" , "+res["Coupoin % Off"] + " , "+
    "\'"+res["Coupon Applied Status"]+"\'"+" , " + res["Coupon Amount Charged"]
    console.log(val)
    
    Promise.resolve(sql.query(queries.facedriveInsertIntoAll + val + queries.close).catch(err=>{console.error(err.message)})) 

  })  


}


connectToDb().catch(err=>{console.error(err)})
//createDefaultTables().catch(err=>{console.error(err)})
readDataFromExcel().catch(err=>{console.error(err)})

