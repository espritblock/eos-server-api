'use strict';

/**
 * create by espritblock
 * @param {*} app 
 */
module.exports = app => {
  
  const { router, controller } = app;

  /**
   * 签名验证
   * @param {post body} 
   * {
   * seed 种子
   * } 
   */
  router.post('/createKey', controller.home.createKey);

  /**
   * 签名验证
   * @param {post body} 
   * {
   * sign   签名信息,
   * src    原始数据,
   * pubkey 公钥
   * } 
   */
  router.post('/sign/verify', controller.home.verify);
  
  /**
   * 创建账户
   * @param {post body} 
   * {
   * username 账户名,
   * owner    onwer公钥,
   * active   active公钥
   * } 
   */
  router.post('/account/create', controller.home.createAccount);

  /**
   * 转账
   * @param {post body} 
   * {
   * to 转给账户,
   * quantity 币种
   * mome 备注
   * } 
   */
  router.post('/transfer', controller.home.transfer);
  
  /**
   * 查询账户
   * @param {账户名称} account
   */
  router.get('/account/info/:account', controller.home.accountInfo);

  /**
   * 查询余额
   * @param {合约账户} contract
   * @param {查询扎根和} account
   */
  router.get('/balance/:contract/:account', controller.home.balance);

  /**
   * 交易查询
   * @param {合约账户} name
   * @param {页数} page
   * @param {条数} size
   */
  router.get('/transactions/:name/:page/:size', controller.home.getTransactions);

};
