(function(root, factory) {
  root.chatRendererTextMessage = factory(
    root.blcsdk,
    root.chatRendererConstants,
    root.chatRendererImgShadow.default,
    root.chatRendererMembershipItem.default,
    root.chatRendererPaidMessage.default,
  )
}(this,
/**
 * @import * as blcsdk from 'blcsdk'
 * @import * as constants from './constants'
 * @import * as ImgShadow from './ImgShadow'
 * @import * as MembershipItem from './MembershipItem'
 * @import * as PaidMessage from './PaidMessage'
 * @param {typeof blcsdk} blcsdk
 * @param {typeof constants} constants
 * @param {typeof ImgShadow.default} ImgShadow
 * @param {typeof MembershipItem.default} MembershipItem
 * @param {typeof PaidMessage.default} PaidMessage
 */
function(blcsdk, constants, ImgShadow, MembershipItem, PaidMessage) {
  const exports = {}
  exports.default = {
    template: `
    `,
    name: 'Ticker',
    components: {
      ImgShadow,
      MembershipItem,
      PaidMessage
    },
    props: {
      messages: Array,
      showGiftName: {
        type: Boolean,
        default: blcsdk.getConfig().showGiftName
      }
    },
    data() {
      return {
        MESSAGE_TYPE_MEMBER: constants.MESSAGE_TYPE_MEMBER,
        curTime: new Date(),
        updateTimerId: window.setInterval(this.updateProgress, 1000),
        pinnedMessage: null
      }
    },
    computed: {
      showMessages() {
        let res = []
        for (let message of this.messages) {
          if (!this.needToShow(message)) {
            continue
          }
          res.push({
            raw: message,
            bgColor: this.getBgColor(message),
            formatBgColor: this.getFormatBgColor(message),
            color: this.getColor(message),
            text: this.getText(message)
          })
        }
        return res
      },
      pinnedMessageShowContent() {
        if (!this.pinnedMessage) {
          return ''
        }
        if (this.pinnedMessage.type === constants.MESSAGE_TYPE_GIFT) {
          return constants.getGiftShowContent(this.pinnedMessage, this.showGiftName)
        } else {
          return constants.getShowContent(this.pinnedMessage)
        }
      }
    },
    beforeDestroy() {
      window.clearInterval(this.updateTimerId)
    },
    methods: {
      async onTickerItemEnter(el, done) {
        let width = el.clientWidth
        if (width === 0) {
          // CSS指定了不显示固定栏
          done()
          return
        }
        el.style.width = 0
        await this.$nextTick()
        el.style.width = `${width}px`
        window.setTimeout(done, 200)
      },
      onTickerItemLeave(el, done) {
        el.classList.add('sliding-down')
        window.setTimeout(() => {
          el.classList.add('collapsing')
          el.style.width = 0
          window.setTimeout(() => {
            el.classList.remove('sliding-down')
            el.classList.remove('collapsing')
            el.style.width = 'auto'
            done()
          }, 200)
        }, 200)
      },
  
      getShowAuthorName: constants.getShowAuthorName,
      needToShow(message) {
        let pinTime = this.getPinTime(message)
        // pinTime 对应的是 min，而 new Date() 对应的是 ms
        return (new Date() - message.addTime) / (60 * 1000) < pinTime
      },
      getBgColor(message) {
        let color1, color2
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          color1 = 'rgba(15,157,88,1)'
          color2 = 'rgba(11,128,67,1)'
        } else {
          let config = constants.getPriceConfig(message.price)
          color1 = config.colors.contentBg
          color2 = config.colors.headerBg
        }
        
        return { primaryColor: color1, secondaryColor: color2 }
      },
      getFormatBgColor(message) {
        let color = this.getBgColor(message)
  
        let pinTime = this.getPinTime(message)
        let progress = (1 - ((this.curTime - message.addTime) / (60 * 1000) / pinTime)) * 100
        if (progress < 0) {
          progress = 0
        } else if (progress > 100) {
          progress = 100
        }
        return `linear-gradient(90deg, var(--yt-live-chat-ticker-item-primary-color ,${color.primaryColor}), \
                var(--yt-live-chat-ticker-item-primary-color ,${color.primaryColor}) ${progress}%, \
                var(--yt-live-chat-ticker-item-secondary-color ,${color.secondaryColor}) ${progress}%, \
                var(--yt-live-chat-ticker-item-secondary-color ,${color.secondaryColor}))`
      },
      getColor(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          return 'rgb(255,255,255)'
        }
        return constants.getPriceConfig(message.price).colors.header
      },
      getText(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          // 方便用户 CSS 自定义
          return ''
          // return this.$t('chat.tickerMembership')
        }
        return `CN¥${constants.formatCurrency(message.price)}`
      },
      getPinTime(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          if (message.privilegeType === 3) {
            return 5
          } else if (message.privilegeType === 2) {
            return 15
          } else if (message.privilegeType === 1) {
            return 30
          }
        }
        // 价格小于最小置顶常驻礼物价格时, 不显示
  
        return constants.getPriceConfig(message.price).pinTime
      },
      updateProgress() {
        // 更新进度
        this.curTime = new Date()
  
        // 删除过期的消息
        let filteredMessages = []
        let messagesChanged = false
        for (let message of this.messages) {
          let pinTime = this.getPinTime(message)
          if ((this.curTime - message.addTime) / (60 * 1000) >= pinTime) {
            messagesChanged = true
            if (this.pinnedMessage === message) {
              this.pinnedMessage = null
            }
            continue
          }
          filteredMessages.push(message)
        }
        if (messagesChanged) {
          this.$emit('update:messages', filteredMessages)
        }
      },
      onItemClick(message) {
        if (this.pinnedMessage == message) {
          this.pinnedMessage = null
        } else {
          this.pinnedMessage = message
        }
      }
    }
  }

  return exports
}))
