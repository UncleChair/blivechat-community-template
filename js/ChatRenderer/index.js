(function(root, factory) {
  root.chatRenderer = factory(
    root._,
    root.chatRendererConstants,
    root.chatRendererTextMessage.default,
    root.chatRendererPaidMessage.default,
    root.chatRendererMembershipItem.default,
    root.chatRendererTicker.default,
    root.chatRendererInteractMessage.default,
  )
}(this,
/**
 * @import * as constants from './constants'
 * @import * as TextMessage from './TextMessage'
 * @import * as PaidMessage from './PaidMessage'
 * @import * as MembershipItem from './MembershipItem'
 * @import * as Ticker from './Ticker'
 * @import * as InteractMessage from './InteractMessage'
 * @param {typeof constants} constants
 * @param {typeof TextMessage.default} TextMessage
 * @param {typeof PaidMessage.default} PaidMessage
 * @param {typeof MembershipItem.default} MembershipItem
 * @param {typeof Ticker.default} Ticker
 * @param {typeof InteractMessage.default} InteractMessage
 */
function(_, constants, TextMessage, PaidMessage, MembershipItem, Ticker, InteractMessage ) {
  const exports = {}

  const NEED_SMOOTH_MESSAGE_TYPES = [
    // constants.MESSAGE_TYPE_INTERACT,
    constants.MESSAGE_TYPE_TEXT,
    constants.MESSAGE_TYPE_GIFT,
    constants.MESSAGE_TYPE_MEMBER,
    constants.MESSAGE_TYPE_SUPER_CHAT
  ]
  // 发送消息时间间隔范围
  const MESSAGE_MIN_INTERVAL = 80
  const MESSAGE_MAX_INTERVAL = 1000

  const CHAT_SMOOTH_ANIMATION_TIME_MS = 84
  const SCROLLED_TO_BOTTOM_EPSILON = 15

  exports.default = {
    template: `
  <yt-live-chat-renderer class="style-scope yt-live-chat-app" style="--scrollbar-width:11px;" hide-timestamps
    @mousemove="refreshCantScrollStartTime"
  >
    <ticker class="style-scope yt-live-chat-renderer" :messages="paidMessages" :showGiftInfo="showGiftName"></ticker>
    <yt-live-chat-item-list-renderer class="style-scope yt-live-chat-renderer" allow-scroll>
      <div ref="scroller" id="item-scroller" class="style-scope yt-live-chat-item-list-renderer animated" @scroll="onScroll">
        <div ref="itemOffset" id="item-offset" class="style-scope yt-live-chat-item-list-renderer">
          <div ref="items" id="items" class="style-scope yt-live-chat-item-list-renderer" style=""
            :style="{ transform: \`translateY(\${Math.floor(scrollPixelsRemaining)}px)\` }">
            <transition-group tag="div" :css="false" @leave="onMessageLeave"
              id="chat-items" class="style-scope yt-live-chat-item-list-renderer"
            >
              <template v-for="message in messages">
                <interact-message :key="message.id" v-if="message.type === MESSAGE_TYPE_INTERACT"
                  class="style-scope yt-live-chat-item-list-renderer"
                  :time="message.time"
                  :avatarUrl="message.avatarUrl"
                  :authorName="message.authorName"

                  :medalName="message.medalName"
                  :medalLevel="message.medalLevel"
                  :isFanGroup="message.isFanGroup"

                  :privilegeType="message.privilegeType"
                  :msgType="message.msgType"

                  :isDelete="message.isDelete"
                ></interact-message>
                <text-message :key="message.id" v-else-if="message.type === MESSAGE_TYPE_TEXT"
                  class="style-scope yt-live-chat-item-list-renderer"
                  :time="message.time"
                  :avatarUrl="message.avatarUrl"
                  :authorName="message.authorName"
                  :authorType="message.authorType"
                  
                  :privilegeType="message.privilegeType"
                  :repeated="message.repeated"
                  :repeatedThread="message.repeatedThread"
                  :threadLength="message.threadLength"
                  :medalName="message.medalName"
                  :medalLevel="message.medalLevel"
                  :isFanGroup="message.isFanGroup"
                  :isDelete="message.isDelete"
                  
                  :contentParts="getShowContentParts(message)"
                ></text-message>
                <paid-message :key="message.id" v-else-if="message.type === MESSAGE_TYPE_GIFT"
                  class="style-scope yt-live-chat-item-list-renderer"
                  :time="message.time"
                  :avatarUrl="message.avatarUrl"
                  :authorName="getShowAuthorName(message)"
                  :price="message.price"
                  :content="getGiftShowContent(message)"
                  :giftName="message.giftName"
                  :isDelete="message.isDelete"
                ></paid-message>
                <membership-item :key="message.id" v-else-if="message.type === MESSAGE_TYPE_MEMBER"
                  class="style-scope yt-live-chat-item-list-renderer"
                  :time="message.time"
                  :avatarUrl="message.avatarUrl"
                  :authorName="getShowAuthorName(message)"
                  :price="message.price"
                  :guardNum="message.guardNum"
                  :guardUnit="message.guardUnit"
                  :privilegeType="message.privilegeType"
                  :title="message.title"
                  :isDelete="message.isDelete"
                ></membership-item>
                <paid-message :key="message.id" v-else-if="message.type === MESSAGE_TYPE_SUPER_CHAT"
                  class="style-scope yt-live-chat-item-list-renderer"
                  giftName="superchat"
                  :time="message.time"
                  :avatarUrl="message.avatarUrl"
                  :authorName="getShowAuthorName(message)"
                  :price="message.price"
                  :content="getShowContent(message)"
                  :isDelete="message.isDelete"
                ></paid-message>
              </template>
            </transition-group>
          </div>
        </div>
      </div>
    </yt-live-chat-item-list-renderer>
  </yt-live-chat-renderer>
    `,
    name: 'ChatRenderer',
    components: {
      Ticker,
      InteractMessage,
      TextMessage,
      MembershipItem,
      PaidMessage
    },
    props: {
      maxNumber: {
        type: Number,
      },
      showGiftName: {
        type: Boolean,
      },
      mergeGift: {
        type: Boolean,
      },
      mergeSimilarDanmaku: {
        type: Boolean,
      },

      // Kuma version value, can not be used outside now
      fadeOutNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        MESSAGE_TYPE_INTERACT: null,
        MESSAGE_TYPE_TEXT: constants.MESSAGE_TYPE_TEXT,
        MESSAGE_TYPE_GIFT: constants.MESSAGE_TYPE_GIFT,
        MESSAGE_TYPE_MEMBER: constants.MESSAGE_TYPE_MEMBER,
        MESSAGE_TYPE_SUPER_CHAT: constants.MESSAGE_TYPE_SUPER_CHAT,
        
  
        messages: [],                        // 显示的消息
        paidMessages: [],                    // 固定在上方的消息
  
        smoothedMessageQueue: [],            // 平滑消息队列，由外部调用addMessages等方法添加
        emitSmoothedMessageTimerId: null,    // 消费平滑消息队列的定时器ID
        enqueueIntervals: [],                // 最近进队列的时间间隔，用来估计下次进队列的时间
        lastEnqueueTime: null,               // 上次进队列的时间
        estimatedEnqueueInterval: null,      // 估计的下次进队列时间间隔
  
        messagesBuffer: [],                  // 暂时未显示的消息，当不能自动滚动时会积压在这
        preinsertHeight: 0,                  // 插入新消息之前items的高度
        isSmoothed: true,                    // 是否平滑滚动，当消息太快时不平滑滚动
        chatRateMs: 1000,                    // 用来计算消息速度
        scrollPixelsRemaining: 0,            // 平滑滚动剩余像素
        scrollTimeRemainingMs: 0,            // 平滑滚动剩余时间
        lastSmoothChatMessageAddMs: null,    // 上次showNewMessages时间
        smoothScrollRafHandle: null,         // 平滑滚动requestAnimationFrame句柄
        lastSmoothScrollUpdate: null,        // 平滑滚动上一帧时间
  
        onLeave: false,                      // 判断消息是否正在出列，保证出列动画执行时无入列
        atBottom: true,                      // 滚动到底部，用来判断能否自动滚动
        cantScrollStartTime: null,           // 开始不能自动滚动的时间，用来防止卡住
        updateTimerId: window.setInterval(this.updateProgress, 1000)
      }
    },
    computed: {
      canScrollToBottom() {
        return this.atBottom/* || this.allowScroll */
      }
    },
    watch: {
      canScrollToBottom(val) {
        this.cantScrollStartTime = val ? null : new Date()
      },
    },
    mounted() {
      this.scrollToBottom()
    },
    beforeDestroy() {
      if (this.emitSmoothedMessageTimerId) {
        window.clearTimeout(this.emitSmoothedMessageTimerId)
        this.emitSmoothedMessageTimerId = null
      }
      window.clearInterval(this.updateTimerId)
      this.clearMessages()
    },
    methods: {
      updateProgress() {
        if (this.pinTime == 0) {
          return
        }
        
        this.curTime = new Date()
        for (let i = 0; i < this.messages.length;) {
          let message = this.messages[i]
          if ((this.curTime - message.addTime) / 1000 >= this.pinTime) {
            // console.log('删除消息')
            this.messages.splice(i, 1)
          } else {
            i++
          }
        }
      },
      async onMessageLeave(el, done) {
        let time_interval = this.estimatedEnqueueInterval
        let curTime = new Date()
        
        // console.log(curTime - this.lastEnqueueTime)
        // console.log(time_interval)
        el.classList.add('leaving')
        if (time_interval < 1650 && curTime - this.lastEnqueueTime < 2000) {
          // console.log('消息过快，省略动画')
          done()
          await this.$nextTick()
          
          this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
          return
        }
        this.onLeave = true
  
        // 等 100ms 后执行
        window.setTimeout(() => {
          el.classList.add('collapsing')
          done()
          this.$refs.itemOffset.classList.add('collapsing')
          this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
          window.setTimeout(() => {
            this.$refs.itemOffset.classList.remove('collapsing')
            el.classList.remove('leaving')
            el.classList.remove('collapsing')
            this.onLeave = false
  
          }, 200)
        }, 100)
      },
      getGiftShowContent(message) {
        return constants.getGiftShowContent(message, this.showGiftName)
      },
      getGiftShowNameAndNum: constants.getGiftShowNameAndNum,
      getShowContent: constants.getShowContent,
      getShowContentParts: constants.getShowContentParts,
      getShowAuthorName: constants.getShowAuthorName,

      addMessage(message) {
        this.addMessages([message])
      },
      addMessages(messages) {
        this.enqueueMessages(messages)
      },
      forEachRecentMessage(num, callback) {
        // 从新到老遍历num条消息
        for (let i = this.smoothedMessageQueue.length - 1; i >= 0 && num > 0; i--) {
          let messageGroup = this.smoothedMessageQueue[i]
          for (let j = messageGroup.length - 1; j >= 0 && num-- > 0; j--) {
            if (!callback(messageGroup[j])) {
              return
            }
          }
        }
        for (let arr of [this.messagesBuffer, this.messages]) {
          for (let i = arr.length - 1; i >= 0 && num-- > 0; i--) {
            if (!callback(arr[i])) {
              return
            }
          }
        }
      },
      delMessage(id) {
        this.delMessages([id])
      },
      delMessages(ids) {
        this.enqueueMessages(ids.map(
          id => ({
            type: constants.MESSAGE_TYPE_DEL,
            id
          })
        ))
      },
      clearMessages() {
        this.messages = []
        this.paidMessages = []
        this.smoothedMessageQueue = []
        this.messagesBuffer = []
        this.isSmoothed = true
        this.lastSmoothChatMessageAddMs = null
        this.chatRateMs = 1000
        this.lastSmoothScrollUpdate = null
        this.scrollTimeRemainingMs = this.scrollPixelsRemaining = 0
        this.smoothScrollRafHandle = null
        this.preinsertHeight = 0
        this.maybeResizeScrollContainer()
        if (!this.atBottom) {
          this.scrollToBottom()
        }
      },
      updateMessage(id, newValuesObj) {
        this.enqueueMessages([{
          type: constants.MESSAGE_TYPE_UPDATE,
          id,
          newValuesObj
        }])
      },
      enqueueMessages(messages) {
        // 估计进队列时间间隔
        if (!this.lastEnqueueTime) {
          this.lastEnqueueTime = new Date()
        } else {
          let curTime = new Date()
          let interval = curTime - this.lastEnqueueTime
          // 真实的进队列时间间隔模式大概是这样：2500, 300, 300, 300, 2500, 300, ...
          // B站消息有缓冲，会一次发多条消息。这里把波峰视为发送了一次真实的WS消息，所以要过滤掉间隔太小的
          if (interval > 1000 || this.enqueueIntervals.length < 5) {
            this.enqueueIntervals.push(interval)
            if (this.enqueueIntervals.length > 5) {
              this.enqueueIntervals.splice(0, this.enqueueIntervals.length - 5)
            }
            // 这边估计得尽量大，只要不太早把消息缓冲发完就是平滑的。有MESSAGE_MAX_INTERVAL保底，不会让消息延迟太大
            // 其实可以用单调队列求最大值，偷懒不写了
            this.estimatedEnqueueInterval = Math.max(...this.enqueueIntervals)
          }
          // 上次入队时间还是要设置，否则会太早把消息缓冲发完，然后较长时间没有新消息
          this.lastEnqueueTime = curTime
        }
  
        // 把messages分成messageGroup，每个组里最多有1个需要平滑的消息
        let messageGroup = []
        for (let message of messages) {
          messageGroup.push(message)
          if (this.messageNeedSmooth(message)) {
            this.smoothedMessageQueue.push(messageGroup)
            messageGroup = []
          }
        }
        // 还剩下不需要平滑的消息
        if (messageGroup.length > 0) {
          if (this.smoothedMessageQueue.length > 0) {
            // 和上一组合并
            let lastMessageGroup = this.smoothedMessageQueue[this.smoothedMessageQueue.length - 1]
            for (let message of messageGroup) {
              lastMessageGroup.push(message)
            }
          } else {
            // 自己一个组
            this.smoothedMessageQueue.push(messageGroup)
          }
        }
  
        if (!this.emitSmoothedMessageTimerId) {
          this.emitSmoothedMessageTimerId = window.setTimeout(this.emitSmoothedMessages)
        }
      },
      messageNeedSmooth({ type }) {
        return NEED_SMOOTH_MESSAGE_TYPES.indexOf(type) !== -1
      },
      emitSmoothedMessages() {
        this.emitSmoothedMessageTimerId = null
        if (this.smoothedMessageQueue.length <= 0) {
          return
        }
  
        // 估计的下次进队列剩余时间
        let estimatedNextEnqueueRemainTime = 10 * 1000
        if (this.estimatedEnqueueInterval) {
          estimatedNextEnqueueRemainTime = Math.max(this.lastEnqueueTime - new Date() + this.estimatedEnqueueInterval, 1)
        }
        // 计算发送的消息数，保证在下次进队列之前发完
        // 下次进队列之前应该发多少条消息
        let shouldEmitGroupNum = Math.max(this.smoothedMessageQueue.length, 0)
        // 下次进队列之前最多能发多少次
        let maxCanEmitCount = estimatedNextEnqueueRemainTime / MESSAGE_MIN_INTERVAL
        // 这次发多少条消息
        let groupNumToEmit
        if (shouldEmitGroupNum < maxCanEmitCount) {
          // 队列中消息数很少，每次发1条也能发完
          groupNumToEmit = 1
        } else {
          // 每次发1条以上，保证按最快速度能发完
          groupNumToEmit = Math.ceil(shouldEmitGroupNum / maxCanEmitCount)
        }
  
        // 发消息
        let messageGroups = this.smoothedMessageQueue.splice(0, groupNumToEmit)
        let mergedGroup = []
        for (let messageGroup of messageGroups) {
          for (let message of messageGroup) {
            mergedGroup.push(message)
          }
        }
        this.handleMessageGroup(mergedGroup)
  
        if (this.smoothedMessageQueue.length <= 0) {
          return
        }
        // 消息没发完，计算下次发消息时间
        let sleepTime
        if (groupNumToEmit === 1) {
          // 队列中消息数很少，随便定个[MESSAGE_MIN_INTERVAL, MESSAGE_MAX_INTERVAL]的时间
          sleepTime = estimatedNextEnqueueRemainTime / this.smoothedMessageQueue.length
          sleepTime *= 0.5 + Math.random()
          if (sleepTime > MESSAGE_MAX_INTERVAL) {
            sleepTime = MESSAGE_MAX_INTERVAL
          } else if (sleepTime < MESSAGE_MIN_INTERVAL) {
            sleepTime = MESSAGE_MIN_INTERVAL
          }
        } else {
          // 按最快速度发
          sleepTime = MESSAGE_MIN_INTERVAL
        }
        this.emitSmoothedMessageTimerId = window.setTimeout(this.emitSmoothedMessages, sleepTime)
      },
  
      handleMessageGroup(messageGroup) {
        if (messageGroup.length <= 0) {
          return
        }
  
        for (let message of messageGroup) {
          switch (message.type) {
          // case constants.MESSAGE_TYPE_INTERACT:
          case constants.MESSAGE_TYPE_TEXT:
          case constants.MESSAGE_TYPE_GIFT:
          case constants.MESSAGE_TYPE_MEMBER:
          case constants.MESSAGE_TYPE_SUPER_CHAT:
            this.handleAddMessage(message)
            break
          case constants.MESSAGE_TYPE_DEL:
            this.handleDelMessage(message)
            break
          case constants.MESSAGE_TYPE_UPDATE:
            this.handleUpdateMessage(message)
            break
          }
        }
  
        this.maybeResizeScrollContainer()
        this.flushMessagesBuffer()
        this.$nextTick(this.maybeScrollToBottom)
      },
      //* 处理新信息的消息入栈
      handleAddMessage(message) {
        // 添加一个本地时间给Ticker用，防止本地时间和服务器时间相差很大的情况
        message.addTime = new Date()

        if (message.type !== constants.MESSAGE_TYPE_TEXT) {
          this.paidMessages.unshift(_.cloneDeep(message))
          const MAX_PAID_MESSAGE_NUM = 100
          if (this.paidMessages.length > MAX_PAID_MESSAGE_NUM) {
            this.paidMessages.splice(MAX_PAID_MESSAGE_NUM, this.paidMessages.length - MAX_PAID_MESSAGE_NUM)
          }
        }

        // 不知道cloneDeep拷贝Vue的响应式对象会不会有问题，保险起见把这句放在后面
        this.messagesBuffer.push(message)
      },
      handleDelMessage({ id }) {
        for (let arr of [this.messages, this.paidMessages, this.messagesBuffer]) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              arr.splice(i, 1)
              this.resetSmoothScroll()
              break
            }
          }
        }
      },
      handleUpdateMessage({ id, newValuesObj }) {
        // 遍历滚动的消息
        
        this.forEachRecentMessage(999999999, message => {
          if (message.id !== id) {
            return true
          }
          for (let name in newValuesObj) {
            message[name] = newValuesObj[name]
          }
          return false
        })
        // 遍历固定的消息
        for (let message of this.paidMessages) {
          if (message.id !== id) {
            continue
          }
          for (let name in newValuesObj) {
            message[name] = newValuesObj[name]
          }
          break
        }
        this.resetSmoothScroll()
      },
  
      async flushMessagesBuffer() {
        if (this.messagesBuffer.length <= 0) {
          return
        }
        if (this.onLeave) {
          // console.log('删除动画进行中')
          return
        }
  
        if (!this.canScrollToBottomOrTimedOut()) {
          if (this.messagesBuffer.length > this.maxNumber) {
            // 未显示消息数 > 最大可显示数，丢弃
            this.messagesBuffer.splice(0, this.messagesBuffer.length - this.maxNumber)
          }
          return
        }
        
        // 当buffer和现存队列中的消息总数超过maxNumber（最大弹幕数的时候），给旧弹幕加上delete属性，让CSS做消失动画
        let deleteNum = Math.max(this.messages.length + this.messagesBuffer.length - this.maxNumber, 0)
        if (deleteNum > 0 && this.fadeOutNum > 0) {
          for (let i = 0; i < this.messages.length; i++) {
            if (i < deleteNum) {
              this.messages[i].isDelete = true
            }
          }
          await this.$nextTick()
        }
  
        //* 留[fadeOutNum]条弹幕做delete动画（默认为5）
        let removeNum = Math.max(this.messages.length + this.messagesBuffer.length - this.maxNumber - this.fadeOutNum, 0)
        if (removeNum > 0) {
          this.messages.splice(0, removeNum)
          // 防止同时添加和删除项目时所有的项目重新渲染 https://github.com/vuejs/vue/issues/6857
          await this.$nextTick()
        }
  
        this.calculateHeight()
        
        for (let message of this.messagesBuffer) {
          this.messages.push(message)
        }
        this.messagesBuffer = []
        // 等items高度变化
        await this.$nextTick()
        
        this.showNewMessages()
      },
      calculateHeight() {
        this.preinsertHeight = this.$refs.items.clientHeight
      },
      showNewMessages() {
        let hasScrollBar = this.$refs.items.clientHeight > this.$refs.scroller.clientHeight
        
        this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
        // console.log(`itemOffset.height = ${this.$refs.itemOffset.style.height}`)
        if (!this.canScrollToBottomOrTimedOut() || !hasScrollBar) {
          return
        }
  
        // 计算剩余像素
        this.scrollPixelsRemaining += this.$refs.items.clientHeight - this.preinsertHeight
        
        this.scrollToBottom()
        
  
        // 计算是否平滑滚动、剩余时间
        if (!this.lastSmoothChatMessageAddMs) {
          this.lastSmoothChatMessageAddMs = performance.now()
        }
        let interval = performance.now() - this.lastSmoothChatMessageAddMs
        this.chatRateMs = (0.9 * this.chatRateMs) + (0.1 * interval)
        if (this.isSmoothed) {
          if (this.chatRateMs < 400) {
            this.isSmoothed = false
          }
        } else {
          if (this.chatRateMs > 450) {
            this.isSmoothed = true
          }
        }
        this.scrollTimeRemainingMs += this.isSmoothed ? CHAT_SMOOTH_ANIMATION_TIME_MS : 0
  
        if (!this.smoothScrollRafHandle) {
          this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
        }
        this.lastSmoothChatMessageAddMs = performance.now()
  
      },
      smoothScroll(time) {
        if (!this.lastSmoothScrollUpdate) {
          // 第一帧
          this.lastSmoothScrollUpdate = time
          this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
          return
        }
  
        let interval = time - this.lastSmoothScrollUpdate
        if (
          this.scrollPixelsRemaining <= 0 || this.scrollPixelsRemaining >= 400  // 已经滚动到底部或者离底部太远则结束
          || interval >= 1000 // 离上一帧时间太久，可能用户切换到其他网页
          || this.scrollTimeRemainingMs <= 0 // 时间已结束
        ) {
          this.resetSmoothScroll()
          return
        }
  
        let pixelsToScroll = interval / this.scrollTimeRemainingMs * this.scrollPixelsRemaining
        this.scrollPixelsRemaining -= pixelsToScroll
        if (this.scrollPixelsRemaining < 0) {
          this.scrollPixelsRemaining = 0
        }
        this.scrollTimeRemainingMs -= interval
        if (this.scrollTimeRemainingMs < 0) {
          this.scrollTimeRemainingMs = 0
        }
        this.lastSmoothScrollUpdate = time
        this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
      },
      resetSmoothScroll() {
        this.scrollTimeRemainingMs = this.scrollPixelsRemaining = 0
        this.lastSmoothScrollUpdate = null
        if (this.smoothScrollRafHandle) {
          window.cancelAnimationFrame(this.smoothScrollRafHandle)
          this.smoothScrollRafHandle = null
        }
      },
      maybeResizeScrollContainer() {
        this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
        this.maybeScrollToBottom()
      },
      maybeScrollToBottom() {
        if (this.canScrollToBottomOrTimedOut()) {
          this.scrollToBottom()
        }
      },
      scrollToBottom() {
        this.$refs.scroller.scrollTop = Math.pow(2, 24)
        this.atBottom = true
      },
      onScroll() {
        this.refreshCantScrollStartTime()
        let scroller = this.$refs.scroller
        this.atBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < SCROLLED_TO_BOTTOM_EPSILON
        this.flushMessagesBuffer()
      },
      canScrollToBottomOrTimedOut() {
        if (this.canScrollToBottom) {
          return true
        }
        // 防止在OBS中卡住，超过一定时间也可以自动滚动
        return new Date() - this.cantScrollStartTime >= 5 * 1000
      },
      refreshCantScrollStartTime() {
        // 有鼠标事件时刷新，防止用户看弹幕时自动滚动
        if (this.cantScrollStartTime) {
          this.cantScrollStartTime = new Date()
        }
      },
    }
  }
  return exports
}))
