<template>
  <el-popover
    v-if="isShownNodePopover"
    :value="isShownNodePopover"
    class="card"
    width="220"
    placement="top"
    trigger="manual"
  >
    <ul>
      <li>ID: {{ node.id }}</li>
      <li>Name: {{ node.name }}</li>
      <li>Type: {{ node.dataClass }}</li>
    </ul>
  </el-popover>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    node() {
      return this.$store.getters['data/getNodeById'](this.hoveredNodeId)
    },
    ...mapState('interaction', ['hoveredNodeId']),
    ...mapGetters('interaction', ['isShownNodePopover'])
  }
}
</script>

<style lang="sass" scoped>
@import ../_workspace

$popover-height: 80px
$popover-width: 220px

.card
  width: $popover-width
  height: $popover-height
  position: absolute
  margin-left: auto
  margin-right: auto
  left: 0
  right: 0
  top: $workspace-margin
</style>
