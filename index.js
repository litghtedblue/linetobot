const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

const app = express();
app.set('port', (process.env.PORT || 5000));

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
    var v=req.body;
    // リクエストボディを出力
    dump(v);
    res.send(util.inspect(v));
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function dump(v){
  console.log(util.inspect(v,false,null));
}
