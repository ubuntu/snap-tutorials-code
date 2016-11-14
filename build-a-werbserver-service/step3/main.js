#!/usr/bin/env node

const http = require('http'),
      Chuck  = require('chucknorris-io'),
      client = new Chuck();

// Let's define a port we want to listen to
const PORT = 80;

const html = `
<header>
  <title>My local chuck nodejs web server</title>
  <link rel="icon" type="image/png" href="ICON" />
  <style>
    img {
      display: inline;
      transform: scaleX(-1);
    }

    .quote {
      position:relative;
      padding:15px;
      margin:1em 0 3em;
      color:#fff;
      margin-left:40px;
      background:linear-gradient(#e96d20, #e95420);
      border-radius:10px;
    }
    .quote:after {
      content:"";
      position:absolute;
      bottom:-20px;
      top:16px;
      left:-40px;
      border-style:solid;
      bottom:auto;
      border-width:15px 40px 0 0;
      border-color:transparent #e95420;
    }
  </style>
</header>
<body>
    <div>
        <img src="IMGSRC" align="middle" />
        <span class="quote">QUOTE</span>
    </div>
    </div>(Quote provided by <a href="https://api.chucknorris.io/">chucknorris.io</a>.)</div>
</body>
`;

function handleRequest(request, response){
    response.writeHeader(200, {"Content-Type": "text/html"});
    if (request.url === "/favicon.ico") {
        response.end();
        return;
    }
    client.getRandomJoke('dev').then(function (joke) { 
        var msg = html.replace('ICON', joke.iconUrl).replace('IMGSRC', joke.iconUrl).replace('QUOTE', joke.value);
        response.end(msg);
        console.log(`Quoted ${joke.sourceUrl}`);
    }).catch(function (err) {
        var joke = `I can't connect to chucknorris.io. Offering you a network-related joke then: Chuck Norris's OSI network model has only one layer - Physical.`;
        var msg = html.replace('QUOTE', joke);
        response.end(msg);
        console.log(`Used generic quote as couldn't connect to service: ${err}`);
    });    
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
