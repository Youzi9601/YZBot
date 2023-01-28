const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('一個欺騙 Heroku 的假服務器 uwu');
});
const keepalive = () => {
    console.log('一個欺騙 Heroku 的假服務器啟動！')
    app.listen(port, '0.0.0.0', function () {
        // console.log(`服務器監聽端口 ${port}\n`);
    });
};
module.exports.keepalive = keepalive;
