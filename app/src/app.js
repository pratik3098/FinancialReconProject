const Client = require('pg').Client
const xlsx = require('xlsx')
const path =require('path')
const config =require('./configData')
const queries = require('./queries')
let sql


//const sql = postgres('postgres://'+config.user+':'+config.password+'@'+config.host+':'+config.port+'/'+config.database, config)
//sql.connect().then(()=>{ })
//.then(()=>{sql.query("CREATE TABLE facedrive (ride_id VARCHAR(35) PRIMARY KEY)")}).catch(err=>{console.error(err)})
//.catch(err=>{console.error(err)})


async function connectToDb(){
    try{
    const dbConfig= config.dbConfig
    sql = new Client(dbConfig)
    await sql.connect()
    console.log(dbConfig.database +"@" +dbConfig.host+'/'+dbConfig.port + " connected successfuly")
    // Creating enums
    await sql.query(queries.rideStatus)
    await sql.query(queries.rprideStatus)
    await sql.query(queries.uppaymentStatus)
    await sql.query(queries.couponAppliedStatus)
    
    // Creating the facedrive table
    await sql.query(queries.createFacedriveTable)
    }
    catch(err){
        console.error(err)
    }
}

async function readDataFromExcel(){
    let fcFile= xlsx.readFile(path.resolve(__dirname, config.fcFilePath))
    let stripeFile = xlsx.readFile(path.resolve(__dirname,config.stripeFilePath))
    
    // JSON Arrays of the sheet data
    let fcData = xlsx.utils.sheet_to_json(fcFile.Sheets[fcFile.SheetNames[0]])
    let stripeData = xlsx.utils.sheet_to_json(stripeFile.Sheets[stripeFile.SheetNames[0]])

    //console.log(fcData)
    //console.log (stripeData)
}

async function createDefaultTable(){
   // if (typeof sql !== 'undefined' && sql && sql != null){
    
   // }
    //else
     //console.error("SQL: " + sql)
}

connectToDb().catch(err=>{console.error(err)})
