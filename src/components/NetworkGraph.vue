<template>
  <div>
    <div class="g-info">
      <p>
        Nodes: {{ data.nodes.length }}
        <br />
        Links: {{ data.links.length }}
      </p>
    </div>

    <div class="corner-tools">
      <p>
        <!--Simulation: {{ isSimulationRunning ? 'running' : 'stopped' }}-->
        <i v-if="isSimulationRunning" class="el-icon-loading"></i>
        <br />
        <!--<span v-if="forceSimulation">
          alpha: {{ forceSimulation.alpha().toFixed(4) }}
          <br />
          decay: {{ forceSimulation.alphaDecay().toFixed(4) }}
        </span>-->
      </p>
      <el-button
        icon="el-icon-time"
        circle
        @click="
          isSimulationRunning ? forceSimulation.stop() : forceSimulation.restart()
          isSimulationRunning = !isSimulationRunning
        "
      ></el-button>
      <el-button
        icon="el-icon-refresh"
        circle
        @click="
          forceSimulation.alpha(1)
          forceSimulation.restart()
        "
      ></el-button>
    </div>

    <svg
      id="network-graph"
      :width="graph.width"
      :height="graph.height"
      :class="{ panning: graph.isPanningOrZooming }"
    >
      <defs>
        <GraphLinkMarker
          v-for="t in [
            'single-link-arrow',
            'multi-link-arrow',
            'multi-link-arrow-opposite',
            'multi-link-arrow-bar',
            'multi-link-arrow-bar-opposite'
          ]"
          :key="`marker-${t}`"
          :type="t"
        />
      </defs>

      <rect id="zoom-pan-interaction-layer" width="100%" height="100%" fill-opacity="0" />

      <g id="g-elements">
        <g
          class="g-links"
          :transform="
            `translate(${graph.transform.x}, ${graph.transform.y}) 
               scale(${graph.transform.k})`
          "
        >
          <!-- when running force simulation, show a dumbed down version of links due to performance -->
          <transition name="fade-quick">
            <g v-if="graph.showTemporaryLinks && data.links.length < 100">
              <line
                v-for="link in data.links"
                :key="`temp-link-${link.id}`"
                :x1="link.source.x"
                :y1="link.source.y"
                :x2="link.target.x"
                :y2="link.target.y"
                class="temporary-link"
              />
            </g>
          </transition>

          <transition name="fade">
            <g v-if="!isSimulationRunning">
              <GraphLink
                v-for="link in data.links"
                :key="`link-${link.id}`"
                :dataId="link.id"
                :source="{
                  id: link.source.id,
                  x: link.source.x,
                  y: link.source.y
                }"
                :target="{
                  id: link.target.id,
                  x: link.target.x,
                  y: link.target.y
                }"
                :graphVisuals="visuals"
                @link-focus="showLinkDetail"
                @link-unfocus="hideLinkDetail"
              />
            </g>
          </transition>
        </g>

        <g
          class="g-nodes"
          :transform="
            `translate(${graph.transform.x}, ${graph.transform.y}) 
               scale(${graph.transform.k})`
          "
        >
          <GraphNode
            v-for="node in data.nodes"
            :key="`node-${node.id}`"
            :dataId="node.id"
            :graphX="node.x"
            :graphY="node.y"
            :moveCallback="moveNode"
            @node-mouseover="showNodePopover(node.id)"
            @node-mouseout="
              hideNodePopover()
              saveNodePosition(node.id, node.x, node.y)
            "
            @node-focus="showNodeDetail"
            @node-unfocus="hideNodeDetail"
            @node-select="showNodeSelection"
            @node-unselect="hideNodeSelectionIfEmpty"
          />

          <!-- Moving a node shall render it on top, ideally reordering the DOM
            – so events are triggered properly. For now, we simply render a copy 
            of the last moved node. The downside is, the order will reset after 
          moving another node, but it is acceptable.-->
          <use v-if="graph.lastMovedNodeId" :xlink:href="`#node-${graph.lastMovedNodeId}`" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
import * as d3 from 'd3' // TODO: import only needed modules

import GraphNode from '@/components/NetworkGraph/GraphNode.vue'
import GraphLink from '@/components/NetworkGraph/GraphLink.vue'
import GraphLinkMarker from '@/components/NetworkGraph/GraphLinkMarker.vue'

export default {
  components: {
    GraphNode,
    GraphLink,
    GraphLinkMarker
  },

  data() {
    return {
      data: {
        nodes: [
          /**
           * Presentational node
           * @typedef {Object} Node
           * @property {Number} id dataset ID
           * @property {Number} x current position (d3-force)
           * @property {Number} y current position (d3-force)
           * @property {Number} vx current velocity (d3-force)
           * @property {Number} vy current velocity (d3-force)
           * @property {Number} index d3-force index
           */
        ],
        links: [
          /**
           * Presentational link
           * @typedef {Object} Link
           * @property {Number} id dataset ID
           * @property {Node} source
           * @property {Node} target
           */
        ]
      },
      graph: {
        width: null,
        height: null,
        transform: { x: 0, y: 0, k: 1 }, // set by d3-zoom
        zoomMin: 0.2,
        zoomMax: 5,
        isPanningOrZooming: false,
        lastMovedNodeId: NaN, // to maintain moving node on top in DOM
        showTemporaryLinks: true
      },
      visuals: {
        nodeRadius: 20,
        linkPawRadius: 3
      },
      forceSimulation: null,
      isSimulationRunning: true
    }
  },

  watch: {
    // show/hide temporary links depending on simulation status
    isSimulationRunning: function(isRunning) {
      // hide after normal links are visible
      if (!isRunning) {
        setTimeout(() => (this.graph.showTemporaryLinks = false), 100)

        this.saveNodePositions(this.data.nodes)
      } else {
        this.graph.showTemporaryLinks = true
      }
    }
  },

  created() {
    this.setupData()
  },

  mounted() {
    this.updateWindowSize()
    this.$nextTick(function() {
      window.addEventListener('resize', this.updateWindowSize)
    })

    this.initGraph()
    this.setupZoomPan()

    this.$store.subscribe(mutation => {
      const pl = mutation.payload

      switch (mutation.type) {
        case 'data/ADD_NODE':
          this.respondAddNode(pl)
          break
        case 'data/REMOVE_NODES':
          this.respondRemoveNodes(pl)
          break
        case 'data/GROUP_NODES':
          this.respondGroupNode(pl)
          break
        case 'data/UNGROUP_NODE':
          this.respondUngroupNode(pl)
          break
        default:
          break
      }
    })
  },

  methods: {
    ...mapMutations('interaction', ['SET_NODE_HOVER', 'UNSET_NODE_HOVER']),
    ...mapActions('interaction', [
      'showNodeDetail',
      'hideNodeDetail',
      'showNodePopover',
      'hideNodePopover',
      'showNodeSelection',
      'hideNodeSelectionIfEmpty',
      'showLinkDetail',
      'hideLinkDetail'
    ]),
    ...mapActions('data', ['updateNodes']),

    respondAddNode(payload) {
      console.log('NetworkGraph: data/ADD_NODE with payload:' + JSON.stringify(payload))
      this.data.nodes.push({
        id: payload.id,
        x: 200,
        y: 200,
        vx: 0,
        vy: 0,
        index: 0
      })
    },

    respondRemoveNodes(payload) {
      console.log('NetworkGraph: data/REMOVE_NODE with payload:' + JSON.stringify(payload))
      const removedNodeIds = payload.removedNodeIds
      const removedLinkIds = payload.removedLinkIds

      Vue.set(this.data, 'nodes', this.data.nodes.filter(n => !removedNodeIds.includes(n.id)))
      Vue.set(this.data, 'links', this.data.links.filter(l => !removedLinkIds.includes(l.id)))
    },

    respondGroupNode(payload) {
      console.log('NetworkGraph: data/GROUP_NODES with payload:' + JSON.stringify(payload))
      const nodesIdArr = payload.nodeIds
      const groupNode = payload.targetGroupNode
      const newLinksArr = payload.newVisibleLinks
      const hideLinksIdArr = payload.replacedLinkIds

      const pos = this.getAveragePositionFromNodes(nodesIdArr)
      // create the new group node
      this.data.nodes.push({
        id: groupNode.id,
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        index: this.getNewNodeId()
      })

      // create new links
      for (const link of newLinksArr) {
        console.log('create link for=' + JSON.stringify(link))
        this.data.links.push({
          id: link.id,
          source: this.findNode(link.source),
          target: this.findNode(link.target)
        })
      }
      // remove nodes
      Vue.set(this.data, 'nodes', this.data.nodes.filter(n => !nodesIdArr.includes(n.id)))
      // remove links from old nodes
      Vue.set(this.data, 'links', this.data.links.filter(l => !hideLinksIdArr.includes(l.id)))
    },

    respondUngroupNode(payload) {
      console.log('NetworkGraph: data/UNGROUP_NODE with payload:' + JSON.stringify(payload))
      const groupId = payload.nodeId
      const newLinks = payload.newVisibleLinks
      const newNodes = payload.newVisibleNodes
      const removedLinkIds = payload.removedLinkIds

      // remove the group node
      Vue.set(this.data, 'nodes', this.data.nodes.filter(n => n.id !== groupId))
      // remove group links
      Vue.set(this.data, 'links', this.data.links.filter(l => !removedLinkIds.includes(l.id)))
      // recreate original nodes
      for (const node of newNodes) {
        this.data.nodes.push({
          id: node.id,
          x: node.vis.graph.x,
          y: node.vis.graph.y,
          vx: 0,
          vy: 0,
          index: this.getNewNodeId()
        })
      }
      // recreate original links
      for (const link of newLinks) {
        this.data.links.push({
          id: link.id,
          source: this.findNode(link.source),
          target: this.findNode(link.target)
        })
      }
    },

    /**
     * @brief Saves current position (d3-force)
     * @param {Object[]} nodes
     * @param {Number} nodes[].id
     * @param {Number} nodes[].x
     * @param {Number} nodes[].y
     */
    saveNodePositions(nodes) {
      const diff = []
      nodes.forEach(n => diff.push({ id: n.id, vis: { graph: { x: n.x, y: n.y } } }))
      this.updateNodes(diff)
    },

    saveNodePosition(nodeId, x, y) {
      this.updateNodes([{ id: nodeId, vis: { graph: { x: x, y: y } } }])
    },

    getNewNodeId() {
      if (this.data.nodes.length === 0) return 0
      return this.getLastElementByIndex(this.data.nodes).index + 1
    },

    getLastElementByIndex(inArr) {
      return inArr.reduce((prev, current) => (prev.index > current.index ? prev : current))
    },

    findNode(dataId) {
      return this.data.nodes.find(n => n.id === dataId)
    },

    initGraph() {
      this.forceSimulation = d3
        .forceSimulation()
        .alphaMin(0.005)
        .alphaDecay(0.035)
        .nodes(this.data.nodes)
        .force(
          'link',
          d3
            .forceLink(this.data.links)
            .id(link => link.id)
            .distance(() => 80)
        )
        .force(
          'charge',
          d3
            .forceManyBody()
            .strength(-30)
            .distanceMin(10)
            .distanceMax(Infinity)
        ) // electrostatic force between all nodes
        .force('center', d3.forceCenter(this.graph.width / 2, this.graph.height / 2)) // translate to svg center
        .force(
          'colide',
          d3
            .forceCollide()
            .radius(80)
            .strength(0.7)
        )
        .on('end', () => {
          this.isSimulationRunning = false
        })
        .on('tick', () => {
          this.isSimulationRunning = true
        })
    },

    setupZoomPan() {
      // We create two d3-zoom instances:
      //   - pan+zoom on invisible background layer
      //   - only zoom on all graph elements
      // Mind that the zoom transformations are not mutual,
      // and we need to keep them in sync.
      let zoomBehavior = d3
        .zoom()
        .on('zoom', this.setZoomTransformation)
        .on('start', () => (this.graph.isPanningOrZooming = true))
        .on('end', () => (this.graph.isPanningOrZooming = false))
        .scaleExtent([this.graph.zoomMin, this.graph.zoomMax])

      d3.select('#network-graph #zoom-pan-interaction-layer').call(zoomBehavior)
      d3.select('#network-graph #g-elements')
        .call(zoomBehavior)
        .on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null)
        .on('dblclick.zoom', null)
    },

    setZoomTransformation() {
      let t = d3.event.transform
      // We need to keep both zoom transformations in sync.
      // This is a nasty, yet quick solution: d3-zoom stores
      // the transformations on the DOM nodes, we update both and also
      // store one copy in vue data.
      d3.select('#network-graph #g-elements').node().__zoom = t
      d3.select('#network-graph #zoom-pan-interaction-layer').node().__zoom = t
      this.graph.transform = t
    },

    setupData() {
      let nodes = []
      this.$store.getters['data/getVisibleNodes'].forEach(function(node) {
        nodes.push({
          id: node.id,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          index: 0
        })
      })
      Vue.set(this.data, 'nodes', nodes)

      let links = []
      this.$store.getters['data/getVisibleLinks'].forEach(function(link) {
        links.push({
          id: link.id,
          source: link.source,
          target: link.target,
          index: NaN
        })
      })
      Vue.set(this.data, 'links', links)
    },

    moveNode(child) {
      let node = this.data.nodes.find(n => n.id === child.id)
      node.x += child.x / this.graph.transform.k
      node.y += child.y / this.graph.transform.k
      this.graph.lastMovedNodeId = node.id
    },

    updateWindowSize() {
      this.graph.width = window.innerWidth
      this.graph.height = window.innerHeight
    },

    getAveragePositionFromNodes(nodesIdArr) {
      let x = 0,
        y = 0
      const nodes = this.data.nodes.filter(n => nodesIdArr.includes(n.id))
      for (const n of nodes) {
        x += n.x
        y += n.y
      }
      x /= nodes.length
      y /= nodes.length
      return { x: x, y: y }
    }
  }
}
</script>

<style lang="sass" scoped>
@import _workspace

.g-info, .corner-tools
  font-size: 10pt

.g-info
  margin: $workspace-margin
  position: absolute
  top: $toolbar-height
  left: 0
  border-radius: 12px
  background-color: $color-background
  padding: 8px

#network-graph.panning
  cursor: move

.corner-tools
  position: absolute
  bottom: 0
  margin: $workspace-margin
  p
    margin-bottom: 10px

.fade-enter-active
  transition: opacity 0.2s
.fade-leave-active
  transition: opacity 0.7s
.fade-enter, .fade-leave-to
  opacity: 0

.fade-quick-enter-active
  transition: opacity 0.1s
.fade-quick-leave-active
  transition: opacity .2s
.fade-quick-enter, .fade-quick-leave-to
  opacity: 0

.temporary-link
  stroke: #ddd
  stroke-dasharray: 3px
</style>
