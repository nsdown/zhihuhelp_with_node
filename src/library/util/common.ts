import logger from '~/src/library/logger'
import fs from 'fs'
import PathConfig from '~/src/config/path'
import TypeLocalConfig from '~/src/type/namespace/local_config'

class Common {
  static promiseList: Array<Promise<any>> = []
  // 并发数限制到10即可
  static maxBuf = 10
  /**
   * 添加promise, 到指定容量后再执行
   */
  static async asyncAppendPromiseWithDebounce(promise: Promise<any>, forceDispatch = false) {
    Common.promiseList.push(promise)
    if (Common.promiseList.length >= Common.maxBuf || forceDispatch) {
      logger.log(`任务队列已满, 开始执行任务, 共${Common.promiseList.length}个任务待执行`)
      await Promise.all(Common.promiseList)
      logger.log(`任务队列内所有任务执行完毕`)
      Common.promiseList = []
    }
    return
  }

  /**
   * 延迟执行函数, 返回一个 Promise
   * @param {number} ms
   */
  static asyncSleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static getUuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(36)
        .substring(1)
    }

    let uuid = `${s4()}-${s4()}-${s4()}-${s4()}`
    return uuid
  }

  static getLocalConfig() {
    if (fs.existsSync(PathConfig.localConfigUri) === false) {
      // 没有就初始化一份
      fs.writeFileSync(PathConfig.localConfigUri, JSON.stringify({
        "downloadUrl": "http://www.baidu.com",
        "releaseAt": "2019年2月11日12点08分",
        "releaseNote": "",
        "version": 1.0,
        "requestConfig": {
          "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
          "cookie": "_zap=3fd8e57d-9851-43bc-86fd-87bd40d037be; d_c0=\"AIDn1X9rfw6PTmXtQW2qhnYAH3-dcEChFTk=|1541849174\"; __gads=ID=5be93562e2ced259:T=1543235796:S=ALNI_MbTpbChn_RXx25S996o35d9zsxYxg; _xsrf=r7S8eUASNnQpItjdYo0iMm3RuvN0au0m; q_c1=4a8e46bf1297485ba70bef767b5bcef1|1547370207000|1542015728000; __utmc=155987696; __utmz=155987696.1549074074.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=155987696.1436363699.1549074074.1549074074.1549116040.2; tgw_l7_route=025a67177706b199591bd562de56e55b; capsion_ticket=\"2|1:0|10:1549198417|14:capsion_ticket|44:ZjNiZDcwN2EyMzJiNDVmZGI2NDVmNzQzMWI5Y2I0YTQ=|df88cba1b1cdbd2eff95d63d5a5b28f069d8e210fa5b64a8427537b4eaf52935\"; z_c0=\"2|1:0|10:1549198515|4:z_c0|92:Mi4xbVowc0RnQUFBQUFBZ09mVmYydF9EaVlBQUFCZ0FsVk5zekpFWFFCVm5DZEVyajl5a1Rubjlwb0RIT0pKVzZzNDRR|bb6e45df88f9a36ee147ed92023ed7cd89ae64a7b4f9a0c3f5e5d2d30191e88d\"; tst=f"
        }
      }, null, 4))
    }
    let localConfigJson = fs.readFileSync(PathConfig.localConfigUri)
    let localConfig: TypeLocalConfig.Record
    try {
      localConfig = JSON.parse(localConfigJson.toString())
    } catch (e) {
      localConfig = {}
    }
    return localConfig
  }
}

export default Common
