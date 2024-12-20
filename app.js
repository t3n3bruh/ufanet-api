//Подключение express и определение порта сервера
const express = require('express');
const port = 4221;
const app = express();
const http = require('http');

//Middleware для работы с json
app.use(express.json());

//Данные для соединения с домофоном
const intercom_ip = '192.168.1.193';
const intercom_port = 85;
const intercom_auth = 'Basic YWRtaW46MTIzNDU2'  //Логин и пароль в кодировке Base64

//Универсальная функция формирования запросов на изменение настроек
function customRequest(method, request, path) {

    const req = http.request({
        host: intercom_ip,
        port: intercom_port,
        path: path,
        method: method,
        headers: {
            'Authorization': intercom_auth, //Логин и пароль
            'Content-Type': 'application/json',
        }
    }, (res) => {
        console.log('Status: ' + res.statusCode);
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('end', function () {
            console.log('end of request');
        });
    });
    req.write(JSON.stringify(request.body));
    req.on('error', error => {
        console.log(error);
    });
    req.end();
};

function customGet(responce, path) {

    http.request({
        host: intercom_ip,
        port: intercom_port,
        path: path,
        method: 'GET',
        headers: {
            'Authorization': intercom_auth, //Логин и пароль
            'Accept': 'application/json'
        }
    }, (res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                responce.send(JSON.parse(body));    //Вывод json клиенту
            } catch (error) {
                console.error(error.message);
            };
        });        
    }).end();
};

/*========Конфигурация домофона========*/

//Получение конфигурации домофона
app.get('/api/v1/configuration', (req, res) => {
    customGet(res, '/api/v1/configuration');
});

//Запись конфигурации домофона
app.put('/api/v1/configuration', (req, res) => {
    customRequest('PUT', req, '/api/v1/configuration');
});

//Изменение конфигурации домофона
app.patch('/api/v1/configuration', (req, res) => {
    customRequest('PATCH', req, '/api/v1/configuration');
});

/*========Конфигурация квартир========*/

//Получение информации о квартирах
app.get('/api/v1/apartments', (req, res) => {
    customGet(res, '/api/v1/apartments');
});

//Запись информации о квартирах
app.put('/api/v1/apartments', (req, res) => {
    customRequest('PUT', req, '/api/v1/apartments');
});

//Получение информации о квартире
app.get('/api/v1/apartments/:id', (req, res) => {
    customGet(res, '/api/v1/apartments/' + req.params.id);
});

//Запись информации о квартире
app.put('/api/v1/apartments/:id', (req, res) => {
    customRequest('PUT', req, '/api/v1/apartments/' + req.params.id);
});

//Изменение информации о квартире
app.patch('/api/v1/apartments/:id', (req, res) => {
    customRequest('PATCH', req, '/api/v1/apartments/' + req.params.id);
});

//Создание квартиры
app.post('/api/v1/apartments/:id', (req, res) => {
    customRequest('POST', req, '/api/v1/apartments/' + req.params.id);
});

//Удаление квартиры
app.delete('/api/v1/apartments/:id', (req, res) => {
    customRequest('DELETE', req, '/api/v1/apartments/' + req.params.id);
});

/*========Конфигурация ключей========*/

//Получение информации о ключах
app.get('/api/v1/rfids', (req, res) => {
    customGet(res, '/api/v1/rfids');
});

//Запись информации о ключах
app.put('/api/v1/rfids', (req, res) => {
    customRequest('PUT', res, '/api/v1/rfids');
});

//Создание ключа
app.post('/api/v1/rfids/:id', (req, res) => {
    customRequest('POST', res, '/api/v1/rfids/' + req.params.id);
});

//Изменение ключа
app.put('/api/v1/rfids/:id', (req, res) => {
    customRequest('PUT', res, '/api/v1/rfids/' + req.params.id);
});

//Удаление ключа
app.delete('/api/v1/rfids/:id', (req, res) => {
    customRequest('DELETE', res, '/api/v1/rfids/' + req.params.id);
});



//Запуск сервера
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});