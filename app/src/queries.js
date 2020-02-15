exports.rideStatus= `CREATE TYPE rideStatus AS ENUM ('NOT_ACCEPTED', 'FAILED', 'FINISHED', 'CANCELLED_BY_DRIVER', 'CANCELLED_REQUEST' )`
exports.rprideStatus= `CREATE TYPE rprideStatus AS ENUM ('PAID', 'FAILED' )`
exports.uppaymentStatus = `CREATE TYPE uppaymentStatus AS ENUM ('PAID', 'FAILED' )`
exports.couponAppliedStatus = `CREATE TYPE couponAppliedStatus AS ENUM ('succeeded')`
exports.createTable= `CREATE TABLE facedrive ( 
    ride_id                   VARCHAR(35) PRIMARY KEY,
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
    up_client_pay             INTEGER,
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