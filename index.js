/*
 * koa 中间件
 * nunjucks 模板后缀名，全局变量
 *
 *
 * */


var nunjucks = require("nunjucks");

module.exports = function( opt ) {
    var options = Object.assign({
        autoescape: true, //(默认值: true) 控制输出是否被转义，查看 Autoescaping
        //throwOnUndefined (default: false) 当输出为 null 或 undefined 会抛出异常
        trimBlocks: true, //(default: false) 自动去除 block/tag 后面的换行符
        lstripBlocks: true, //(default: false) 自动去除 block/tag 签名的空格
        //watch (默认值: false) 当模板变化时重新加载
        //noCache (default: false) 不使用缓存，每次都重新编译

        //other nunjunks options can be assigned here for nunjunks.Environment obj
    }, opt);
    var env = nunjucks.configure( options.path, options );
    //传入 path 指定存放模板的目录，opts 可让某些功能开启或关闭，这两个变量都是可选的。path 的默认值为当前的工作目录，opts 提供以下功能：

    return function*(next) {
        this.nunjucks = env;
        this.render = function(name, data){
            var ctx = this;
            var viewData = Object.assign({}, ctx.state||{}, ctx.locals || {}, data);
            name = name + ( options.extname || '');

            var defer = Promise.defer();
            env.render(name, viewData, function (e, res) {
                if(e) {
                    defer.reject( e );
                }
                ctx.body = res;
                defer.resolve( next ); // TO DO
            });

            return defer.promise;
        };

        yield next;
    };
};
