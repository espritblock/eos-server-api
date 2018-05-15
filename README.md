# Eos-api

eos api server

## QuickStart

install node version > 8.x

see https://nodejs.org/en/

install eos node server

see https://github.com/espritblock/eos.git

use eosjs see https://github.com/EOSIO/eosjs.git 

see egg see https://github.com/eggjs/egg.git

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### config

```bash

editor app/controller/home.js

pk

eosServer

mainAccount

```

### eos api

```bash

签名校验

POST http://localhost:7001/sign/verify 

创建账户

POST http://localhost:7001/account/create

转账

POST http://localhost:7001/transfer

查询账户

GET http://localhost:7001/account/info/:account

查询余额

GET http://localhost:7001/balance/:contract/:account

交易查询

GET http://localhost:7001/transactions/:name/:page/:size


```