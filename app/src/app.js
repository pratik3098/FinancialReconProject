const Client = require('pg').Client
const xlsx = require('xlsx')
const path =require('path')
const config= {
    database: 'fin-rec-db',
    user: 'facedrive',
    password: 'somepass',
    port: 5432,
    //host: 'localhost'
    // For docker toolbox
    host: '192.168.99.100'
}

const sql=new Client(config)
//const sql = postgres('postgres://'+config.user+':'+config.password+'@'+config.host+':'+config.port+'/'+config.database, config)
sql.connect().then(()=>{ console.log(config.database +" connected successfuly @" +config.host+'/'+config.port)}).catch(err=>{console.error(err)})

let fc_file= xlsx.readFile(path.resolve(__dirname,"./fc_data.xlsx"))
let stripe_file = xlsx.readFile(path.resolve(__dirname,'./stripe_data.xlsx'))

// JSON Arrays of the sheet data
let fc_data = xlsx.utils.sheet_to_json(fc_file.Sheets[fc_file.SheetNames[0]])
let stripe_data = xlsx.utils.sheet_to_json(stripe_file.Sheets[stripe_file.SheetNames[0]])

//console.log(fc_data)
//console.log(stripe_data)

/*async function createTable(){
    await sql`
    CREATE TABLE facedrive (
        ride_id                   VARCHAR(35) PRIMARY KEY,
        ride_created              TIMESTAMP NOT NULL,
        ride_status               VARCHAR(20) CHECK (ride_status IN (NOT_ACCEPTED, FAILED, FINISHED, CANCELLED_BY_DRIVER, CANCELLED_REQUEST ) ) NOT NULL,
        ride_region               VARCHAR(15) NOT NULL,
        rp_client_pay             INTEGER,
        rp_facedrive_fee          INTEGER,
        rp_ride_status            VARCHAR(6) CHECK (rp_ride_status IN (PAID, FAILED)),
        rp_toll_roads             VARCHAR(20),
        rp_carbon_offset          INTEGER, 
        rp_driver_earnings        INTEGER,
        rp_driver_tax             INTEGER,
        rp_client_tax             INTEGER,
        rp_base_fare              INTEGER,
        rp_facedrive_fee          INTEGER,
        up_client_pay             INTEGER,
        up_facedrive_fee          INTEGER,
        up_tips                   INTEGER,
        up_payment_status         VARCHAR(6) CHECK (up_payment_staus IN (PAID, FAILED)),
        stripe_reserve_charge_id  VARCHAR(27) UNIQUE,
        amount_charged_id         VARCHAR(27) UNIQUE,
        up_amount_charged         INTEGER,
        coupon_name               VARCHAR(20),
        coupoun_dollar_off        INTEGER,
        coupon_percent_off        INTEGER,
        coupon_applied_status     VARCHAR(9) CHECK (coupon_applied_status IN (succeeded)),
        coupon_amount_charged     INTEGER
    );
   `
}


/*createTable().then(res=>{
    console.log(res)
}).catch(err=>{console.error(err)})
*/