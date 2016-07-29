# koa-nunjucks1
Nunjunks rendering middleware for koa 1.x


## Usage

```
var koa = require('koa');
var knj = require('koa-nunjucks1');

var app = koa();
app.use(knj({
    path: __dirname + '/templates',
    extname: '.html'
    //other nunjunks options can be assigned here for nunjunks.Environment obj
}));
```

or

```
knj({
    path: __dirname + '/templates',
    extname: '.html'
}, app );
```

## License
MIT
