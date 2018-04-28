var Koa = require('koa');
var Router = require('koa-router');
var mysql = require('koa2-mysql-wrapper');
const koaBody = require('koa-body');

var config = require('./config.json');

var app = new Koa();
var router = new Router();

async function cors(ctx, next) {
    await next();
    ctx.set('Access-Control-Allow-Origin', '*');
}
app.use(cors);
app.use(koaBody());
app.use(mysql({host:config.db_host, user: config.db_user, password: config.db_password, database: config.db_name}))

router.get('/area', async function(ctx, next) {
    try {
        // Execute a sample query (with params)
        let query = await ctx.myPool().query('SELECT * FROM stored_areas');

        // Output test result (3)
        ctx.body = query;
    }
    catch (err) {
        // 500 Internal Server Error
        console.log("Error: " + err);
        ctx.status = 500;
        ctx.body = { error: err };
    }
    await next();
});

router.post('/area', async function(ctx, next) {
    try {
        // Execute a sample query (with params)
        let query_s = "INSERT INTO stored_areas (id, data) VALUES(1, '" +  ctx.request.body + "') ON DUPLICATE KEY UPDATE data='" + ctx.request.body + "';";
        let query = await ctx.myPool().query(query_s);

        //console.log(query);
        // Output test result (3)
        console.log(query);
        ctx.body = query;
    }
    catch (err) {
        // 500 Internal Server Error
        console.log("Error: " + err);
        ctx.status = 500;
        ctx.body = { error: err };
    }
    await next();
});

app.use(router.routes())

app.listen(9100);