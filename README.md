
# Миграция на съществуващ NodeJS проект към StartApp.bg

#### 1. Клонираме проект на лоаклния си компютър

Това, може да е всеки един ваш проект. В нашия случай това е много простичък проект, който
изписва `Hello World`, когато заредите `/` пътя.

```bash
git clone https://github.com/StartappTemplates/existing_expressjs.git
```

#### 2. Инсталираме си пакетите дефинирани в `package.json`

```bash
npm install
```

#### 3. Стартираме приложението за да се уверим, че работи коректно.

```bash
node server.js
```

Този ред стартира сървър, който ще работи на `localhost` и ще слуша на порт `3000`. За да видите дали работи коректно, отворете
`http://localhost:3000/` във браузъра си и ако видиш `Hello World`, значи всичко е нормално.

#### 4.  Създаване на NodeJS приложение в StartApp.bg

Преди малко подкарахме `NodeJS` сървъра на локалната си машина. Сега е на ред да го накараме да заработи на StartApp.bg
За целта създаваме едно обикновенно `NodeJS` приложение, което в нашия случай е версия `0.10` и се казва `mynodejs`

Подробни инструкции можете да намерите в: [NodeJS документацията на StartApp](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#env-vars)

```bash
app create mynodejs nodejs-0.10 --no-git
```

Аргументът `--no-git` казва на StartApp да не клонира новосъздаденото приложение на компютъра след като го създаде.


#### 5. Добавяне на задължителни директории и файлове за да работи на сървърите на StartApp.bg

```bash
sh <(curl -s http://install.opensource.sh/sappio/dot) -a mynodejs
```

На кратко този скрипт създава една скрита директория `.openshift`, която се изпозлва служебно от StartApp, а също така и за различни автоматизации, които можете да си правите посредством [Action Hooks](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#action-hooks). Ако сте запознати с Git и `.openshift` директорията за StartApp е като `.git` директорията за Git.


#### 6.Промени на `server.js`

Както вече видяхме, след като стартираме, `server.js` той тръгва на `localhost` и на порт `3000`. Понеже на сървърите на StartApp порт `3000` на `localhost` най-вероятно е зает от друго приложение, затова StartApp се грижи да осигурява оникално `IP` и `PORT` за всяко едно приложениет. Информацията за `IP` и `PORT` се записват в  Environment променливи на сървъра със следните имена: 

- `OPENSHIFT_NODEJS_IP`
- `OPENSHIFT_NODEJS_PORT`

Повече информация за Environment променливите за NodeJS можете да намерите тук: [Environemnt променливи в StartApp](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#env-vars)

###### Редактиране на файла `server.js` от:

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

###### Става по следния начин:

```js
var express = require('express')
var app = express()

# Така дефинирани, означава, че
# на локалния компютър ще работи на localhost:3000
# а на сървъра, ще работи служебно_ip:служебжен_port
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

