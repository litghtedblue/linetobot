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

    v.events.forEach(function(num){
      var postpara={
        text:num.message.text,
        replyToken:num.replyToken
      }
      postReplyLine(postpara);
    });
    
    res.send(d);
});

app.post('/sender', function(req, res) {
    var v=req.body;
    
    // リクエストボディを出力
    var d=dump(v);
    var checkHeader=req.headers[process.env.REQ_ALLOW_HEAD];
    
    //console.log(dump(req.headers));
    console.log("request check header "+process.env.REQ_ALLOW_HEAD+":"+checkHeader);
    console.log(d);
    
    var reg = new RegExp(process.env.REQ_ALLOW_HEAD_REG);
    if (checkHeader==null || !checkHeader.match(reg)) {
      console.log("this request invalid header");
      res.send(d);
      return;
    }

    v.forEach(function(item){
      var postpara={
        text:item.text,
      }
      postPushLine(postpara); 
    });
        
    res.send(d);
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function postPushLine(postpara){
  var request = require('request');
  var post={
      "to":process.env.USER_ID,
      "messages":[
          {
              "type":"text",
              "text":postpara.text
          },
      ]
  };

  var options = {
    uri: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization':"Bearer "+process.env.LINE_CHANNEL_ACCESS_TOKEN
    },
    json: post,
  };

  console.log(dump(options));

  if(process.env.NODE_ENV=="development"){
    console.log("skip");
    return;
  }

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log("line reply ok");
      console.log('line reply body: '+ dump(response.body));
    } else {
      console.log('line reply error: '+ response.statusCode);
      console.log('line reply error: '+ dump(response.body));
    }
  });
}
function postReplyLine(postpara){
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

  if(process.env.NODE_ENV=="development"){
    console.log("skip");
    return;
  }
  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log("line reply ok");
      console.log('line reply body: '+ dump(response.body));
    } else {
      console.log('line reply error: '+ response.statusCode);
      console.log('line reply error: '+ dump(response.body));
    }
  });
}
function dump(v){
  return util.inspect(v,false,null);
}
