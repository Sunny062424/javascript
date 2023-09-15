var express = require('express');
var app = express();
var http = require('http');
var app = express();
var server = http.createServer(app).listen(9191);


const request = require("request");
const cheerio = require("cheerio");
const exceljs = require("exceljs");
const filesaver = require("file-saver");

scrapingResult = [];

menuList = [];


app.get('/main', function (req, res) {
	res.sendFile(__dirname + '/main.html');
});


function getData() {
    scrapingResult = [];
    request("https://www.kopo.ac.kr/kangseo/content.do?menu=262", function (err, res, body) {
        const $ = cheerio.load(body);
        for (let i = 1; i < 6; i++) {
            let menu = $('#contents > div > div.meal_box > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3) > span').text();
            let menuSplit = menu.split(', [')[0].split(',');
            for( j = 0; j < menuSplit.length; j++){
                scrapingResult.push(menuSplit[j]);
            }
            menuList.push(scrapingResult);
            scrapingResult = []; //배열 초기화 시켜야 중복 프린트 안됨
        }
    });
}

getData();

app.get('/getList', function (req, res) {
      return res.send(menuList);
});

app.use(express.json())

app.post('/excelFile', (req, res) => {
    // 클라이언트에서 보낸 JSON 데이터를 파싱합니다.
    const receivedData = req.body;

    // 여기에서 receivedData를 사용하여 작업을 수행하거나 응답

    // 예: 데이터를 로그에 출력
    console.log('받은 데이터:', receivedData);

    // 클라이언트에 응답을 보냅니다.
    res.status(200).json({ message: '데이터를 성공적으로 받았습니다.' });
});