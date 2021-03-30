const http = require('spdy')
const url = require('url')
const fs = require('fs')
const express = require('express')
const path = require('path')

const app = express()

const options = {
	key: fs.readFileSync(path.join(__dirname, 'localhost+2-key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'localhost+2.pem')),
}

const allow = res => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
}

app.use(express.static(path.join(__dirname, 'static')))

app.get('/option/?', (req, res) => {
	allow(res)
	let size = req.query['size']
	let delay = req.query['delay']
	let reqFileType = req.query['reqFileType']
	let buf = new Buffer(size * 1024 * 1024)
	setTimeout(() => {
		if (reqFileType == 'image') {
			res.set('Content-Type', 'image/png')
			res.send(buf)
		} else {
			res.send(buf.toString('utf8'))
		}
	}, delay)
})

http.createServer(options, app).listen(1002, err => {
	// http2服务器端口为1002
	if (err) throw new Error(err)
	console.log('Http1.x server listening on port 1002.')
})
