
# Миграция на съществуващ NodeJS проект към StartApp.bg

#### 1. Клонирай проекта си на лоаклния компютър

Това, може да е всеки един товй проект. В нашия случай това е много простичък проект, който
изписва `Hello World`, когато заредите `/` пътя.

```bash
git clone https://github.com/StartappTemplates/existing_expressjs.git
```

#### 2. Инсталирай си пакетите дефинирани в `package.json`

```bash
npm install
```

#### 3. Стартирай приложението за да се увериш, че работи коректно.

```bash
node server.js
```

Горния ред стартира сървър, който ще работи на `localhost` и ще слуша на порт `3000`. За да видиш дали работи коректно, отвори
`http://localhost:3000/` в браузъра си и ако видиш `Hello World`, значи всичко е нормално :).

#### 4. Създай NodeJS приложение в StartApp.bg

Преди малко подакара `NodeJS` сървъра на локалната си машина. Сега е на ред да го накарш да заработи на StartApp.bg
За целта създай едно обикновенно `NodeJS` приложение, което в този случай е версия `0.10` и се казва `mynodejs`

Подробни инструкции можеш да намериш в: [NodeJS документацията на StartApp](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#env-vars)

```bash
app create mynodejs nodejs-0.10 --no-git
```

Аргументът `--no-git` казва на StartApp да не клонира новосъздаденото приложение на компютъра след като го създаде.


#### 5. Добавяне на задължителни директории и файлове за да работи на сървърите на StartApp.bg

```bash
sh <(curl -s http://install.opensource.sh/sappio/dot) -a mynodejs
```

На кратко този скрипт създава една скрита директория `.openshift`, която се изпозлва служебно от StartApp. Директорията `.openshift` също така се използва и за различни автоматизации, които можеш да си направиш благодарение на [Action Hooks](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#action-hooks). Ако си запознат с Git тогава знай, че `.openshift` директорията за StartApp е като `.git` директорията за Git.


#### 6.Промени `server.js` файла

Както вече видя, след като старитра, `server.js` той тръгва на `localhost` и на порт `3000`. Понеже на сървърите на StartApp порт `3000` на `localhost` най-вероятно е зает от друго приложение, затова StartApp се грижи да осигурява служебно уникално `IP` и `PORT` за всяко едно приложение. Информацията за `IP` и `PORT` се записват в  Environment променливи на сървъра със следните имена: 

- `OPENSHIFT_NODEJS_IP`
- `OPENSHIFT_NODEJS_PORT`

Повече информация за Environment променливите на NodeJS приложения в StartApp, орвори тук: [NodeJS Environemnt променливи в StartApp](http://docs.startapp.bg/getting-started/startapp-with-nodejs.html#env-vars)


###### Редактирай файла `server.js` от:

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

###### Да стане така:

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

#### 7. Качи на сървъра

```bash
git add .
git commit -m "Chnages for StartApp"
git push startapp master -f
```

Това е :) Честито.
