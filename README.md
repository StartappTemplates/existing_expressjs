
# Клониране на проекта

git clone https://github.com/StartappTemplates/existing_expressjs.git

npm install

node server.js

# Създаване на NodeJS приложение в StartApp.bg

app create mynodejs nodejs-0.10 --no-git

Добавяне на задължителни директории и файлове за да работи на сървърите на StartApp.bg

sh <(curl -s http://install.opensource.sh/sappio/dot) -a mynodejs
!да обясня накратко какво прави този скрипт

# Промяна на `server.js` за да се стартира сървъра коректно.

След като се качи проекта на StartApp.bg се NodeJS сървъра трябва да се стартира на оперелно `IP` и `PORT`.
За всяко NodeJS приложение те са уникални. Информацията за `IP` и `PORT` се намират в следните Environment променливи:
``

Повече информация за Environment променливите за NodeJS можете да намерите тук: http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#env-vars

Редактиране на файла `server.js` от:

```js
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
```

Става по следния начин:

```js
var express = require('express')
var app = express()

var server_ip    = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
    server_port  = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var server = app.listen(server_port, server_ip, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
```

