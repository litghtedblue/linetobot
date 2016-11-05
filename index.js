const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

const app = express();
app.set('port', (process.env.PORT || 5000));

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.json());

app.post('/', function(req, res) {
    var v=req.body;
    
    // リクエストボディを出力
    var d=dump(v);
    console.log(d);

    var text=v.events[0].message.text;
    console.log(text);
    var token=v.events[0].replyToken;
    console.log(token);

    v.events.forEach(function(num){
      var postpara={
        text:num.message.text,
        replyToken:num.replyToken
      }
      postLine(postpara);
    });
    
    res.send(d);
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function postLine(postpara){
  var request = require('request');
  var post={
      "replyToken":postpara.replyToken,
      "messages":[
          {
              "type":"text",
              "text":postpara.text
          },
      ]
  };

  var options = {
    uri: 'https://api.line.me/v2/bot/message/reply',
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization':"Bearer "+process.env.LINE_CHANNEL_ACCESS_TOKEN
    },
    json: post,
  };

  console.log(dump(options));

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log("line reply ok");
      console.log('line reply error: '+ dump(response.body));
    } else {
      console.log('line reply error: '+ response.statusCode);
      console.log('line reply error: '+ dump(response.body));
    }
  });

}
function dump(v){
  return util.inspect(v,false,null);
}
