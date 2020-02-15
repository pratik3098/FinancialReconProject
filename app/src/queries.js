exports.rideStatus= `CREATE TYPE  rideStatus AS ENUM ('NOT_ACCEPTED','NO_ACCEPT', 'FAILED', 'FINISHED', 'CANCELLED_BY_DRIVER', 'CANCELLED_REQUEST', 'ON_THE_WAY','REQUESTED','STARTED','CANCELLED_BY_CLIENT' )`
exports.rprideStatus= `CREATE TYPE  rprideStatus AS ENUM ('PAID', 'FAILED', 'READY_TO_PAY' ,'RESERVED')`
exports.uppaymentStatus = `CREATE TYPE  uppaymentStatus AS ENUM ('PAID', 'FAILED','RESERVED', 'READY_TO_PAY')`
exports.couponAppliedStatus = `CREATE TYPE  couponAppliedStatus AS ENUM ('succeeded')`
exports.createFacedriveTable= `CREATE TABLE facedrive ( 
    ride_id                   VARCHAR(36) PRIMARY KEY,
    ride_created              TIMESTAMP NOT NULL,
    ride_status               rideStatus NOT NULL,
    ride_region               VARCHAR(15) NOT NULL,
    rp_client_pay             INTEGER,
    rp_facedrive_fee          INTEGER,
    rp_ride_status            rprideStatus,
    rp_toll_roads             VARCHAR(20),
    rp_carbon_offset          INTEGER, 
    rp_driver_earnings        INTEGER,
    rp_driver_tax             INTEGER,
    rp_client_tax             INTEGER,
    rp_base_fare              INTEGER,
    rp_facedrive_fee_perc     INTEGER,
    up_client_pay             INTEGER,
    up_facedrive_fee          INTEGER,
    up_tips                   INTEGER,
    up_payment_status         uppaymentStatus,
    stripe_reserve_charge_id  VARCHAR(27) UNIQUE,
    amount_charged_id         VARCHAR(27) UNIQUE,
    up_amount_charged         INTEGER,
    coupon_name               VARCHAR(20),
    coupoun_dollar_off        INTEGER,
    coupon_percent_off        INTEGER,
    coupon_applied_status     couponAppliedStatus,
    coupon_amount_charged     INTEGER
);`
exports.facedriveInsertIntoAll= `INSERT INTO facedrive (ride_id, ride_created, ride_status, ride_region, rp_client_pay, rp_facedrive_fee ,
    rp_ride_status, rp_toll_roads, rp_carbon_offset, rp_driver_earnings, rp_driver_tax, rp_client_tax, rp_base_fare, up_client_pay,
    up_tips, up_payment_status, stripe_reserve_charge_id , amount_charged_id, up_amount_charged, coupon_name , coupoun_dollar_off,coupon_percent_off,
    coupon_applied_status, coupon_amount_charged) VALUES ();`

exports.stripetxnType=  `CREATE TYPE  stripetxnType AS ENUM ('refund','transfer','charge','reverse_transcation')`
exports.stripecurrencyType=  `CREATE TYPE  stripecurrencyType AS ENUM ('cad','usd')`

exports.createStripeTable = `CREATE TABLE  stripe ( 
    id                        VARCHAR(27) PRIMARY KEY,
    type                      stripetxnType  NOT NULL,
    source                    VARCHAR(27) NOT NULL,
    amount                    NUMERIC (3, 2) NOT NULL  DEFAULT 0,
    fee                       NUMERIC(3,2) NOT NULL DEFAULT 0,
    net                       NUMERIC(3,2) NOT NULL DEFAULT 0,
    currency                  stripecurrencyType NOT NULL,
    created                   TIMESTAMP NOT NULL,
    availableOn               TIMESTAMP NOT NULL,
    timezone                  VARCHAR(3) DEFAULT('UTC')
);`