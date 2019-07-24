export const namespaced = true

export const state = {
  /**
   * @type {number[]} ids
   */
  selectedNodes: [],
  focusedNodeId: NaN,
  hoveredNodeId: NaN,
  focusedLinkId: NaN,
  shownTools: {
    nodeDetail: false,
    nodePopover: false,
    nodeSelection: false,
    linkDetail: false
  }
}

export const mutations = {
  SET_NODE_FOCUS(state, id) {
    state.focusedNodeId = id
  },
  UNSET_NODE_FOCUS(state) {
    state.focusedNodeId = NaN
  },
  SET_NODE_HOVER(state, id) {
    state.hoveredNodeId = id
  },
  UNSET_NODE_HOVER(state) {
    state.hoveredNodeId = NaN
  },
  SELECT_NODE(state, id) {
    state.selectedNodes.push(id)
  },
  UNSELECT_NODE(state, id) {
    state.selectedNodes = state.selectedNodes.filter(n => n !== id)
  },
  CLEAR_NODE_SELECTION(state) {
    state.selectedNodes = []
  },

  SET_LINK_FOCUS(state, id) {
    state.focusedLinkId = id
  },
  UNSET_LINK_FOCUS(state) {
    state.focusedLinkId = NaN
  },

  SET_TOOL_SHOW(state, { tool, bool }) {
    state.shownTools[tool] = bool
  }
}

export const actions = {
  showNodeDetail({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'nodeDetail', bool: true })
  },
  hideNodeDetail({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'nodeDetail', bool: false })
    commit('UNSET_NODE_FOCUS')
  },

  showNodePopover({ commit }, id) {
    commit('SET_NODE_HOVER', id)
    commit('SET_TOOL_SHOW', { tool: 'nodePopover', bool: true })
  },
  hideNodePopover({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'nodePopover', bool: false })
    commit('UNSET_NODE_HOVER')
  },

  showNodeSelection({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'nodeSelection', bool: true })
  },
  clearCloseNodeSelection({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'nodeSelection', bool: false })
    commit('CLEAR_NODE_SELECTION')
  },
  hideNodeSelectionIfEmpty({ commit }) {
    if (state.selectedNodes.length !== 0) return
    commit('SET_TOOL_SHOW', { tool: 'nodeSelection', bool: false })
  },

  showLinkDetail({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'linkDetail', bool: true })
  },
  hideLinkDetail({ commit }) {
    commit('SET_TOOL_SHOW', { tool: 'linkDetail', bool: false })
    commit('UNSET_LINK_FOCUS')
  }
}

export const getters = {
  isShownNodeDetail: state => state.shownTools['nodeDetail'],
  isShownNodePopover: state => state.shownTools['nodePopover'],
  isShownNodeSelection: state => state.shownTools['nodeSelection'],
  isShownLinkDetail: state => state.shownTools['linkDetail'],

  isNodeFocused: state => id => state.focusedNodeId === id,
  isNodeSelected: state => id => state.selectedNodes.find(n => n === id) !== undefined,
  isLinkFocused: state => id => state.focusedLinkId === id,

  //getFocusedLinkId: state => state.focusedLinkId

  getFocusedLinkId(state) {
    return () => {
      return state.focusedLinkId
    }
  }
}
