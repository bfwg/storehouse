module.exports.home_index = function * () {
    var sql = "SELECT * FROM student WHERE sex ='F'";
    var result = yield global.connectionPool.query(sql);
    yield this.render('content', {
        result: result
    });
}

module.exports.user_id = function * () {
    var sql = "SELECT * FROM student WHERE first_name = '"+this.params.user_id+"'";
    var detail = yield global.connectionPool.query(sql);
    console.log(detail);
    yield this.render('user_id', {
        detail: detail[0]
    });
}