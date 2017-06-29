const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')

const app = express()
app.use(express.static(__dirname+'/dist'))
app.use(bodyParser())

app.get('/api/search', (req, res)=>{
  const steamlines = {
    PABV: `https://www.pilship.com/shared/ajax/?fn=get_tracktrace_bl&ref_num=${req.query.bn}`
  }
  var url = steamlines[req.query.prefix];
  https.get(url, (resp)=>{
    var body = '';
    resp.on('data', (chunk)=>{
      body += chunk;
    })
    resp.on('end', ()=>{
      res.send(body);
    })
  })
})

app.get('*', function(req, res) {
  res.sendFile(__dirname+'/dist/index.html')
});

app.listen(80)
