import Vue from 'vue'
import mockData from '@/datasets/data-harry.js'
import { cloneDeep, merge } from 'lodash'

/**
 * Node
 * @typedef {Object} Node
 * @property {number} id dataset id
 * @property {('regular'|'group'|'bundle'|'alias')} type
 * @property {string} dataClass like person, document, etc.
 * @property {string} name
 * @property {string} label
 * @property {Object}   [vis] storage for visualization data
 * @property {boolean}  [vis.isUserDefined]
 * @property {number}   [vis.inAggregation]
 * @property {boolean}  [vis.isRemoved]
 */

export const namespaced = true

export const state = {
  // Maps would be better, unfortunately Vuex does not support them.
  nodes: [],
  links: []
}

function filterVisibleLinks(links) {
  return links.filter(l => !l.vis || (!l.vis.inAggregation && !l.vis.inMultilink))
}

export function filterVisibleNodes(nodes) {
  return nodes.filter(n => !n.vis || !n.vis.inAggregation)
}

function arrGetNewId(arr) {
  if (arr === undefined || !Array.isArray(arr)) throw 'Calling arrGetNewId with undefined array'
  if (arr.length === 0) return 0

  return arr.reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id + 1
}

/**
 * Insert a link into array and check, if array contains a link with the same
 * source-target pair. In that case, also insert a multilink. Will set link.id
 *
 * Set multilink id to nodeId+1. Mark associated links as part of the multilink.
 * Update multilink direction.
 * @param {Object[]} arr where link or multilink will be created
 * @param {Object} link to insert
 * @param {Number} link.source node id
 * @param {Number} link.target node id
 * @param {Number} groupId so multilink has always source set to group node
 * @return {Object} multilink copy, if created
 */
function insertLink(arr, link, groupId) {
  /**
   * In array, check if there is link between the same pair of nodes.
   * If found, we also need to create multilink and mark both links inMultilink.
   */
  const similarLink = arr.find(
    l =>
      (l.source === link.source && l.target === link.target) ||
      (l.target === link.source && l.source === link.target)
  )
  if (!similarLink) {
    arr.push(cloneDeep(link))
    return null
  }

  /**
   * Assuming correct state:
   * a) we have the multilink
   * b) we have a link from existing multilink and therefore know its id
   * c) there is no multilink yet
   */
  if (isMultilink(similarLink)) {
    // FIXME no coverage
    link.vis.inMultilink = similarLink.id
    arr.push(cloneDeep(link))
    multilinkUpdateDirection(arr, similarLink)
  } else if (isInMultilink(similarLink)) {
    link.vis.inMultilink = similarLink.vis.inMultilink
    arr.push(cloneDeep(link))
    multilinkUpdateDirection(arr, arr.find(l => l.id === similarLink.vis.inMultilink))
  } else {
    const isSourceGroup = groupId === link.source
    const ml = createMultilink(
      link.id + 1,
      isSourceGroup ? link.source : link.target,
      isSourceGroup ? link.target : link.source,
      true
    )
    const merging = [similarLink, link]
    merging.forEach(l => {
      l.vis = l.vis || {}
      l.vis.inMultilink = ml.id
    })
    arr.push(cloneDeep(link))
    multilinkUpdateDirection(arr, ml)
    arr.push(cloneDeep(ml))
    return ml
  }
  return null
}

function multilinkUpdateDirection(/* const */ linksArr, ml) {
  Vue.set(ml, 'direction', { nonDirectional: false, sourceToTarget: false, targetToSource: false })
  linksArr
    .filter(l => l.vis && l.vis.inMultilink === ml.id)
    .map(l => {
      if (!l.direction) {
        ml.direction.nonDirectional = true
      } else {
        if (l.source === ml.source)
          // TODO: check if correct
          ml.direction.sourceToTarget = true
        else ml.direction.targetToSource = true
      }
    })
}

/**
 * Check if element is in aggregation
 * @param {Object} el either node or link
 * @param {Number[]} [ids] if given, also check for specific aggregation
 * @return {Boolean}
 */
export function isInAggregation(el, ids = []) {
  if (!el.vis) return false
  if (ids.length === 0) return el.vis.inAggregation
  return ids.includes(el.vis.inAggregation)
}

/**
 * Check if link is in multilink
 * @param {Object} link
 * @return {Boolean}
 */
function isInMultilink(link) {
  if (!link.vis) return false
  return link.vis.inMultilink !== undefined
}

function isMultilink(link) {
  if (!link.vis) return false
  return link.vis.isMultilink
}

/**
 *
 * @param {*} el
 * @param {*} attrName
 * @param {*} attrVal
 */
function setVisAttr(el, attrName, attrVal) {
  el.vis = el.vis || {}
  Vue.set(el, attrName, attrVal)
}

/**
 * Push new group node to state
 * @param {Object} state writes to state.nodes
 * @param {Node} node will be assigned type and new ID
 */
function createGroupNode(state, node) {
  node.id = arrGetNewId(state.nodes)
  node.type = 'group'
  node.vis = node.vis || {}
  node.vis.isUserDefined = true
  state.nodes.push(cloneDeep(node))
}

function setNodeVisAttrs(state, nodeIds, visAttrs) {
  state.nodes
    .filter(n => nodeIds.includes(n.id))
    .forEach(node => {
      node.vis = node.vis || {}
      Vue.set(node, 'vis', merge(node.vis, visAttrs))
    })
}

/**
 * Get multilink instance
 * @param {number} newId
 * @param {number} source
 * @param {number} target
 * @param {boolean} isTransferred
 */
function createMultilink(newId, source, target, isTransferred) {
  let ml = {
    id: newId,
    source: source,
    target: target,
    vis: { isMultilink: true, isUserDefined: true, isTransferred: isTransferred }
  }
  return ml
}

export const mutations = {
  /**
   * Add new node
   * @param {Object} state
   * @param {Node} node
   */
  ADD_NODE(state, node) {
    node.id = arrGetNewId(state.nodes)
    state.nodes.push(node)
  },

  /**
   * Batch replace node attributes
   * @param {Object} state
   * @param {Object[]} payload const;
   * every diff will have node id and attributes to replace
   * [...{ id: nodeId, ...updateAttr: newVal}]
   * @param {Number} payload[].id
   *
   * @throws {Error} if diff array is empty or undefined
   * @throws {Error} if node is not found in state. Beware that previous valid entries will be commited
   */
  UPDATE_NODES(state, payload) {
    const nodesDiff = payload
    if (!nodesDiff || nodesDiff.length < 1) throw Error('Update array undefined or empty')

    nodesDiff.forEach(ndiff => {
      if (!ndiff.id === undefined) throw Error('Entry has no id')
      const node = state.nodes.find(sn => sn.id === ndiff.id)
      if (!node) throw Error('Node not found')

      Vue.set(state.nodes, state.nodes.indexOf(node), merge(node, ndiff))
    })
  },

  /**
   * Remove multiple nodes and associated links
   * @param {Object}   state
   * @param {Object}   payload
   * @param {Number[]} payload.nodeIds to remove
   * @param {Number[]} [payload.removedNodeIds] OUT: will contain nodes to be removed from graph.
   * @param {Number[]} [payload.removedLinkIds] OUT: will contain links to be removed from graph.
   * Will not include original entries set to isRemoved
   *
   * @throws {Error} when given no nodeIds
   * @throws {Error} when nodes dont exist
   */
  REMOVE_NODES(state, payload) {
    const nodeIds = payload.nodeIds
    const removedNodeIds = (payload.removedNodeIds = [])
    const removedLinkIds = (payload.removedLinkIds = [])
    if (!Array.isArray(nodeIds) || nodeIds.length < 1) throw Error('Invalid input array')

    const filteredNodes = []
    let removedNo = 0
    for (const n of state.nodes) {
      // skip
      if (!nodeIds.includes(n.id)) {
        filteredNodes.push(n)
        continue
      }

      if (n.vis && n.vis.isUserDefined !== true) {
        // TODO: inform user via payload about removing original entries
        n.vis = n.vis || {}
        Vue.set(n.vis, 'isRemoved', true)
        //n.vis.isRemoved = true
        filteredNodes.push(n)
      } else {
        removedNodeIds.push(n.id)
      }
      removedNo++
    }
    if (removedNo !== nodeIds.length)
      throw Error('Some of the nodes marked for removal do not exist.')
    // TODO: what with group? nodes with inAggregation set?
    Vue.set(state, 'nodes', filteredNodes)

    const filteredLinks = []
    for (const l of state.links) {
      // skip irrelevant
      if (
        !nodeIds.includes(l.source) &&
        !nodeIds.includes(l.target) &&
        !isInAggregation(l, nodeIds)
      ) {
        filteredLinks.push(l)
        continue
      }

      if (!l.vis || l.vis.isUserDefined !== true) {
        l.vis = l.vis || {}
        l.vis.isRemoved = true
        filteredLinks.push(l)
        continue
      }

      if (l.vis && l.vis.inMultilink) continue
      removedLinkIds.push(l.id)
    }
    Vue.set(state, 'links', filteredLinks)
  },

  /**
   * Aggregate nodes in general group
   * Pushe new group node/links to state, update nodes/links
   *
   * Aggregation types
   * ALIAS
   * a regular node (represents one entity, not a group);
   * merge links, attributes, merge conflict should be solved by user
   *
   * BUNDLING
   * hides a set of nodes in a selected node;
   * nodes are hidden, links are transferred (meaning they connect to the bundle node instead)
   *
   * GENERAL GROUP
   * nodes are hidden, links are transferred
   *
   * @param {Object}   state
   * @param {Object}   payload
   * @param {Number[]} payload.nodeIds to group
   * @param {Object}   payload.targetGroupNode ref. to the new group node without ID, which will be set
   * @param {Number[]} [payload.replacedLinkIds] OUT: will contain links hidden during aggregation
   * @param {Object[]} [payload.newVisibleLinks] OUT: will contain replacement links for graph
   *
   * @throws {Error} when nodeIds are not given or less than 2
   * @throws {Error} when targetGroupNode already has an ID or isn't a group
   */
  GROUP_NODES(state, payload) {
    const nodesToGroupIds = payload.nodeIds,
      groupNode = payload.targetGroupNode,
      hideLinks = (payload.replacedLinkIds = [])
    if (!nodesToGroupIds || nodesToGroupIds.length < 2)
      throw Error(' Cannot group less then 2 nodes')
    if (!groupNode) throw Error('Group node is undefined')
    if (groupNode.type !== 'group') throw Error('Node is not a group.')
    if (groupNode.id) throw Error('Group node should not come with an ID')

    createGroupNode(state, groupNode)
    setNodeVisAttrs(state, nodesToGroupIds, { inAggregation: groupNode.id })

    const newLinks = []
    let currentNewLinkId = arrGetNewId(state.links)
    for (const link of state.links) {
      // skip "history" links from previous grouping
      if (isInAggregation(link)) continue

      let target, source
      const isGroupATarget = nodesToGroupIds.includes(link.target),
        isGroupASource = nodesToGroupIds.includes(link.source)
      if (!isGroupATarget && !isGroupASource) continue
      else if (isGroupATarget && !isGroupASource) {
        source = link.source
        target = groupNode.id
      } else if (!isGroupATarget && isGroupASource) {
        source = groupNode.id
        target = link.target
      } else {
        // links inside group
        link.vis = link.vis || {}
        link.vis.inAggregation = groupNode.id
        hideLinks.push(link.id)
        continue
      }

      if (isMultilink(link)) {
        hideLinks.push(link.id)
        link.vis.inAggregation = groupNode.id
        continue
      }

      // we now replace the link with one connected to the group
      const newLink = {
        id: currentNewLinkId,
        source: source,
        target: target,
        direction: false, // FIXME: really?
        vis: { isUserDefined: true, isTransferred: true }
      }
      if (link.direction) newLink.direction = cloneDeep(link.direction)
      if (link.description) newLink.description = cloneDeep(link.description)

      if (insertLink(newLinks, newLink, groupNode.id)) currentNewLinkId += 2
      else currentNewLinkId++

      // update old link
      hideLinks.push(link.id)
      link.vis = link.vis || {}
      link.vis.inAggregation = groupNode.id
    }

    newLinks.forEach(l => state.links.push(cloneDeep(l)))
    payload.newVisibleLinks = filterVisibleLinks(newLinks)
  },

  /**
   * Reverse general grouping
   *
   * New data for graph will be placed in payload object.
   *
   * @param {Object}   state
   * @param {Object}   payload
   * @param {Number}   payload.nodeId group node to ungroup
   * @param {Number[]} [payload.removedLinkIds] OUT: will contain removed links
   * @param {Object[]} [payload.newVisibleLinks] OUT: will contain replacement links for graph
   * @param {Object[]} [payload.newVisibleNodes] OUT: will contain replacement nodes for graph
   *
   * @throws {Error} when given node does not exist or is not a group
   * @throws {Error} when given node is not user created
   */
  UNGROUP_NODE(state, payload) {
    const groupId = payload.nodeId
    payload.newVisibleLinks = []
    const newNodes = (payload.newVisibleNodes = [])
    const removedVisibleLinkIds = (payload.removedLinkIds = [])
    if (typeof groupId !== 'number' || groupId < 0) throw Error('Invalid argument.')
    const groupNode = state.nodes.find(n => n.id === groupId)
    if (!groupNode) throw Error('Node is undefined.')
    if (groupNode.type !== 'group') throw Error('Node is not a group.')
    if (!groupNode.vis || groupNode.vis.isUserDefined !== true)
      throw Error('Cannot modify original dataset.')

    // remove links created during aggregation
    const filteredLinks = []
    state.links.forEach(l => {
      if (
        (l.source === groupId || l.target === groupId) &&
        !isInAggregation(l) // latest links connected to aggregation node are not marked inAggregation TODO: why we need this?
      ) {
        if (!isInMultilink(l)) {
          // graph only displays multilinks
          removedVisibleLinkIds.push(l.id)
        }
      } else {
        filteredLinks.push(l)
      }
    })
    Vue.set(state, 'links', filteredLinks)

    // reveal original nodes
    const revealedNodeIds = []
    state.nodes
      .filter(n => isInAggregation(n, [groupId]))
      .forEach(n => {
        delete n.vis.inAggregation
        if (Object.keys(n.vis).length === 0) delete n.vis
        newNodes.push(cloneDeep(n))
        revealedNodeIds.push(n.id)
      })

    // reveal original links and solve agregation order
    // precondition: originally aggregated nodes now have unset inAggregation
    const removeFromDataLinkIds = []
    const newLinks = []
    const revealedLinks = []
    let newLinkId = arrGetNewId(state.links)
    state.links
      .filter(l => isInAggregation(l, [groupId]))
      .forEach(l => {
        const wasSourceTheGroup = revealedNodeIds.includes(l.source),
          wasTargetTheGroup = revealedNodeIds.includes(l.target)

        if (wasSourceTheGroup && wasTargetTheGroup) {
          // link was inside the original group
          delete l.vis.inAggregation
          if (Object.keys(l.vis).length === 0) delete l.vis
          revealedLinks.push(cloneDeep(l))
          return
        }

        const connectedNode = state.nodes.find(
          n => (wasSourceTheGroup && n.id === l.target) || (wasTargetTheGroup && n.id === l.source)
        )
        if (!connectedNode) {
          // link was connected to aggregated node, which was disaggregated and deleted
          removeFromDataLinkIds.push(l.id)
        } else {
          if (isInAggregation(connectedNode)) {
            // set link to found aggregation and replace it
            const aggrId = findLastNodeInAggregation(state, connectedNode).id
            l.vis.inAggregation = aggrId

            const ml = insertLink(
              newLinks,
              createLink(
                newLinkId,
                l.source === connectedNode.id ? aggrId : l.source,
                l.target === connectedNode.id ? aggrId : l.target,
                { isUserDefined: true, isTransferred: true }
              ),
              aggrId
            )
            newLinkId = newLinkId + (ml ? 2 : 1)
          } else {
            delete l.vis.inAggregation
            if (Object.keys(l.vis).length === 0) delete l.vis
            revealedLinks.push(cloneDeep(l))
          }
        }
      })
    newLinks.forEach(l => state.links.push(cloneDeep(l)))
    filterVisibleLinks(revealedLinks).forEach(l => payload.newVisibleLinks.push(cloneDeep(l)))
    filterVisibleLinks(newLinks).forEach(l => payload.newVisibleLinks.push(cloneDeep(l)))

    // remove links from previous run
    Vue.set(state, 'links', state.links.filter(l => !removeFromDataLinkIds.includes(l.id)))

    // remove group node
    Vue.set(state, 'nodes', state.nodes.filter(n => n.id !== groupId))
  },

  INIT(state, data) {
    state.nodes = data.nodes
    state.links = data.links
  }
}

/**
 * Recursively find a parent aggregation node
 * @param {Object} state
 * @param {Node} node Node
 * @returns {Object} node which is not aggregated; last in the series of aggregations
 */
function findLastNodeInAggregation(state, node) {
  if (!isInAggregation(node)) return node

  const next = state.nodes.find(n => n.id === node.vis.inAggregation)
  if (!next) throw Error('Next node in aggregation not found')
  return findLastNodeInAggregation(state, next)
}

/**
 * Create new link
 * @param {Object} newId
 * @param {Number} source node id
 * @param {Number} target node id
 * @param {Object} [vis] vis attributes to set
 * @return link copy
 */
export function createLink(newId, source, target, vis = null) {
  const l = { id: newId, target: target, source: source }
  if (vis !== null) {
    l.vis = l.vis || {}
    merge(l.vis, vis)
  }
  return l
}

export const actions = {
  fetchData({ commit }) {
    commit('INIT', mockData)
    // TODO: api call
  },

  createNode({ commit }, node) {
    commit('ADD_NODE', node)
  },

  updateNodes({ commit }, nodesDiff) {
    commit('UPDATE_NODES', nodesDiff)
  },

  removeNode({ commit }, nodeId) {
    commit('REMOVE_NODES', { nodeIds: [nodeId] })
  },

  groupNodes({ commit }, nodeIdArr) {
    console.log('store/data: called action groupNodes with nodes: ' + nodeIdArr)

    let groupNode = {
      name: 'Group of: ',
      type: 'group',
      label: 'Group',
      vis: {
        isUserDefined: true
      }
    }

    commit('GROUP_NODES', {
      nodeIds: nodeIdArr,
      targetGroupNode: groupNode
    })
  },

  ungroupNode({ commit }, nodeId) {
    commit('UNGROUP_NODE', {
      nodeId: nodeId
    })
  }
}

export const getters = {
  getNodes: state => state.nodes,
  getLinks: state => state.links,

  getVisibleNodes: state =>
    state.nodes.filter(n => !n.vis || (!n.vis.inAggregation && !n.vis.isRemoved)),
  getVisibleLinks: state =>
    state.links.filter(l => !l.vis || (!l.vis.inAggregation && !l.vis.inMultilink)),

  getNodeById: state => id => state.nodes.find(n => n.id === id),
  getLinkById: state => id => state.links.find(n => n.id === id)
}
