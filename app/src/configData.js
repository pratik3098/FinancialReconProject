exports.dbConfig ={
    database: 'fin-rec-db',
    user: 'facedrive',
    password: 'somepass',
    port: 5432,
    //host: 'localhost'
    // For docker toolbox
    host: '192.168.99.100'
}

exports.fcFilePath= "./fc_data.xlsx"
exports.stripeFilePath ="./stripe_data.xlsx"