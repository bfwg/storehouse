var app = require('koa')();
var router = require('koa-router')();
var render = require('koa-ejs');
var path = require('path');
var serve = require('koa-static');
var wrapper = require('co-mysql');
var mysql = require('mysql');
// Serve static files
app.use(serve(path.join(__dirname, 'public')));


//data base connection
var pool = mysql.createPool({
    user: 'root',
    database: 'test',
    password: 'root'
});
global.connectionPool = wrapper(pool);


//ejs render
render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});


//routers
var homeRouter = require('./routes/home');

router.get('/', homeRouter.home_index);
router.get('/index.html', homeRouter.home_index);
router.get('/:user_id.html', homeRouter.user_id)
app.use(router.routes());

console.log("The server is up and running");
app.listen(7001);



