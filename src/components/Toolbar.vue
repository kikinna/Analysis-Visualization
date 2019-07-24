<template>
  <div id="toolbar">
    <el-button @click="createNode">Create node</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    createNode() {
      this.$store.dispatch('data/createNode', {
        label: 'New node',
        name: 'unnamed',
        type: 'regular',
        vis: { isUserDefined: true }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import _workspace

#toolbar .el-button
  pointer-events: auto
</style>
