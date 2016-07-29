"use strict";
/**
 * Nunjunks rendering middleware for koa 1.x
 *
 * @module KoaNunjucks
 * @copyright (c) 2016 HeChangLin.
 * @licence MIT
 */
var nunjucks = require("nunjucks");
var default_opt = {
    //extname: '',             // default extension name of template file
    //path: '.',               // path defaults to the current working directory

    //nunjunks options can be assigned here for nunjunks.Environment obj

    //autoescape: true,        // controls if output with dangerous characters are escaped automatically.
    //throwOnUndefined: false, // throw errors when outputting a null/undefined value
    //trimBlocks: false,       // automatically remove trailing newlines from a block/tag
    //lstripBlocks: false,     // automatically remove leading whitespace from a block/tag
    //watch: false,            // reload templates when they are changed (server-side)
    //noCachet: false,         // never use a cache and recompile templates each time (server-side)
    //tags: see nunjucks syntax , defines the syntax for nunjucks tags.
}

/**
 * koa-nunjucks1
 *
 * @param {object} opt - Options
 * @param {object} [app] - Koa application
 */
var njk = function njk ( opt, app ) {
    var options = Object.assign(default_opt, opt);
    var env = nunjucks.configure( options.path, options );
    if( app && app.context ){
        app.context.nunjucks = env;
        app.context.render = function(name, data){
            var ctx = this;
            var viewData = Object.assign({}, ctx.state||{}, ctx.locals || {}, data);
            name = name + ( options.extname || '');
            var defer = Promise.defer();
            env.render(name, viewData, function (e, res) {
                if(e) {
                    defer.reject( e );
                }
                ctx.body = res;
                defer.resolve();
            });
            return defer.promise;
        };
        return function*(next) {yield next;};
    }

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
                defer.resolve();
            });
            return defer.promise;
        };
        yield next;
    };
};


module.exports = njk;