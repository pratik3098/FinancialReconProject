exports.rideStatus= `CREATE TYPE  rideStatus AS ENUM ('NOT_ACCEPTED','NO_ACCEPT', 'FAILED', 'FINISHED', 'CANCELLED_BY_DRIVER', 'CANCELLED_REQUEST', 'ON_THE_WAY','REQUESTED','STARTED','CANCELLED_BY_CLIENT' ) `
exports.rprideStatus= `CREATE TYPE  rprideStatus AS ENUM ('NULL','PAID', 'FAILED', 'READY_TO_PAY' ,'RESERVED') `
exports.uppaymentStatus = `CREATE TYPE  uppaymentStatus AS ENUM ('NULL','PAID', 'FAILED','RESERVED', 'READY_TO_PAY') `
exports.couponAppliedStatus = `CREATE TYPE  couponAppliedStatus AS ENUM ('NULL','succeeded') `
exports.close=`);`
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
    up_facedrive_fee          NUMERIC,
    up_tips                   INTEGER,
    up_payment_status         uppaymentStatus ,
    stripe_reserve_charge_id  VARCHAR(28),
    amount_charged_id         VARCHAR(28),
    up_amount_charged         NUMERIC DEFAULT 0,
    coupon_name               VARCHAR(20),
    coupoun_dollar_off        INTEGER,
    coupon_percent_off        INTEGER,
    coupon_applied_status     couponAppliedStatus,
    coupon_amount_charged     INTEGER
);`
exports.facedriveInsertIntoAll= `INSERT INTO facedrive (ride_id, ride_created, ride_status, ride_region, rp_client_pay, rp_facedrive_fee ,
    rp_ride_status, rp_toll_roads, rp_carbon_offset, rp_driver_earnings, rp_driver_tax, rp_client_tax, rp_base_fare,rp_facedrive_fee_perc, up_client_pay, up_facedrive_fee,
    up_tips, up_payment_status, stripe_reserve_charge_id , amount_charged_id, up_amount_charged, coupon_name , coupoun_dollar_off,coupon_percent_off,
    coupon_applied_status, coupon_amount_charged) VALUES (`



exports.stripetxnType=  `CREATE TYPE  stripetxnType AS ENUM ('stripe_fee','refund','transfer','charge','reserve_transaction','transfer_refund', 'payout','adjustment')`
exports.stripecurrencyType=  `CREATE TYPE  stripecurrencyType AS ENUM ('cad','usd')`

exports.createStripeTable = `CREATE TABLE  stripe ( 
    id                        VARCHAR(28) PRIMARY KEY,
    type                      stripetxnType  NOT NULL,
    source                    VARCHAR(28) NOT NULL,
    amount                    NUMERIC NOT NULL  DEFAULT 0,
    fee                       NUMERIC NOT NULL DEFAULT 0,
    net                       NUMERIC NOT NULL DEFAULT 0,
    currency                  stripecurrencyType NOT NULL,
    created_utc               TIMESTAMP NOT NULL,
    availableOn_utc           TIMESTAMP NOT NULL
);`

exports.stripeInsertIntoAll = ` INSERT INTO stripe(id, type, source, amount, fee , net, currency, created_utc, availableOn_utc) VALUES (`
exports.dataWithInconsistencyOld= `select ride_id, amount_charged_id, fee, up_facedrive_fee,  amount, up_amount_charged  from facedrive join stripe on (stripe.source = facedrive.amount_charged_id and (stripe.amount <> facedrive.up_amount_charged or  stripe.fee <> facedrive.up_facedrive_fee));`


exports.disrepencyStatus= `CREATE TYPE  disrepencyStatus AS ENUM ('new', 'reconcile rejected'); `
exports.disrepencyDescription = `CREATE TYPE disrepencyDescription As ENUM ('no disrepency', 'amount mis-match', 'exists in App Only', 'exists in Stripe Only');`
exports.createDisrepencyTable = ` CREATE TABLE disrepency (
    Discrepency_ID     SERIAL PRIMARY KEY,
    Stripe_Charge_ID   VARCHAR(28) NOT NULL,
    Status             disrepencyStatus DEFAULT 'new',
    Description        disrepencyDescription DEFAULT 'no disrepency',
    Notes              VARCHAR(100),
    Stripe_Amount      NUMERIC NOT NULL DEFAULT 0,
    FD_Amount          NUMERIC NOT NULL DEFAULT 0,
    Desrepency_Amount  NUMERIC NOT NULL DEFAULT 0,
    Date               TIMESTAMP NOT NULL
);`



exports.maxDate= `SELECT max (Date) From disrepency;`
exports.minDate= `SELECT min (Date) From disrepency;`
exports.disrepency =`select (facedrive.up_amount_charged- stripe.amount) as Dis from facedrive,stripe;`
exports.disrepencyInsertInto=`insert into disrepency (Discrepency_ID, Stripe_Charge_ID, Status, Description, Notes, Stripe_Amount, FD_Amount, Desrepency_Amount, Date) Values('706f8f26-7a48-40bf-bd0a-5c1950c41f5','txn_1GBA7kEG0OJcP9w4Cx9F2t8','new', 'no disrepency', NULL, 12,14,2,'2008-01-01 00:00:01' );`
exports.updateStatusDesc= `update disrepency SET Status='new', Description='amount mis-match' where (Desrepency_Amount > 0); `
exports.updateStatustorejected=`update disrepency SET Status='reconcile rejected' where ( Discrepency_ID = `
exports.updateStatutonew=`update disrepency SET Status='new' where ( Discrepency_ID = `
exports.updateNotes=`update disrepency SET notes = ` + ` where ( Discrepency_ID = `
exports.getdetailByID = `select * from disrepency where Discrepency_ID= `
exports.dataWithInconsistency = `select * from discrepency where date >= ` 


exports.insertAllData = `insert into disrepency (Stripe_Charge_ID, Status, Description, Notes, Stripe_Amount, FD_Amount, Desrepency_Amount, Date) select  (stripe.id) as Stripe_Charge_ID, ('new') as Status , ('amount mis-match') as Description, (' ') as Notes, stripe.amount, facedrive.up_amount_charged, (CAST (facedrive.up_amount_charged - stripe.amount  as int)) as Desrepency_Amount,  (stripe.created_utc) as Date from facedrive,stripe where ((facedrive.up_amount_charged - stripe.amount ) > 0) and facedrive.amount_charged_id = stripe.source;`

exports.updateDesFD= `update disrepency set FD_AMOUNT = NULL, Description = 'exists in Stripe Only' where EXISTS (select up_amount_charged from facedrive where up_amount_charged = NULL and facedrive.amount_charged_id = disrepency.Stripe_Charge_ID);`

exports.updateDesStripe= `update disrepency set Stripe_AMOUNT = NULL, Description = 'exists in App Only' where EXISTS (select amount from stripe where amount = NULL and stripe.source = disrepency.Stripe_Charge_ID);`

