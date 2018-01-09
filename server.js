const http = require('http');
const PORT = 8000;
const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs = require('fs');

let storedFeedbacks =fs.readFileSync('./data/feedback.json','utf8');
storedFeedbacks = JSON.parse(storedFeedbacks);
let registered_users =[{userName:'rahul', name:'Rahul'},
                       {userName:'vish', name:'Vishal'}];

let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let getContentType=function(file){
  let fileDetails = file.split('.');
  let extension = fileDetails[1];
  let mimeType={
    "html" : "text/html",
    "css" : "text/css",
    "jpg" : "img/jpg",
    "gif" : "img/gif",
    "js" : "text/javascript"
  }
  return mimeType[extension];
}

let readFile=function(file,res){
  fs.readFile(file,(err,data)=>{
    if(err){
      handleError(res);
    }else{
      res.setHeader('Content-Type',getContentType(req.url));
      res.write(data);
      res.end();
    }
  });
}

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(getContentType);

let handleError = function(res) {
  res.write("NOT FOUND");
  res.statusCode = 404;
  res.end();
}

let servePage=function(req,res){
  app(req,res);
  let file = './public'+req.url;
  app.get(req.url,(req,res)=>{
    let data="";
    console.log(req.cookies.sessionid);
    if(!req.cookies.sessionid && req.url=='/guestBook.html'){
      res.redirect('/login.html');
      return;
    }
    readFile()
  });

  app.post(req.url,(req,res)=>{
    let user = registered_users.find(u=>u.userName==req.body.userName);
    console.log("========>",user);
    if(!user) {
      res.setHeader('Set-Cookie',`logInFailed=true`);
      res.redirect('/login.html');
      return;
    }
    let sessionid = new Date().getTime();
    res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
    user.sessionid = sessionid;
    res.write(data);
    res.end();
  });

  app.get('/logout.html',(req,res)=>{
    if(!req.cookies.sessionid){
      res.redirect('/login.html');
      return;
    }
  res.setHeader('Set-Cookie',[`logInFailed=false; Expires=${new Date(1).toUTCString()}`,`sessionid=0; Expires=${new Date(1).toUTCString()}`]);
  res.redirect('/login.html');
  });
}

let server=http.createServer(servePage);
server.listen(PORT);
console.log(`listening on ${PORT}`);
