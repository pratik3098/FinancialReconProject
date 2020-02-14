const postgres = require('postgres')
const xlsx = require('xlsx')
const path =require('path')

const config= {
    database: 'fin-rec',
    user: 'postgres',
    password: 'somepass',
    port: 5432,
    host: 'localhost'
}
const client = postgres(config)
console.log(client)

let fc_file= xlsx.readFile(path.resolve(__dirname,"./fc_data.xlsx"))
let stripe_file = xlsx.readFile(path.resolve(__dirname,'./stripe_data.xlsx'))

// JSON Arrays of the sheet data
let fc_data = xlsx.utils.sheet_to_json(fc_file.Sheets[fc_file.SheetNames[0]])
let stripe_data = xlsx.utils.sheet_to_json(stripe_file.Sheets[stripe_file.SheetNames[0]])

//console.log(fc_data)
//console.log(stripe_data)
