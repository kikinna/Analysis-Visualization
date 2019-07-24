<template>
  <el-card v-if="isShownNodeDetail" class="card-right">
    <div slot="header" class="clearfix">
      <span>Node detail</span>
      <i
        class="el-icon-close clickable-icon"
        style="float: right; padding: 3px 0"
        @click="hideNodeDetail"
      ></i>
    </div>
    <ul>
      <BaseIcon :name="node.dataClass" />

      <li v-for="(value, propertyName, index) in node" :key="index">
        {{ propertyName }}: {{ value }}
      </li>
    </ul>

    <el-button
      type="danger"
      plain
      @click="
        removeNode(node.id)
        hideNodeDetail()
      "
      >Remove</el-button
    >
    <el-button
      v-if="node.type === 'group'"
      plain
      @click="
        ungroupNode(node.id)
        hideNodeDetail()
      "
      >Ungroup</el-button
    >
  </el-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    node() {
      return this.$store.getters['data/getNodeById'](this.focusedNodeId)
    },
    ...mapState('interaction', ['focusedNodeId']),
    ...mapGetters('interaction', ['isShownNodeDetail'])
  },

  methods: {
    ...mapActions('interaction', ['hideNodeDetail']),
    ...mapActions('data', ['removeNode', 'ungroupNode'])
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
