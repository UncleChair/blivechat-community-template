(function(root, factory) {
  root.chatRendererTextMessage = factory(
    root.chatRendererConstants,
    root.chatRendererImgShadow.default,
    root.chatRendererAuthorMedal.default,
    root.chatRendererAuthorBadge.default,
  )
}(this,
/**
 * @import * as constants from './constants'
 * @import * as ImgShadow from './ImgShadow'
 * @import * as AuthorMedal from './AuthorMedal'
 * @import * as AuthorBadge from './AuthorBadge'
 * @param {typeof constants} constants
 * @param {typeof ImgShadow.default} ImgShadow
 * @param {typeof AuthorMedal.default} AuthorMedal
 * @param {typeof AuthorBadge.default} AuthorBadge
 */
function(constants, ImgShadow, AuthorMedal, AuthorBadge) {
  const exports = {}

  // HSL
  const REPEATED_MARK_COLOR_START = [210, 100.0, 62.5]
  const REPEATED_MARK_COLOR_END = [360, 87.3, 69.2]

  exports.default = {
    template: `
  <yt-live-chat-text-message-renderer
    :is-fan-group="isFanGroup"
    :medal-level="medalLevel"
    :author-type="authorTypeText"
    :privilegeType="privilegeType"
    :is-admin="authorType === 2"
    :is-owner="authorType === 3"
    :is-deleted="isDelete"
    >
    <div id="card" class="style-scope yt-live-chat-text-message-renderer">
      <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
        :imgUrl="avatarUrl"
      ></img-shadow>
      <div id="content" class="style-scope yt-live-chat-text-message-renderer">
        <yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
          <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{timeText}}</span>
          <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :type="authorTypeText">{{
            authorName
            }}<!-- 这里是已验证勋章 -->
            <span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
          </span>
          <span id="chat-medal" class="style-scope yt-live-chat-author-chip">
            <author-medal class="style-scope yt-live-chat-author-chip"
              :medalLevel="medalLevel" :medalName="medalName" :isFanGroup="isFanGroup"
            ></author-medal>
          </span>
          <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
            <author-badge class="style-scope yt-live-chat-author-chip"
              :isAdmin="authorType === 2" :privilegeType="privilegeType"
            ></author-badge>
          </span>
        </yt-live-chat-author-chip>
        <div id='image-and-message' class="style-scope yt-live-chat-text-message-renderer">
          <template v-for="(content, index) in contentParts">
            <span :key="index" v-if="content.type === CONTENT_PART_TYPE_TEXT" id="message" class="style-scope yt-live-chat-text-message-renderer"
              display="block"
              :style=""
            >{{ content.text }}</span>
            <img :key="index" v-else-if="content.type === CONTENT_PART_TYPE_IMAGE"
              class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer"
              :src="content.url" :alt="content.text" :shared-tooltip-text="content.text" :id="\`emoji-\${content.text}\`"
              :width="content.width" :height="content.height"
              :class="{ 'blc-large-emoji': content.height >= 100 }"
            >
          </template>
          <el-badge :value="repeated" :max="99" v-if="repeated > 1" class="style-scope yt-live-chat-text-message-renderer"
            :style="{ '--repeated-mark-color': repeatedMarkColor }"
          ></el-badge>
        </div>
      </div>
    </div>
  </yt-live-chat-text-message-renderer>
    `,
    name: 'TextMessage',
    data() {
      return {
        CONTENT_PART_TYPE_TEXT: constants.CONTENT_PART_TYPE_TEXT,
        CONTENT_PART_TYPE_IMAGE: constants.CONTENT_PART_TYPE_IMAGE,
      }
    },
    components: {
      ImgShadow,
      AuthorMedal,
      AuthorBadge
    },
    props: {
      avatarUrl: String,
      time: Date,
      authorName: String,
      authorType: Number,
      medalName: String,
      medalLevel: Number,
      isFanGroup: Boolean,
      isDelete: Boolean,
      emoticon: String,
      contentParts: Array,
      privilegeType: Number,
      repeated: Number
    },
    computed: {
      timeText() {
        return constants.getTimeTextHourMin(this.time)
      },
      authorTypeText() {
        // 优先判断舰长
        return this.privilegeType > 0 ? 'member' : constants.AUTHOR_TYPE_TO_TEXT[this.authorType]
      },
      
      repeatedMarkColor() {
        let color
        if (this.repeated <= 2) {
          color = REPEATED_MARK_COLOR_START
        } else if (this.repeated >= 10) {
          color = REPEATED_MARK_COLOR_END
        } else {
          color = [0, 0, 0]
          let t = (this.repeated - 2) / (10 - 2)
          for (let i = 0; i < 3; i++) {
            color[i] = REPEATED_MARK_COLOR_START[i] + ((REPEATED_MARK_COLOR_END[i] - REPEATED_MARK_COLOR_START[i]) * t)
          }
        }
        return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
      }
    }
  }

  return exports
}))
