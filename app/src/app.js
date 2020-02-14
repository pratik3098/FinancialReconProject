const postgres = require('postgres')

const config= {
    database: 'fin-rec',
    user: 'postgres',
    password: 'somepass',
    port: 5432,
    host: 'localhost'
}

const client = postgres(config)

console.log(client)


