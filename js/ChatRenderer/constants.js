(function(root, factory) {
  root.chatRendererConstants = factory(root.blcsdk)
}(this,
/**
 * @import * as blcsdk from '../vendor/blcsdk'
 * @param {typeof blcsdk} blcsdk
 */
function(blcsdk) {
  const exports = {}

  exports.INTERACT_TYPE_ENTER = 1
  exports.INTERACT_TYPE_FOLLOW = 2
  exports.INTERACT_TYPE_SHARE = 3
  exports.INTERACT_TYPE_SPECIAL_FOLLOW = 4

  exports.CONTENT_PART_TYPE_TEXT = blcsdk.ContentPartType.TEXT
  exports.CONTENT_PART_TYPE_IMAGE = blcsdk.ContentPartType.IMAGE

  const AUTHOR_TYPE_TO_TEXT = []
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.NORMAL] = ''
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.MEMBER] = 'member' // 舰队
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.ADMIN] = 'moderator' // 房管
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.OWNER] = 'owner' // 主播
  exports.AUTHOR_TYPE_TO_TEXT = AUTHOR_TYPE_TO_TEXT

  const GUARD_LEVEL_TO_TEXT_KEY = []
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.NONE] = ''
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV3] = '总督'
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV2] = '提督'
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV1] = '舰长'

  exports.getShowGuardLevelText = function(guardLevel) {
    return GUARD_LEVEL_TO_TEXT_KEY[guardLevel] || ''
  }

  exports.MESSAGE_TYPE_TEXT = blcsdk.MsgType.TEXT
  exports.MESSAGE_TYPE_GIFT = blcsdk.MsgType.GIFT
  exports.MESSAGE_TYPE_MEMBER = blcsdk.MsgType.MEMBER
  exports.MESSAGE_TYPE_SUPER_CHAT = blcsdk.MsgType.SUPER_CHAT
  exports.MESSAGE_TYPE_DEL = 30
  exports.MESSAGE_TYPE_UPDATE = 31
  // interact message not supported yet
  // exports.MESSAGE_TYPE_INTERACT = 6
  const MEDAL_CONFIGS = [
    {
      level: 37,
      colors: {
        bgColor: `linear-gradient(to right, #ff6e1a, #fdb870)`,
        borderColor: `#ff6e1a`,
        textColor: `#fdb870`
      }
    },
    {
      level: 33,
      colors: {
        bgColor: `linear-gradient(to right, #881537, #c15b85)`,
        borderColor: `#881537`,
        textColor: `#c15b85`
      }
    },
    {
      level: 29,
      colors: {
        bgColor: `linear-gradient(to right, #361b69, #7668c3)`,
        borderColor: `#361b69`,
        textColor: `#7668c3`
      }
    },
    {
      level: 25,
      colors: {
        bgColor: `linear-gradient(to right, #10205b, #6382e9)`,
        borderColor: `#10205b`,
        textColor: `#111111`
      }
    },
    {
      level: 21,
      colors: {
        bgColor: `linear-gradient(to right, #1e5950, #4e988d)`,
        borderColor: `#1e5950`,
        textColor: `#111111`
      }
    },
    {
      level: 17,
      colors: {
        bgColor: `#c79d24`,
        borderColor: `#c79d24`,
        textColor: `#c79d24`
      }
    },
    {
      level: 13,
      colors: {
        bgColor: `#be6686`,
        borderColor: `#be6686`,
        textColor: `#be6686`
      }
    },
    {
      level: 9,
      colors: {
        bgColor: `#8d7ca6`,
        borderColor: `#8d7ca6`,
        textColor: `#8d7ca6`
      }
    },
    {
      level: 5,
      colors: {
        bgColor: `#5d7b9e`,
        borderColor: `#5d7b9e`,
        textColor: `#5d7b9e`
      }
    },
    {
      level: 1,
      colors: {
        bgColor: `#5c968e`,
        borderColor: `#5c968e`,
        textColor: `#5c968e`
      }
    }
  ]
  exports.MEDAL_CONFIGS = MEDAL_CONFIGS
  
  const PRICE_CONFIGS = [
    { // RMB 1000红
      price: 1000,
      colors: {
        headerBg: 'rgba(208,0,0,1)',
        contentBg: 'rgba(230,33,23,1)',
        dividerColor: 'rgba(150,33,23,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 15
    },
    { // RMB 200 橙
      price: 100,
      colors: {
        headerBg: 'rgba(230,81,0,1)',
        contentBg: 'rgba(245,124,0,1)',
        dividerColor: 'rgba(180,100,0,1)',
        header: 'rgba(255,255,255,0.87451)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,0.87451)'
      },
      pinTime: 8
    },
    { // RMB 50 黄
      price: 50,
      colors: {
        headerBg: 'rgba(255,179,0,1)',
        contentBg: 'rgba(255,202,40,1)',
        dividerColor: 'rgba(200,140,10,1)',
        header: 'rgba(0,0,0,0.87451)',
        authorName: 'rgba(0,0,0,0.541176)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,0.87451)'
      },
      pinTime: 5
    },
    { // RMB 30 青绿色
      price: 30,
      colors: {
        headerBg: 'rgba(0,191,165,1)',
        contentBg: 'rgba(29,233,182,1)',
        dividerColor: 'rgba(0,150,120,1)',
        header: 'rgba(0,0,0,1)',
        authorName: 'rgba(0,0,0,0.541176)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,1)'
      },
      pinTime: 3
    },
    { // RMB 1 蓝色
      price: 1,
      colors: {
        headerBg: 'rgba(21,101,192,1)',
        contentBg: 'rgba(30,136,229,1)',
        dividerColor: 'rgba(10,70,160,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 0.4
    },
    { // RMB 0.1 青色
      price: 0.1,
      colors: {
        headerBg: 'rgba(119, 255, 246, 1)',
        contentBg: 'rgba(69, 230, 227, 1)',
        dividerColor: 'rgba(10,70,160,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 0.2
    },
    { // RMB 0 淡蓝
      price: 0,
      colors: {
        headerBg: 'rgba(153, 236, 255, 1)',
        contentBg: 'rgba(153, 236, 255, 1)',
        dividerColor: 'rgba(100,170,233,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 0.08
    }
  ]
  exports.PRICE_CONFIGS = PRICE_CONFIGS

  exports.getMedalConfig = function(level) {
    for (const config of MEDAL_CONFIGS) {
      if (level >= config.level) {
        return config
      }
    }
    return PRICE_CONFIGS[PRICE_CONFIGS.length - 1]
  }

  exports.getPriceConfig = function(price) {
    for (const config of PRICE_CONFIGS) {
      if (price >= config.price) {
        return config
      }
    }
    return PRICE_CONFIGS[PRICE_CONFIGS.length - 1]
  }

  exports.getShowContent = function(message) {
    if (message.translation) {
      return `${message.content}（${message.translation}）`
    }
    return message.content
  }

  exports.getShowContentParts = function(message) {
    let contentParts = [...message.contentParts]
    if (message.translation) {
      contentParts.push({
        type: blcsdk.ContentPartType.TEXT,
        text: `（${message.translation}）`
      })
    }
    return contentParts
  }

  exports.getGiftShowContent = function(message, showGiftName) {
    if (!showGiftName) {
      return ''
    }
    return `赠送 ${message.giftName}x${message.num}`
  }

  exports.getGiftShowNameAndNum = function(message) {
    return `${message.giftName}x${message.num}`
  }

  exports.getShowAuthorName = function(message) {
    if (message.authorNamePronunciation && message.authorNamePronunciation !== message.authorName) {
      return `${message.authorName}(${message.authorNamePronunciation})`
    }
    return message.authorName
  }

  exports.getTimeTextHourMin = function(date) {
    let hour = date.getHours()
    let min = `00${date.getMinutes()}`.slice(-2)
    return `${hour}:${min}`
  }

  exports.formatCurrency = function(price) {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: price < 100 ? 2 : 0
    }).format(price)
  }

  return exports
}))
