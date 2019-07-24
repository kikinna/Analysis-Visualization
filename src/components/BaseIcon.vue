<template>
  <g v-if="useSvg">
    <image
      :x="-rad"
      :y="-rad"
      :height="2 * rad"
      :width="2 * rad"
      :xlink:href="src"
      draggable="false"
    ></image>
  </g>

  <span v-else>
    <img :src="src" :width="rad" :height="rad" draggable="false" />
  </span>
</template>

<script>
export default {
  props: {
    name: String,
    radius: {
      type: Number,
      default: 20
    },
    useSvg: Boolean
  },

  computed: {
    src() {
      try {
        return require(`@/assets/icons/${this.internalName}.svg`)
      } catch (err) {
        return require('@/assets/icons/question-mark.svg')
      }
    },
    internalName() {
      return this.name
    },
    rad() {
      return this.radius
    }
  }
}
</script>
