(function(root, factory) {
  root.chatRendererAuthorMedal = factory(root.chatRendererConstants)
}(this,
/**
 * @import * as constants from './constants'
 * @param {typeof constants} constants
 */
function(constants) {
  const exports = {}

  exports.default = {
    template: `
  <yt-live-chat-author-medal-renderer v-if="medalName != undefined && medalLevel > 0" :medal-name="medalName" :medal-level="medalLevel" :is-fan-group="isFanGroup"
  :style="{
      '--yt-live-chat-medal-background-color': medalColor.bgColor,
      '--yt-live-chat-medal-border-color': medalColor.borderColor,
      '--yt-live-chat-medal-text-color': medalColor.textColor
    }"
  >
    <div id='medal-card' class="style-scope yt-live-chat-author-medal-renderer">
      <div id='medal-name' class="style-scope yt-live-chat-author-medal-renderer">{{medalName}}</div>
      <div id='medal-level' class="style-scope yt-live-chat-author-medal-renderer">{{medalLevel}}</div>
    </div>
  </yt-live-chat-author-medal-renderer>
    `,
    name: 'AuthorMedal',
    props: {
      medalName: String,
      medalLevel: Number,
      isFanGroup: Boolean
    },
    computed: {
      medalColor() {
        return constants.getMedalConfig(this.medalLevel).colors
      }
    }
  }

  return exports
}))
