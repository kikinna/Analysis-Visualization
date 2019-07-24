<template>
  <el-card v-if="isShownLinkDetail" class="card-right">
    <div slot="header" class="clearfix">
      <span>Link detail</span>
      <i
        class="el-icon-close clickable-icon"
        style="float: right; padding: 3px 0"
        @click="hideLinkDetail"
      ></i>
    </div>
    <ul>
      <li>ID: {{ link.id }}</li>
      <li>Source: {{ sourceNode.label }} ({{ sourceNode.id }})</li>
      <li>Target: {{ targetNode.label }} ({{ targetNode.id }})</li>
      <li>Direction: {{ link.direction ? 'yes' : 'no' }}</li>
    </ul>
  </el-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    link() {
      return this.$store.getters['data/getLinkById'](this.focusedLinkId)
    },
    sourceNode() {
      return this.$store.getters['data/getNodeById'](this.link.source)
    },
    targetNode() {
      return this.$store.getters['data/getNodeById'](this.link.target)
    },
    ...mapState('interaction', ['focusedLinkId']),
    ...mapGetters('interaction', ['isShownLinkDetail'])
  },

  methods: {
    ...mapActions('interaction', ['hideLinkDetail'])
  }
}
</script>

<style lang="sass" scoped>
@import ../_workspace

.card-right
  width: $card-right-width
  margin-bottom: 20px

.item
  margin-bottom: 18px

.clickable-icon
  cursor: pointer

.clearfix:before,
.clearfix:after
  display: table
  content: ''

.clearfix:after
  clear: both
</style>
