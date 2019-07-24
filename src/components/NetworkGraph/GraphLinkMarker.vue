<template>
  <marker
    v-if="type === 'single-link-arrow'"
    id="single-link-arrow"
    class="marker"
    markerUnits="userSpaceOnUse"
    viewBox="0 -6 6 12"
    refX="29"
    refY="0"
    orient="auto"
    markerWidth="14"
    markerHeight="14"
    xoverflow="visible"
  >
    <polyline
      points="0,-4 4,0 0,4"
      stroke="#bbb"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="1px"
      fill="none"
    ></polyline>
  </marker>

  <marker
    v-else-if="type === 'multi-link-arrow'"
    id="multi-link-arrow"
    class="marker"
    markerUnits="userSpaceOnUse"
    viewBox="-1 -2 9 4"
    refX="18"
    refY="0"
    orient="auto"
    markerWidth="24"
    markerHeight="15"
    xoverflow="visible"
  >
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="5.3,-1.7 7,0 5.3,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
  </marker>

  <marker
    v-else-if="type === 'multi-link-arrow-opposite'"
    id="multi-link-arrow-opposite"
    class="marker"
    markerUnits="userSpaceOnUse"
    viewBox="-1 -2 9 4"
    refX="-11"
    refY="0"
    orient="auto"
    markerWidth="24"
    markerHeight="15"
    xoverflow="visible"
  >
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="1.7,-1.7 0,0 1.7,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
  </marker>

  <marker
    v-else-if="type === 'multi-link-arrow-bar'"
    id="multi-link-arrow-bar"
    class="marker"
    markerUnits="userSpaceOnUse"
    viewBox="-1 -2 9 4"
    refX="18"
    refY="0"
    orient="auto"
    markerWidth="24"
    markerHeight="15"
    xoverflow="visible"
  >
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="3.5,-1.7 3.5,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="5.3,-1.7 7,0 5.3,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
  </marker>

  <marker
    v-else-if="type === 'multi-link-arrow-bar-opposite'"
    id="multi-link-arrow-bar-opposite"
    class="marker"
    markerUnits="userSpaceOnUse"
    viewBox="-1 -2 9 4"
    refX="-11"
    refY="0"
    orient="auto"
    markerWidth="24"
    markerHeight="15"
    xoverflow="visible"
  >
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="1.7,-1.7 0,0 1.7,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
    <polyline
      stroke-linejoin="round"
      stroke-linecap="round"
      points="3.5,-1.7 3.5,1.7"
      stroke="#ccc"
      stroke-width="1px"
      fill="none"
    />
  </marker>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: function(value) {
        return (
          [
            'single-link-arrow',
            'multi-link-arrow',
            'multi-link-arrow-opposite',
            'multi-link-arrow-bar',
            'multi-link-arrow-bar-opposite'
          ].indexOf(value) !== -1
        )
      }
    }
  }
}
</script>
