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
    let db = new Client(dbConfig)
    sql =await db.connect()
    console.log(dbConfig.database +"@" +dbConfig.host+'/'+dbConfig.port + " connected successfuly")
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
       sql = await sql.query(queries.createTable)
   // }
    //else
     //console.error("SQL: " + sql)
}

Promise.resolve(connectToDb().catch(err=>{console.error(err)})).then(
createDefaultTable().catch(err=>{console.error(err)}))
//readDataFromExcel().catch(err=>{console.error(err)})
