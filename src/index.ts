var Koa = require('koa');
var Router = require('koa-router');
var mysql = require('koa2-mysql-wrapper');
const koaBody = require('koa-body');
var session = require('koa-session')

var config = require('../config.json');

var app = new Koa();
var router = new Router();

async function cors(ctx: any, next: any) {
    await next();
    ctx.set('Access-Control-Allow-Origin', '*');
}
app.use(cors);
app.use(koaBody());
app.use(mysql({host:config.db_host, 
    user: config.db_user,
    password: config.db_password,
    database: config.db_name}))

app.use(session(app))

router.get('/area', async function(ctx: any, next: any) {
    try {
        let result = await ctx.myPool().query('SELECT * FROM stored_areas');

        // Output test result (3)
        ctx.body = result;
    } catch (err) {
        // 500 Internal Server Error
        console.log("Error: " + err);
        ctx.status = 500;
        ctx.body = {
            error: err
        };
    }
    await next();
});

router.post('/area', async function(ctx: any, next: any) {
    try {
        // This is our SQL query script
        let query = "INSERT INTO stored_areas (id, data) VALUES(1, '" + ctx.request.body + "') ON DUPLICATE KEY UPDATE data='" + ctx.request.body + "';";

        let result = await ctx.myPool().query(query);

        console.log(result);
        ctx.body = result;
    } catch (err) {
        // 500 Internal Server Error
        console.log("Error: " + err);
        ctx.status = 500;
        ctx.body = {
            error: err
        };
    }
    await next();
});

app.use(router.routes())

app.listen(9100);