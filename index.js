var express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('port', (process.env.PORT || 5000));

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
    // リクエストボディを出力
    console.log(req.body);
    res.send('ok');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});