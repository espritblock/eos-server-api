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
const eosServer = "http://54.238.242.48:8888"; 

/**
 * 主账户
 */
const mainAccount = "eosio";

/**
 * 给用户抵押的数量-用于网络使用
 */
const stake_net_quantity = "1 SYS";

/**
 * 给用户抵押的数量-用于cpu使用
 */
const stake_cpu_quantity = "1 SYS";

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
      let publicKey = ecc.privateToPublic(privateKey);
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
      await eos.transaction(tr => {
        tr.newaccount({
          creator: mainAccount,
          name: params.username,
          owner: params.owner,
          active: params.active
        })
        tr.buyrambytes({
          payer: mainAccount,
          receiver: params.username,
          bytes: 8000
        })
        tr.delegatebw({
          from: mainAccount,
          receiver: params.username,
          stake_net_quantity:stake_net_quantity,
          stake_cpu_quantity:stake_cpu_quantity,
          transfer: 0
        })
      }).then(result => {
        if(result){
          this.ctx.body = success(result);
        }else{
          this.ctx.body = error();
        }
      }).catch(e =>{
        this.ctx.body = error(e);
      });
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
          this.ctx.body = error();
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
      if(!params.from || !params.pk || !params.to || !params.quantity || !params.mome){
        this.ctx.body = error("参数错误");
        return;
      }
      const eoss = Eos.Localnet({binaryen,keyProvider:[params.pk],httpEndpoint:eosServer});
      await eoss.transfer({from:params.from, to:params.to, quantity:params.quantity, memo:params.mome}).then((r)=>{
        this.ctx.body = success(r);
      }).catch((e)=>{
        this.ctx.body = error(e);
      });
    }catch(e){
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
    }).catch(e=>{
      this.ctx.body = error(e);
    });
  }catch(e){
    this.ctx.body = error();
  }
}
  
/**
 * 交易查询
 */
async getTransaction(){
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
      }).catch(e=>{
        this.ctx.body = error(e);
      });
    }catch(e){
      this.ctx.body = error(e);
    }
  }

  /**
   * 交易查询----此方法官方去掉了
   */
  async getTransactions(){
    const { ctx } = this;  
    try{
      let params = ctx.params;
      if(!params.account || !params.page || !params.size){
        this.ctx.body = error("参数错误");
        return;
      }
     
      let start = (params.page-1)*params.size;
      console.error(start)
      await eos.getTransactions({
        account_name:params.account,
        skip_seq:start,
        num_seq:params.size
      }).then(result => {
        if(result){
          this.ctx.body = success(result);;
        }else{
          this.ctx.body = error();
        }
      }).catch(e=>{
        this.ctx.body = error(e);
      });
    }catch(e){
      console.error(start)
      this.ctx.body = error(e);
    }
  }

   /**
   * account
   */
  async getAccountByKey(){
    const { ctx } = this;  
    try{
      let params = ctx.params;
      if(!params.publickey){
        this.ctx.body = error("参数错误");
        return;
      }
      await eos.getKeyAccounts({public_key:params.publickey}).then(result => {
        if(result){
          this.ctx.body = success(result);;
        }else{
          this.ctx.body = error();
        }
      }).catch(e=>{
        this.ctx.body = error(e);
      });
    }catch(e){
      this.ctx.body = error(e);
    }
  }

}

module.exports = HomeController;
