(function(root, factory) {
  root.chatRendererAuthorChip = factory(root.chatRendererConstants, root.chatRendererAuthorBadge.default)
}(this,
/**
 * @import * as constants from './constants'
 * @import * as AuthorBadge from './AuthorBadge'
 * @param {typeof constants} constants
 * @param {typeof AuthorBadge.default} AuthorBadge
 */
function(constants, AuthorBadge) {
  const exports = {}

  exports.default = {
    template: `
  <yt-live-chat-author-chip>
    <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :class="{ member: isInMemberMessage }"
      :type="authorTypeText"
    >
      <template>{{ authorName }}</template>
      <span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
    </span>
    <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
      <author-badge v-if="isInMemberMessage" class="style-scope yt-live-chat-author-chip"
        :isAdmin="false" :privilegeType="privilegeType"
      ></author-badge>
      <template v-else>
        <author-badge v-if="authorType === AUTHOR_TYPE_ADMIN" class="style-scope yt-live-chat-author-chip"
          isAdmin :privilegeType="0"
        ></author-badge>
        <author-badge v-if="privilegeType > 0" class="style-scope yt-live-chat-author-chip"
          :isAdmin="false" :privilegeType="privilegeType"
        ></author-badge>
      </template>
    </span>
  </yt-live-chat-author-chip>
    `,
    name: 'AuthorChip',
    components: {
      AuthorBadge
    },
    props: {
      isInMemberMessage: Boolean,
      authorName: String,
      authorType: Number,
      privilegeType: Number
    },
    data() {
      return {
        AUTHOR_TYPE_ADMIN: constants.AUTHOR_TYPE_ADMIN
      }
    },
    computed: {
      authorTypeText() {
        return constants.AUTHOR_TYPE_TO_TEXT[this.authorType]
      }
    }
  }

  return exports
}))
