# koa-nunjucks1
Nunjunks rendering middleware for koa1

## Usage

```
var knj = require('koa-nunjucks1');
var koa = require('koa');

var app = koa();
app.use(knj({
  path:  './templates',
  extname: '.html',
  //other nunjunks options can be assigned here for nunjunks.Environment obj
}));
```


## License
MIT
