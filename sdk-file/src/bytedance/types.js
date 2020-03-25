/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * 登录可选参数
 * @typedef {Object} BytedanceLoginOptions
 * @memberof BaaS
 * @property {boolean} [forceLogin] 是否强制登录
 * @property {boolean} [createUser] 是否创建用户
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */
