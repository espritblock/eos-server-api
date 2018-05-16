# Eos-api

eos api server upgrade to dawn4

## QuickStart

install node version > 8.x

see https://nodejs.org/en/

install eos node server

see https://github.com/espritblock/eos.git

### USE LIB

eosjs https://github.com/EOSIO/eosjs.git 

egg  https://github.com/eggjs/egg.git

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

创建私钥

curl -i -X POST http://localhost:7001/createKey -d seed=abc

签名校验

curl -i -X POST http://localhost:7001/sign/verify -d sign=aaa -d src=aaa -d pubkey=aaa

创建账户

curl -i -X POST http://localhost:7001/account/create -d username=aaa -d active=aaa -d onwer=aaa

转账

curl -i -X POST http://localhost:7001/transfer -d to=eosio -d quantity='1.0000 ABC' -d mome=aaa

查询账户

curl http://localhost:7001/account/info/eosio

查询余额

curl http://localhost:7001/balance/eosio/eosio

交易查询,查询交易列表接口官方已经废弃，只有通过交易ID查询接口

curl http://localhost:7001/transactions/tid


```

# join eos open source 

	wechat hl_294944589
