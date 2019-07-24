<template>
  <div>
    <Toolbar class="toolbar" />
    <div id="cards-right">
      <NodeDetailCard />
      <NodeSelectionCard />
      <LinkDetailCard />
    </div>
    <NodePopover />
    <NetworkGraph />
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue'
import NetworkGraph from '@/components/NetworkGraph.vue'
import NodeDetailCard from '@/components/Tools/NodeDetailCard.vue'
import NodeSelectionCard from '@/components/Tools/NodeSelectionCard.vue'
import NodePopover from '@/components/NetworkGraph/NodePopover.vue'
import LinkDetailCard from '@/components/Tools/LinkDetailCard.vue'

export default {
  components: {
    Toolbar,
    NetworkGraph,
    NodeDetailCard,
    NodeSelectionCard,
    NodePopover,
    LinkDetailCard
  },

  created() {
    this.$store.dispatch('data/fetchData')
  },

  errorCaptured(err, vm, info) {
    alert(
      'Error: application crashed. Graph/data may be in invalid state. See console logs for more.'
    )
  }
}
</script>

<style lang="sass" scoped>
@import _workspace

.toolbar
  position: absolute
  top: 0
  width: 100%
  height: $toolbar-height
  pointer-events: none
  margin: $workspace-margin

#cards-right
  width: $card-right-width
  position: absolute
  right: 30px
  top: 30px
</style>
