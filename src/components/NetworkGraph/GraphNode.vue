<template>
  <g
    class="node"
    :class="{ selected: isSelected, focused: isFocused, removed: isRemoved }"
    :transform="`translate(${graphX}, ${graphY})`"
  >
    <g v-if="!isRemoved" class="node-label">
      <rect
        class="node-label-box"
        width="135"
        height="20"
        rx="5"
        ry="5"
        y="-10"
        :x="node.type == 'group' ? visuals.node.group_circles_rad_diff / 2.0 : 0"
      />
      <text
        :id="`node-label-text-${node.id}`"
        class="node-label-text"
        dx="24"
        dy="4"
        :x="node.type == 'group' ? visuals.node.group_circles_rad_diff : 0"
        >{{ node.label }}</text
      >
    </g>

    <g
      v-dragged.prevent="nodeDragged"
      class="node-icon"
      @mousedown.prevent
      @mousedown.left.exact="isUserSelecting = true"
      @mousedown.middle.exact="isFocused = true"
      @mouseover="nodeMouseover"
      @mouseout="nodeMouseout"
    >
      <!-- @mousedown.prevent because defaults fire dragging on the image/text selection -->

      <circle
        v-if="node.type === 'group'"
        class="node-circle"
        :r="visCircleRadius + visuals.node.group_circles_rad_diff"
      />
      <circle
        v-if="isFocused && isSelected"
        class="node-circle-focused-and-selected"
        :r="visCircleRadius"
      />
      <circle
        :id="`node-circle-${node.id}`"
        class="node-circle"
        :class="{ 'connected-link-hovered': isConnectedLinkHovered }"
        :r="visCircleRadius"
        :fill="`#fff`"
      />
      <BaseIcon
        v-if="!isRemoved"
        use-svg
        :name="node.type === 'group' ? 'group' : isRemoved ? 'deleted' : node.dataClass"
        :radius="visCircleRadius"
      />
    </g>
  </g>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import VDragged from 'v-dragged'
Vue.use(VDragged)

export default {
  props: {
    dataId: { type: Number, required: true },
    // all d3-force calculated data:
    graphX: { type: Number, required: true },
    graphY: { type: Number, required: true },
    moveCallback: { type: Function, required: true }
  },

  data() {
    return {
      isDragging: false,
      currentDragLength: 0, // approx. px to distinguish single-click from drag
      isUserSelecting: false,
      overrideMouseEvents: false,

      visuals: {
        node: {
          circleRadius: 20,
          group_circles_rad_diff: 5
        }
      }
    }
  },

  computed: {
    node() {
      return this.$store.getters['data/getNodeById'](this.dataId)
    },
    isConnectedLinkHovered() {
      /*const focusedLinkId = this.$store.getters['interaction/getFocusedLinkId']
      if (!focusedLinkId) return

      const link = this.$store.getters['data/getLinkById'](focusedLinkId)
      if (!link) return
      return link.target === this.node.id || link.source === this.node.id*/
      return false
    },
    isFocused() {
      return this.$store.getters['interaction/isNodeFocused'](this.dataId)
    },
    isSelected() {
      return this.$store.getters['interaction/isNodeSelected'](this.dataId)
    },
    isRemoved() {
      return this.node.vis && this.node.vis.isRemoved
    },
    visCircleRadius() {
      if (this.isFocused && this.isSelected) return this.visuals.node.circleRadius + 1
      if (this.isRemoved) return this.visuals.node.circleRadius
      return this.visuals.node.circleRadius
    }
  },

  watch: {
    node: function(n) {
      if (!n) throw Error('Graph is trying to display unknown node')
    }
  },

  methods: {
    ...mapMutations('interaction', [
      'SET_NODE_FOCUS',
      'UNSET_NODE_FOCUS',
      'SELECT_NODE',
      'UNSELECT_NODE',
      'SET_TOOL_SHOW'
    ]),

    nodeDragged({ deltaX, deltaY, first, last, offsetX, offsetY }) {
      if (first) {
        this.isDragging = true
        this.overrideMouseEvents = true
        this.currentDragLength = 0
        return
      }
      if (last) {
        this.isDragging = false
        this.overrideMouseEvents = false

        // if user held the node without dragging,
        // interpret is as a selection/focus
        if (this.currentDragLength < 4) {
          if (this.isUserSelecting) {
            this.isSelected ? this.UNSELECT_NODE(this.dataId) : this.SELECT_NODE(this.dataId)

            // Fire when user selects a node for aggregation
            // @arg id /*data id*/
            this.$emit(this.isSelected ? 'node-select' : 'node-unselect', this.node.id)
            this.isUserSelecting = false
          } else {
            this.isFocused ? this.UNSET_NODE_FOCUS() : this.SET_NODE_FOCUS(this.dataId)

            // Fire when user focuses on a node
            // @arg id /*data id*/
            this.$emit(this.isFocused ? 'node-focus' : 'node-unfocus', this.node.id)
          }
        }
        return
      }
      this.currentDragLength = Math.abs(offsetX) + Math.abs(offsetY)
      // Fire when user moves the node
      // @arg {id /*node id*/, x /*delta*/, y /*delta*/}
      //this.$emit('node-drag', { id: this.node.id, x: deltaX, y: deltaY })
      this.moveCallback({ id: this.node.id, x: deltaX, y: deltaY })
    },

    nodeMouseover() {
      if (!this.overrideMouseEvents) this.$emit('node-mouseover', this.node.id)
    },
    nodeMouseout() {
      if (!this.overrideMouseEvents) this.$emit('node-mouseout', this.node.id)
    }
  }
}
</script>

<style lang="sass" scoped>
.node-circle
  stroke-width: 1.5px
  stroke: #d8d8d8
  fill: #fff

.node.removed
  .node-circle
    stroke-dasharray: 4
    image
      fill: red

.node-label-box
  display: inline
  fill: #f2f2f2

.node-label-text
  font-size: 9pt
  fill: #666
  display: inline

.focused .node-icon .node-circle
  stroke: #979797

.selected .node-icon .node-circle
  stroke: #1e2dff
  stroke-width: 1.5px

.node-circle-focused-and-selected
  stroke: #979797
  stroke-width: 3.5px

.node-circle.connected-link-hovered
  stroke: #757575
</style>
