/*
活动名称：集卡有礼 · 超级无线
活动链接：https://lzkjdz-isv.isvjd.com/wxCollectCard/activity/entry.html?activityId=<活动id>
环境变量：jd_wxCollectCard_activityId // 活动id

默认助力第一个CK，第一个CK失效会退出脚本

*/
if (process.env.proxy_wind === 'true') {const setGlobalHttpProxy = require('./utils/proxy-wind.js');setGlobalHttpProxy();}
let lnrun = 0;


const $ = new Env('集卡有礼（超级无线）')
const jdCookieNode = $.isNode() ? require('./jdCookie') : ''
const notify = $.isNode() ? require('./sendNotify') : ''
const getToken = require('./function/getToken')
const wxSavePrize = require('./function/wxSavePrize')

let lz_cookie = {},
  cookiesArr = [],
  cookie = "";
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach(_0x3146c3 => {
    cookiesArr.push(jdCookieNode[_0x3146c3]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map(_0x16a379 => _0x16a379.cookie)].filter(_0x4d84fe => !!_0x4d84fe);
allMessage = "";
message = "";
$.hotFlag = false;
$.outFlag = false;
$.activityEnd = false;
let lz_jdpin_token_cookie = "",
  activityCookie = "",
  jd_wxCollectCard_activityId = "";
jd_wxCollectCard_activityId = $.isNode() ? process.env.jd_wxCollectCard_activityId ? process.env.jd_wxCollectCard_activityId : "" + jd_wxCollectCard_activityId : $.getdata("jd_wxCollectCard_activityId") ? $.getdata("jd_wxCollectCard_activityId") : "" + jd_wxCollectCard_activityId;
!(async () => {
  if (!jd_wxCollectCard_activityId) {
    console.log("\n请先定义活动ID => 环境变量: jd_wxCollectCard_activityId\n");
    return;
  }
  if (!cookiesArr[0]) {
    $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  $.activityId = jd_wxCollectCard_activityId;
  $.shareUuid = "";
  console.log("活动入口：https://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId);
  for (let _0x4bc678 = 0; _0x4bc678 < cookiesArr.length; _0x4bc678++) {
    cookie = cookiesArr[_0x4bc678];
    originCookie = cookiesArr[_0x4bc678];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = _0x4bc678 + 1;
      message = "";
      $.bean = 0;
      $.hotFlag = false;
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      await getUA();
      await run();
      await $.wait(3000);
      if (_0x4bc678 == 0 && !$.actorUuid) break;
      if ($.outFlag || $.activityEnd) break;
      if ($.hasEnd) break;
    }
  }
  if (cookiesArr.length > 1) {
    cookie = cookiesArr[0];
    if (cookie && $.assistStatus && !$.outFlag && !$.activityEnd) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = 1;
      message = "";
      $.bean = 0;
      $.hotFlag = false;
      $.nickName = "";
      console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
      let Interval = process.env.jd_jk_interval || 60 * 1000;console.log("环境变量jd_task_interval已设置为"+Interval/1000+"秒");lnrun++;if(lnrun == 3){console.log(`\n【访问接口次数达到2次，休息一分钟.....】\n`);await $.wait(Interval);lnrun = 0}
      await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
      await getUA();
      await runs();
      await $.wait(3000);
    }
  }
  if ($.outFlag) {
    let _0x100837 = "此ip已被限制，请过10分钟后再执行脚本";
    $.msg($.name, "", "" + _0x100837);
  }
  if (allMessage) {
    $.msg($.name, "", "" + allMessage);
  }
})().catch(_0x59c55e => $.logErr(_0x59c55e)).finally(() => $.done());
async function run() {
  try {
    $.assistCount = 0;
    $.endTime = 0;
    lz_jdpin_token_cookie = "";
    $.Token = "";
    $.Pin = "";
    $.Token = await getToken(originCookie, "https://lzkjdz-isv.isvjd.com");
    if ($.Token == "") {
      console.log("获取[token]失败！");
      return;
    }
    await getCk();
    if (activityCookie == "") {
      console.log("获取cookie失败");
      return;
    }
    if ($.activityEnd === true) {
      console.log("活动结束");
      return;
    }
    if ($.outFlag) {
      console.log("此ip已被限制，请过10分钟后再执行脚本");
      return;
    }
    if ($.index == 1) await takePostRequest("getSimpleActInfoVo");
    await takePostRequest("getMyPing");
    if (!$.Pin) {
      console.log("未能获取用户鉴权信息！");
      return;
    }
    await takePostRequest("accessLogWithAD");
    await $.wait(1000);
    await takePostRequest("getActMemberInfo");
    if ($.openCard == false) {
      console.log("未开通店铺会员，无法参与活动");
      return;
    }
    await $.wait(1000);
    await takePostRequest("getUserInfo");
    await $.wait(1000);
    await takePostRequest("activityContent");
    await $.wait(1000);
    await takePostRequest("saveSource");
    await $.wait(1000);
    if ($.index == 1) {
      await takePostRequest("shopInfo");
      await $.wait(1000);
      await takePostRequest("drawContent");
      await $.wait(1000);
      let _0x32fa03 = "",
        _0x3ed21d = "",
        _0x371c49 = "";
      for (let _0x2ccc78 = 0; _0x2ccc78 < $.content.length; _0x2ccc78++) {
        _0x3ed21d = $.content[_0x2ccc78].name;
        _0x32fa03 = $.content[_0x2ccc78].id;
        if (_0x32fa03 == 0) {
          _0x371c49 += "谢谢参与";
          break;
        } else _0x2ccc78 != $.content.length - 1 ? _0x371c49 += _0x3ed21d + "，" : _0x371c49 += "" + _0x3ed21d;
      }
      console.log("助力码：" + $.actorUuid);
      console.log("\n活动店铺：" + ($.shopName || "未知") + "\n活动奖品：" + _0x371c49 + "\n当前集卡成功人数：" + $.gatherCount);
      $.assistStatus = true;
      await $.wait(1000);
    }
    $.index != 1 && (await takePostRequest("drawCard"), await $.wait(1000), await takePostRequest("drawCard2"));
    if ($.hotFlag) return;
    if ($.index == 1) {
      await takePostRequest("activityContent");
      await $.wait(1000);
      if ($.canDraw) {
        $.canDrawTimes = 1;
        console.log("");
        for (let _0x36012a = 0; _0x36012a < $.canDrawTimes; _0x36012a++) {
          await takePostRequest("getPrize");
          await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
        }
      } else console.log("\n没有抽奖机会了~");
    }
    if ($.outFlag) {
      console.log("此ip已被限制，请过10分钟后再执行脚本");
      return;
    }
    $.index == 1 && ($.shareUuid = $.actorUuid, console.log("全部助力 ➜  " + $.shareUuid));
    if ($.index % 3 == 0) await $.wait(parseInt(Math.random() * 3000 + 3000, 10));
  } catch (_0x57c09a) {
    console.log(_0x57c09a);
  }
}
async function runs() {
  try {
    $.assistCount = 0;
    $.endTime = 0;
    lz_jdpin_token_cookie = "";
    $.Token = "";
    $.Pin = "";
    $.canDraw = false;
    $.Token = await getToken(originCookie, "https://lzkjdz-isv.isvjd.com");
    if ($.Token == "") {
      console.log("获取[token]失败！");
      return;
    }
    await getCk();
    if (activityCookie == "") {
      console.log("获取cookie失败");
      return;
    }
    if ($.activityEnd === true) {
      console.log("活动结束");
      return;
    }
    if ($.outFlag) {
      console.log("此ip已被限制，请过10分钟后再执行脚本");
      return;
    }
    await takePostRequest("getSimpleActInfoVo");
    await $.wait(1000);
    await takePostRequest("getMyPing");
    if (!$.Pin) {
      console.log("未能获取用户鉴权信息！");
      return;
    }
    await $.wait(1000);
    await takePostRequest("accessLogWithAD");
    await $.wait(1000);
    await takePostRequest("getActMemberInfo");
    if ($.openCard == false) {
      console.log("未开通店铺会员，无法参与活动");
      return;
    }
    await $.wait(1000);
    await takePostRequest("getUserInfo");
    await $.wait(1000);
    await takePostRequest("activityContent");
    await $.wait(1000);
    await takePostRequest("shopInfo");
    await $.wait(1000);
    await takePostRequest("saveSource");
    await $.wait(1000);
    console.log("目前拥有的卡片：");
    const _0x2faceb = new Set();
    for (const _0x39b48b of $.cardList) {
      flag = true;
      $.cardName = _0x39b48b.cardName;
      $.count = _0x39b48b.count;
      _0x39b48b.count >= 0 ? _0x2faceb.add(_0x39b48b.count) : "";
      console.log($.cardName + "（" + $.count + "张）");
    }
    await takePostRequest("drawCard3");
    for (let _0x95b036 = 1; _0x95b036 < $.canShakeTimes; _0x95b036++) {
      await takePostRequest("drawCard3");
      await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
    }
    await takePostRequest("activityContent");
    await $.wait(1000);
    if ($.canDraw) {
      $.canDrawTimes = 1;
      console.log("");
      for (let _0x10bf23 = 0; _0x10bf23 < $.canDrawTimes; _0x10bf23++) {
        await takePostRequest("getPrize");
        await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
      }
    } else console.log("\n没有抽奖机会了~");
    if ($.hotFlag) return;
    if ($.outFlag) {
      console.log("此ip已被限制，请过10分钟后再执行脚本");
      return;
    }
    if ($.index % 3 == 0) await $.wait(parseInt(Math.random() * 3000 + 3000, 10));
  } catch (_0x565de6) {
    console.log(_0x565de6);
  }
}
async function takePostRequest(_0x457139) {
  if ($.outFlag) return;
  let _0x2b748e = "https://lzkjdz-isv.isvjd.com",
    _0x525356 = "",
    _0x28f13d = "POST";
  switch (_0x457139) {
    case "getMyPing":
      url = _0x2b748e + "/customer/getMyPing";
      _0x525356 = "token=" + $.Token + "&fromType=APP&userId=" + $.venderId;
      break;
    case "shopInfo":
      url = _0x2b748e + "/wxCollectCard/shopInfo";
      _0x525356 = "activityId=" + $.activityId;
      break;
    case "getSimpleActInfoVo":
      url = _0x2b748e + "/customer/getSimpleActInfoVo";
      _0x525356 = "activityId=" + $.activityId;
      break;
    case "getActMemberInfo":
      url = _0x2b748e + "/wxCommonInfo/getActMemberInfo";
      _0x525356 = "venderId=" + $.venderId + "&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin);
      break;
    case "accessLogWithAD":
      url = _0x2b748e + "/common/accessLogWithAD";
      let _0x518c10 = "https://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId + "&shareUuid=" + $.shareUuid;
      _0x525356 = "venderId=" + ($.shopId || $.venderId || "") + "&code=42&pin=" + encodeURIComponent($.Pin) + "&activityId=" + $.activityId + "&pageUrl=" + encodeURIComponent(_0x518c10) + "&subType=app&adSource=";
      break;
    case "getUserInfo":
      url = _0x2b748e + "/wxActionCommon/getUserInfo";
      _0x525356 = "pin=" + encodeURIComponent($.Pin);
      break;
    case "drawCard":
      url = _0x2b748e + "/wxCollectCard/drawCard";
      _0x525356 = "sourceId=" + $.shareUuid + "&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin) + "&pinImg=" + $.pinImg + "&jdNick=" + encodeURIComponent($.jdNick) + "&type=1";
      break;
    case "drawCard2":
      url = _0x2b748e + "/wxCollectCard/drawCard";
      _0x525356 = "sourceId=" + $.shareUuid + "&activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin) + "&pinImg=" + $.pinImg + "&type=2";
      break;
    case "drawCard3":
      url = _0x2b748e + "/wxCollectCard/drawCard";
      _0x525356 = "sourceId=" + $.actorUuid + "&activityId=" + $.activityId + "&type=0";
      break;
    case "drawContent":
      url = _0x2b748e + "/wxCollectCard/drawContent";
      _0x525356 = "activityId=" + $.activityId;
      break;
    case "activityContent":
      url = _0x2b748e + "/wxCollectCard/activityContent";
      _0x525356 = "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin) + "&uuid=" + $.shareUuid;
      break;
    case "saveSource":
      url = _0x2b748e + "/wxCollectCard/saveSource";
      _0x525356 = "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin) + "&pinImg=" + $.pinImg + "&jdNick=" + encodeURIComponent($.jdNick);
      break;
    case "drawResult":
      url = _0x2b748e + "/wxCollectCard/drawResult";
      _0x525356 = "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin) + "&uuid=" + $.actorUuid;
      break;
    case "followShop":
      url = _0x2b748e + "/wxActionCommon/followShop";
      _0x525356 = "userId=" + $.venderId + "&activityType=70&buyerNick=" + encodeURIComponent($.Pin) + "&activityId=" + $.activityId;
      break;
    case "getPrize":
      url = _0x2b748e + "/wxCollectCard/getPrize";
      _0x525356 = "activityId=" + $.activityId + "&pin=" + encodeURIComponent($.Pin);
      break;
    default:
      console.log("错误" + _0x457139);
  }
  let _0x940f5d = getPostRequest(url, _0x525356, _0x28f13d);
  return new Promise(async _0x35e139 => {
    $.post(_0x940f5d, (_0xe70d03, _0x41d7d4, _0x249280) => {
      try {
        setActivityCookie(_0x41d7d4);
        _0xe70d03 ? (_0x41d7d4 && typeof _0x41d7d4.statusCode != "undefined" && _0x41d7d4.statusCode == 493 && (console.log(_0x457139 + " 此ip已被限制，请过10分钟后再执行脚本"), $.outFlag = true), console.log("" + $.toStr(_0xe70d03, _0xe70d03)), console.log(_0x457139 + " API请求失败，请检查网路重试")) : dealReturn(_0x457139, _0x249280);
      } catch (_0x287a84) {
        console.log(_0x287a84, _0x41d7d4);
      } finally {
        _0x35e139();
      }
    });
  });
}
async function dealReturn(_0x50f381, _0x14cabf) {
  let _0x58ad14 = "";
  try {
    (_0x50f381 != "accessLogWithAD" || _0x50f381 != "drawContent") && _0x14cabf && (_0x58ad14 = JSON.parse(_0x14cabf));
  } catch (_0x5e9d3d) {
    console.log(_0x50f381 + " 执行任务异常");
    console.log(_0x5e9d3d);
    $.runFalag = false;
  }
  try {
    switch (_0x50f381) {
      case "getMyPing":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            if (_0x58ad14.data && typeof _0x58ad14.data.secretPin != "undefined") $.Pin = _0x58ad14.data.secretPin;
            if (_0x58ad14.data && typeof _0x58ad14.data.nickname != "undefined") $.nickname = _0x58ad14.data.nickname;
          } else _0x58ad14.errorMessage ? console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || "")) : console.log(_0x50f381 + " " + _0x14cabf);
        } else {}
        break;
      case "shopInfo":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) $.shopName = _0x58ad14.data.shopName || "";else {
            if (_0x58ad14.errorMessage) console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || ""));else {
              console.log(_0x50f381 + " " + _0x14cabf);
            }
          }
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "getSimpleActInfoVo":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            if (typeof _0x58ad14.data.shopId != "undefined") $.shopId = _0x58ad14.data.shopId;
            if (typeof _0x58ad14.data.venderId != "undefined") $.venderId = _0x58ad14.data.venderId;
            if (typeof _0x58ad14.data.activityType != "undefined") $.activityType = _0x58ad14.data.activityType;
          } else _0x58ad14.errorMessage ? console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || "")) : console.log(_0x50f381 + " " + _0x14cabf);
        } else {}
        break;
      case "getUserInfo":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            $.pinImg = _0x58ad14.data.yunMidImageUrl || "";
            $.jdNick = _0x58ad14.data.nickname || "";
          } else _0x58ad14.errorMessage ? console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || "")) : console.log(_0x50f381 + " " + _0x14cabf);
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "activityContent":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            $.cardList = _0x58ad14.data.cardList || [];
            $.helpStatus = _0x58ad14.data.canDraw || false;
            $.canShake = _0x58ad14.data.canShake || true;
            $.canCreate = _0x58ad14.data.canCreate || true;
            $.canDraw = _0x58ad14.data.canDraw || false;
            $.canAssist = _0x58ad14.data.canAssist || true;
            $.gatherCount = _0x58ad14.data.gatherCount || 0;
            $.drawCount = _0x58ad14.data.rule.match(/每人每天可获得(\d+)次/);
            $.drawCount && ($.drawCounts = $.drawCount[1]);
          } else {
            if (_0x58ad14.errorMessage) {
              if (_0x58ad14.errorMessage.indexOf("结束") > -1) $.activityEnd = true;
              console.log("" + (_0x58ad14.errorMessage || ""));
            } else {
              console.log("" + _0x14cabf);
            }
          }
        } else console.log("" + _0x14cabf);
        break;
      case "saveSource":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) $.actorUuid = _0x58ad14.data || "";else _0x58ad14.errorMessage ? console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || "")) : console.log(_0x50f381 + " " + _0x14cabf);
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "drawCard":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) console.log("获得卡片：" + (_0x58ad14.data.reward.cardName || ""));else {
            if (_0x58ad14.errorMessage) {
              console.log("" + (_0x58ad14.errorMessage || ""));
            } else console.log("" + _0x14cabf);
          }
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "drawCard2":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            console.log("获得卡片：" + (_0x58ad14.data.reward.cardName || ""));
          } else _0x58ad14.errorMessage ? console.log("" + (_0x58ad14.errorMessage || "")) : console.log("" + _0x14cabf);
        } else {}
        break;
      case "drawCard3":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            $.canShakeTimes = _0x58ad14.data.canShakeTimes || 0;
            console.log("获得卡片：" + (_0x58ad14.data.reward.cardName || ""));
          } else {
            if (_0x58ad14.errorMessage) console.log(" " + (_0x58ad14.errorMessage || ""));else {
              console.log("" + _0x14cabf);
            }
          }
        } else {}
        break;
      case "getPrize":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            if (_0x58ad14.data) {
              $.canDrawTimes = _0x58ad14.data.canDrawTimes || 0;
              let _0x4f4ad1 = _0x58ad14.data.drawInfo;
              if (_0x4f4ad1) switch (_0x4f4ad1.type) {
                case 6:
                  console.log("🎉 " + _0x4f4ad1.name + " 🐶");
                  break;
                case 7:
                  const _0x26e8ac = _0x58ad14.data.addressId;
                  prizeName = _0x4f4ad1.name;
                  console.log("🎉 恭喜获得实物~");
                  console.log("奖品名称：" + prizeName);
                  console.log("参考价值：" + _0x4f4ad1.priceInfo + "（元）");
                  if (_0x4f4ad1.showImage) console.log("预览图片：" + _0x4f4ad1.showImage);
                  let _0xf5dc85 = await wxSavePrize("https://lzkjdz-isv.isvjd.com", cookie, $.UA, $.activityId, $.activityType, $.venderId, $.Pin, prizeName, _0x26e8ac);
                  _0xf5dc85 ? $.isNode() && (await notify.sendNotify($.name + "中奖通知", "【京东账号" + $.index + "】" + $.nickName + "\n抽中实物 " + prizeName + "，已成功自动登记收货地址\n\nhttps://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId)) : $.isNode() && (await notify.sendNotify($.name + "待领取奖品提醒", "【京东账号" + $.index + "】" + $.nickName + "\n抽中实物 " + prizeName + "，点击活动链接前往活动查看具体规则，若无套路请在我的奖品中填写收货地址领取！\n请在收到通知的一小时内进行操作，超过则无法再填写奖品收货地址可直接忽略本条消息，也可联系店铺客服加以甜言蜜语尝试挽回！\n\nhttps://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId));
                  break;
                case 8:
                  console.log("🗑️ 专享价");
                  break;
                case 9:
                  console.log("🗑️ " + _0x4f4ad1.name + " 🎟️");
                  break;
                case 13:
                case 14:
                case 15:
                  console.log("🎉 恭喜获得" + _0x4f4ad1.name + " 🎁");
                  break;
                case 16:
                  console.log("🎉 " + _0x4f4ad1.priceInfo + " 🧧");
                  break;
                default:
                  _0x4f4ad1.name.includes("券") ? console.log("🗑️ 优惠券") : console.log("获得：" + _0x4f4ad1.name);
                  break;
              } else console.log("💨 空气");
            } else _0x14cabf.errorMessage ? console.log(_0x14cabf.errorMessage) : console.log(JSON.stringify(_0x14cabf));
          } else _0x58ad14.errorMessage ? console.log(" " + (_0x58ad14.errorMessage || "")) : console.log("" + _0x14cabf);
        } else {}
        break;
      case "drawContent":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) $.content = _0x58ad14.data.content || [];else {
            if (_0x58ad14.errorMessage) console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || ""));else {
              console.log(_0x50f381 + " " + _0x14cabf);
            }
          }
        } else {
          console.log(_0x50f381 + " " + _0x14cabf);
        }
        break;
      case "getActMemberInfo":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) $.openCard = _0x58ad14.data.openCard || false;else _0x58ad14.errorMessage ? console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || "")) : console.log(_0x50f381 + " " + _0x14cabf);
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "drawResult":
        if (typeof _0x58ad14 == "object") {
          if (_0x58ad14.result && _0x58ad14.result === true) {
            if (typeof _0x58ad14.data == "object") {
              let _0x3f2556 = "";
              _0x58ad14.data.drawName && (_0x3f2556 = "" + _0x58ad14.data.drawName);
              !_0x3f2556 && (_0x3f2556 = "空气💨");
              console.log("获得:" + (_0x3f2556 || _0x14cabf));
            } else console.log(_0x50f381 + " " + _0x14cabf);
          } else {
            if (_0x58ad14.errorMessage) {
              $.runFalag = false;
              console.log(_0x50f381 + " " + (_0x58ad14.errorMessage || ""));
            } else console.log(_0x50f381 + " " + _0x14cabf);
          }
        } else console.log(_0x50f381 + " " + _0x14cabf);
        break;
      case "accessLogWithAD":
      case "drawContent":
        break;
      default:
        console.log(_0x50f381 + "-> " + _0x14cabf);
    }
    if (typeof _0x58ad14 == "object") {
      if (_0x58ad14.errorMessage) {
        _0x58ad14.errorMessage.indexOf("火爆") > -1 && ($.hotFlag = true);
      }
    }
  } catch (_0xe8f8a7) {
    console.log(_0xe8f8a7);
  }
}
function getPostRequest(_0x32c83b, _0x2988a1, _0xacf621 = "POST") {
  let _0xd1bfef = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Cookie": cookie,
    "User-Agent": $.UA,
    "X-Requested-With": "XMLHttpRequest"
  };
  return _0x32c83b.indexOf("https://lzkjdz-isv.isvjd.com") > -1 && (_0xd1bfef.Origin = "https://lzkjdz-isv.isvjd.com", _0xd1bfef.Referer = "https://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId + "&shareUuid=" + $.shareUuid, _0xd1bfef.Cookie = "" + (lz_jdpin_token_cookie && lz_jdpin_token_cookie || "") + ($.Pin && "AUTH_C_USER=" + $.Pin + ";" || "") + activityCookie), {
    "url": _0x32c83b,
    "method": _0xacf621,
    "headers": _0xd1bfef,
    "body": _0x2988a1,
    "timeout": 30000
  };
}
function getCk() {
  return new Promise(_0x25aeeb => {
    let _0x2f3d07 = {
      "url": "https://lzkj-isv.isvjd.com/wxCommonInfo/token",
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://lzkjdz-isv.isvjd.com/wxCollectCard/activity/activity?activityId=" + $.activityId,
        "User-Agent": $.UA
      },
      "timeout": 30000
    };
    $.get(_0x2f3d07, async (_0xd179c1, _0x1b05c5, _0x4c25c9) => {
      try {
        if (_0xd179c1) {
          _0x1b05c5 && typeof _0x1b05c5.statusCode != "undefined" && _0x1b05c5.statusCode == 493 && (console.log("getCk 此ip已被限制，请过10分钟后再执行脚本"), $.outFlag = true);
          console.log(String(_0xd179c1));
          console.log($.name + " cookie API请求失败，请检查网路重试");
        } else {
          if (_0x1b05c5.status == 200) setActivityCookie(_0x1b05c5);
        }
      } catch (_0x2aa884) {
        $.logErr(_0x2aa884, _0x1b05c5);
      } finally {
        _0x25aeeb();
      }
    });
  });
}
function setActivityCookie(_0x2fa841) {
  if (_0x2fa841) {
    if (_0x2fa841.headers["set-cookie"]) {
      cookie = "";
      for (let _0x494419 of _0x2fa841.headers["set-cookie"]) {
        lz_cookie[_0x494419.split(";")[0].substr(0, _0x494419.split(";")[0].indexOf("="))] = _0x494419.split(";")[0].substr(_0x494419.split(";")[0].indexOf("=") + 1);
      }
      for (const _0x1df39f of Object.keys(lz_cookie)) {
        cookie += _0x1df39f + "=" + lz_cookie[_0x1df39f] + ";";
      }
      activityCookie = cookie;
    }
  }
}
async function getUA() {
  $.UA = "jdapp;iPhone;10.1.4;13.1.2;" + randomString(40) + ";network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1";
}
function randomString(_0x256899) {
  _0x256899 = _0x256899 || 32;
  let _0x4cb1f4 = "abcdef0123456789",
    _0x5450fd = _0x4cb1f4.length,
    _0x21f041 = "";
  for (i = 0; i < _0x256899; i++) _0x21f041 += _0x4cb1f4.charAt(Math.floor(Math.random() * _0x5450fd));
  return _0x21f041;
}
function getMaxMin(_0x57c8a3, _0x49ae6a) {
  if (_0x49ae6a === "max") return Math.max.apply(Math, _0x57c8a3);else {
    if (_0x49ae6a === "min") return Math.min.apply(Math, _0x57c8a3);
  }
}
function jsonParse(_0xfd8c82) {
  if (typeof _0xfd8c82 == "string") {
    try {
      return JSON.parse(_0xfd8c82);
    } catch (_0x12ec89) {
      return console.log(_0x12ec89), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), [];
    }
  }
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(),"h+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), "S+": s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
