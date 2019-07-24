<template>
  <el-card v-if="isShownNodeSelection" class="card-right">
    <div slot="header" class="clearfix">
      <span class="header-title">Selection</span>
      <el-button class="card-header-btn" icon="el-icon-close" @click="clearCloseNodeSelection"
        >Clear</el-button
      >
    </div>
    <ul>
      <li v-for="node in selectedNodes" :key="node">{{ node }}</li>
    </ul>
    <br />
    <el-button
      v-if="selectedNodes"
      plain
      @click="
        groupNodes(selectedNodes)
        clearCloseNodeSelection()
      "
      :disabled="selectedNodes.length > 1 ? false : true"
      >Group</el-button
    >
  </el-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('interaction', ['selectedNodes']),
    ...mapGetters('interaction', ['isShownNodeSelection'])
  },

  methods: {
    ...mapActions('interaction', ['clearCloseNodeSelection']),
    ...mapActions('data', ['groupNodes'])
  }
}
</script>

<style lang="sass" scoped>
@import ../_workspace

.card-right
  width: $card-right-width
  margin-bottom: 20px

.el-card__header
  padding: 12px 10px

.item
  margin-bottom: 18px

.clickable-icon
  cursor: pointer

.header-title
  padding: 10px
  margin-top: 50px
  position: relative
  top: 5px

.card-header-btn
  float: right
  padding: 8px 4px

.clearfix:before,
.clearfix:after
  display: table
  content: ''

.clearfix:after
  clear: both
</style>
