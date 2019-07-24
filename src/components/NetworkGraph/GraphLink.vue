<template>
  <g class="link" :class="{ focused: isFocused }">
    <line
      :id="`link-${link.id}`"
      :x1="source.x"
      :y1="source.y"
      :x2="target.x"
      :y2="target.y"
      class="link-line"
      :class="{
        hovered: isHovering,
        'with-arrows': link.direction === true,
        'user-defined': link.vis && link.vis.isUserDefined === true,
        transferred: link.vis && link.vis.isTransferred === true,
        multilink: link.vis && link.vis.isMultilink === true,
        'source-to-target': link.direction && link.direction.sourceToTarget,
        'target-to-source': link.direction && link.direction.targetToSource,
        'non-directional': link.direction && link.direction.nonDirectional
      }"
    ></line>

    <g v-if="!isNaN(pawSourcePosition.x)" class="link-paws">
      <circle
        v-for="pos in [pawSourcePosition, pawTargetPosition]"
        :key="`${pos.x}-${pos.y}`"
        :class="{ hovered: isHovering }"
        :r="graphVisuals.linkPawRadius"
        :cx="pos.x"
        :cy="pos.y"
      ></circle>
    </g>

    <line
      :x1="source.x"
      :y1="source.y"
      :x2="target.x"
      :y2="target.y"
      class="support-link"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @mousedown.prevent
      @mousedown.left.exact="changeFocus()"
    ></line>
  </g>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    dataId: { type: Number, required: true },
    graphVisuals: { type: Object, required: true },
    // all d3-force calculated data:
    source: { type: Object, required: true },
    target: { type: Object, required: true }
  },

  data() {
    return {
      isHovering: false
    }
  },

  computed: {
    link() {
      return this.$store.getters['data/getLinkById'](this.dataId)
    },
    isFocused() {
      return this.$store.getters['interaction/isLinkFocused'](this.dataId)
    },
    pawSourcePosition() {
      return this.calculatePawPosition(this.target, this.source)
    },
    pawTargetPosition() {
      return this.calculatePawPosition(this.source, this.target)
    },
    showLabel() {
      return this.isFocused || this.isHovering
    }
  },

  watch: {
    link: function(link) {
      if (!link) throw Error('Graph is trying to display unknown link')
    }
  },

  methods: {
    ...mapMutations('interaction', ['SET_LINK_FOCUS', 'UNSET_LINK_FOCUS', 'SET_TOOL_SHOW']),
    changeFocus() {
      this.isFocused ? this.UNSET_LINK_FOCUS() : this.SET_LINK_FOCUS(this.link.id)

      this.$emit(this.isFocused ? 'link-focus' : 'link-unfocus', this.link.id)
    },
    calculatePawPosition(source, target) {
      let x, y

      let x_diff = target.x - source.x
      let y_diff = target.y - source.y

      let length = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2))
      let x_diff_norm = x_diff / length
      let y_diff_norm = y_diff / length

      // TODO: handle group
      // if (d.source.type == 'group')
      //    return d.source.x + x_diff_norm * (this.visualProp.node_icon_rad/2.0 + this.visualProp.group_rad_diff);
      x = source.x + x_diff_norm * this.graphVisuals.nodeRadius
      y = source.y + y_diff_norm * this.graphVisuals.nodeRadius
      return { x, y }
    }
  }
}
</script>

<style lang="sass" scoped>
.link
  line
    stroke: #bbb
    &.with-arrows
      marker-end: url(#single-link-arrow)
    &.multilink
      stroke-width: 3px
      stroke: #ccc
      &.source-to-target
        marker-end: url(#multi-link-arrow)
        &.non-directional
          marker-end: url(#multi-link-arrow-bar)
      &.target-to-source
        marker-start: url(#multi-link-arrow-opposite)
        &.non-directional
          marker-start: url(#multi-link-arrow-bar-opposite)
    &.user-defined
      stroke-dasharray: 7,7
      stroke-linecap: round
    &.transferred
      stroke-dasharray: 0,6
      stroke-width: 2px
      stroke-linecap: round
      &.multilink
        stroke-width: 4px
    &.highlight.highlightable
      stroke: #444
  line.hovered
    stroke: #757575

.link.focused line.link-line
    stroke: #757575

.support-link
  stroke-opacity: 0
  stroke-width: 13px

text.label
  font-size: 9pt
  fill: #bbb

.link-paws
  circle
    fill: #bbb
  .focused
    fill: #444
  .hovered
    fill: #757575
</style>
