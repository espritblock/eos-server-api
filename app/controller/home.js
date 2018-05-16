'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const Eos = require('eosjs');
const ecc = require('eosjs-ecc');
const binaryen = require('binaryen');

/**
 * 私钥
 */
const pk = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";

/**
 * eos服务
 */
const eosServer = "http://112.74.202.161:8888"; 

/**
 * 主账户
 */
const mainAccount = "eosio";

const eos = Eos.Localnet({binaryen,keyProvider:[pk],httpEndpoint:eosServer});

/**
 * 错误返回
 * @param {错误信息} error 
 */
const error = (error="error") =>{
    return {code:500,msg:error,data:{}}
}

/**
 * 成功返回
 * @param {数据} data 
 */
const success = (data) =>{
  return {code:0,msg:"success",data}
}

/**
 * create by espritblock
 */
class HomeController extends Controller {

  /**
   * 生成私钥
   */
  async createKey(){
    const { ctx } = this;
    try{
      let params = ctx.request.body;
      if(!params.seed){
        this.ctx.body = error("参数错误");
        return;
      }
      let privateKey = ecc.seedPrivate(params.seed);
      let publicKey = ecc.privateToPublic(pk);
      this.ctx.body = success({privateKey,publicKey});
    }catch(e){
      this.ctx.body = error(e);
    }
  }

  /**
   * 签名验证
   */
  async verify(){
    const { ctx } = this;
    try{
      let params = ctx.request.body;
      if(!params.sign || !params.src || !params.pubkey){
        this.ctx.body = error("参数错误");
        return;
      }
      let result = ecc.verify(params.sign,params.src,params.pubkey);
      this.ctx.body = success(result);
    }catch(e){
      this.ctx.body = error(e);
    }
  }

  /**
   * 创建账户
   */
  async createAccount(){
    const { ctx } = this;
    try{
      let params = ctx.request.body;
      if(!params.username || !params.active || !params.owner){
        this.ctx.body = error("参数错误");
        return;
      }
      let result = await eos.newaccount({
        creator: mainAccount,
        name: params.username,
        owner: params.owner,
        active: params.active,
        recovery: mainAccount
      });
      if(result){
        this.ctx.body = success(result);
      }else{
        this.ctx.body = error();
      }
    }catch(e){
        this.ctx.body = error(e);
    }
  }

  /**
   * 查询账户
   */
  async balance(){
    const { ctx } = this;
    try{
      let params = ctx.params;
      if(!params.contract || !params.account){
        this.ctx.body = error("参数错误");
        return;
      }
      await eos.getCurrencyBalance(params.contract,params.account).then(result => {
        if(result){
          this.ctx.body = success(result);
        }else{
          error();
        }
      });
    }catch(e){
      this.ctx.body = error(e);
    }
  }

  /**
   * 转账
   */
  async transfer(){
    const { ctx } = this;
    try{
      let params = ctx.request.body;
      if(!params.to || !params.quantity || !params.mome){
        this.ctx.body = error("参数错误");
        return;
      }
      await eos.transfer({from:'eosio', to:params.to, quantity:params.quantity, memo:params.mome}).then((r)=>{
        this.ctx.body = success(r);
      }).catch((e)=>{
        console.error(e)
        this.ctx.body = error();
      });
    }catch(e){
      console.error(e)
      this.ctx.body = error(e);
    }
  }

  /**
   * 查询账户
   */
  async accountInfo(){
  const { ctx } = this;  
  try{
    let params = ctx.params;
    if(!params.account){
      this.ctx.body = error("参数错误");
      return;
    }
    await eos.getAccount(params.account).then(result => {
      if(result){
        this.ctx.body = success(result);
      }else{
        this.ctx.body = error();
      }
    });
  }catch(e){
    this.ctx.body = error();
  }
}
  
/**
 * 交易查询
 */
async getTransactions(){
    const { ctx } = this;  
    try{
      let params = ctx.params;
      if(!params.tid){
        this.ctx.body = error("参数错误");
        return;
      }
      await eos.getTransaction(params.tid).then(result => {
        if(result){
          this.ctx.body = success(result);;
        }else{
          this.ctx.body = error();
        }
      });
    }catch(e){
      console.error(e);
      this.ctx.body = error(e);
    }
  }
}

module.exports = HomeController;
