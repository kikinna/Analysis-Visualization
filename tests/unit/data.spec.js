import { mutations, createLink, filterVisibleNodes } from '../../src/store/modules/data.js'
import { cloneDeep, random } from 'lodash'

import mockDataset from '@/datasets/data-harry.js'

describe('store/data/ADD_NODE', () => {
  it('adds one node', () => {
    let node = { name: 'test' }
    const state = { nodes: [] }

    mutations.ADD_NODE(state, node)

    expect(state).toEqual({ nodes: [{ id: 0, name: 'test' }] })
  })
})

describe('store/data/UPDATE_NODES', () => {
  it('fails with empty or undefined arr', () => {
    for (const payload of [{}, [], undefined])
      expect(() => {
        mutations.UPDATE_NODES({}, payload)
      }).toThrow()
  })

  it('fails with entry without node id', () => {
    expect(() => mutations.UPDATE_NODES({}, [{ label: 'new' }])).toThrow()
  })

  it('change single node', () => {
    const payload = [{ id: 0, label: 'b', num: 42 }],
      state = { nodes: [{ id: 0, label: 'a' }] },
      expectedState = { nodes: [{ id: 0, label: 'b', num: 42 }] }

    mutations.UPDATE_NODES(state, payload)

    expect(state).toEqual(expectedState)
  })

  it('change multiple nodes', () => {
    const payload = [
        { id: 0 },
        { id: 1, label: 'b' },
        { id: 2, new1: 1, new2: { new3: false } },
        { id: 3, vis: { graph: { x: 42 } } }
      ],
      state = {
        nodes: [
          { id: 0, label: 'a' },
          { id: 1, label: 'a' },
          { id: 2 },
          { id: 3, vis: { isUserDefined: true } }
        ]
      },
      expectedState = {
        nodes: [
          { id: 0, label: 'a' },
          { id: 1, label: 'b' },
          { id: 2, new1: 1, new2: { new3: false } },
          { id: 3, vis: { isUserDefined: true, graph: { x: 42 } } }
        ]
      }

    mutations.UPDATE_NODES(state, payload)

    expect(state).toEqual(expectedState)
  })
})

// FIXME: test exceptions, may not be correct, not decided yet how to handle original data entries
describe('store/data/REMOVE_NODES', () => {
  it('fails with empty or undefined arr', () => {
    for (const arr of [[], undefined])
      expect(() => {
        mutations.REMOVE_NODES({}, { nodeIds: arr })
      }).toThrow()
  })

  it('fails when node doesnt exist', () => {
    expect(() =>
      mutations.REMOVE_NODES({ nodes: [{ id: 2, label: 'c' }] }, { nodeIds: [0] })
    ).toThrow()
  })

  it('fails when node is not user created', () => {
    expect(() =>
      mutations.REMOVE_NODES({ nodes: [{ id: 2, label: 'c' }] }, { nodeIds: [2] })
    ).toThrow()
  })

  it('remove single node', () => {
    const state = {
      nodes: [
        { id: 0, label: 'a', vis: { isUserDefined: true } },
        { id: 1, label: 'b', vis: { isUserDefined: true } },
        { id: 2, label: 'c' }
      ],
      links: [
        { id: 0, source: 0, target: 1, vis: { isUserDefined: true } },
        { id: 1, source: 1, target: 0, vis: { isUserDefined: true } },
        { id: 2, source: 1, target: 2, vis: { isUserDefined: true } }
      ]
    }
    const expectedState = {
      nodes: [{ id: 0, label: 'a', vis: { isUserDefined: true } }, { id: 2, label: 'c' }],
      links: []
    }

    const payload = { nodeIds: [1] }
    const expectedPayload = { nodeIds: [1], removedNodeIds: [1], removedLinkIds: [0, 1, 2] }

    mutations.REMOVE_NODES(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toEqual(expectedPayload)
  })

  it('remove multiple nodes with multilinks', () => {
    const state = {
      nodes: [
        { id: 0, label: 'a', vis: { isUserDefined: true } },
        { id: 1, label: 'b', vis: { isUserDefined: true } },
        { id: 2, label: 'c', vis: { isUserDefined: true } },
        { id: 3, label: 'd', vis: { isUserDefined: true } },
        { id: 4, label: 'e' }
      ],
      links: [
        { id: 0, source: 0, target: 1, vis: { isUserDefined: true, inMultilink: 2 } },
        { id: 1, source: 1, target: 0, vis: { isUserDefined: true, inMultilink: 2 } },
        { id: 2, source: 0, target: 1, vis: { isUserDefined: true, isMultilink: true } },
        { id: 3, source: 2, target: 0, vis: { isUserDefined: true } },
        { id: 4, source: 2, target: 4, vis: { isUserDefined: true } },
        { id: 5, source: 3, target: 2, vis: { isUserDefined: true } },
        { id: 6, source: 4, target: 3, vis: { isUserDefined: true } }
      ]
    }
    const expectedState = {
      nodes: [{ id: 3, label: 'd', vis: { isUserDefined: true } }, { id: 4, label: 'e' }],
      links: [{ id: 6, source: 4, target: 3, vis: { isUserDefined: true } }]
    }

    const payload = { nodeIds: [0, 1, 2] }
    const expectedPayload = {
      nodeIds: [0, 1, 2],
      removedNodeIds: [0, 1, 2],
      removedLinkIds: [2, 3, 4, 5]
    }

    mutations.REMOVE_NODES(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toEqual(expectedPayload)
  })
})

describe('store/data/GROUP_NODES', () => {
  it('fails with < 2 nodes', () => {
    const state = { nodes: [{ id: 0 }, { id: 1 }], links: [] }
    const org_state = { ...state }

    expect(() => {
      mutations.GROUP_NODES(state, {
        nodeIds: [0],
        targetGroupNode: { type: 'group', vis: { isUserDefined: true } }
      })
    }).toThrow()
    expect(state).toEqual(org_state)
  })

  it('links only inside group, simple dataset', () => {
    const state = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular' },
        { id: 1, dataClass: 'document', type: 'regular' },
        { id: 2, dataClass: 'sth', type: 'regular' }
      ],
      links: [{ id: 0, source: 0, target: 1 }, { id: 1, source: 1, target: 0 }]
    }
    const expectedState = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular', vis: { inAggregation: 3 } },
        { id: 1, dataClass: 'document', type: 'regular', vis: { inAggregation: 3 } },
        { id: 2, dataClass: 'sth', type: 'regular' },
        { id: 3, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        { id: 0, source: 0, target: 1, vis: { inAggregation: 3 } },
        { id: 1, source: 1, target: 0, vis: { inAggregation: 3 } }
      ]
    }
    const payload = {
      nodeIds: [0, 1],
      targetGroupNode: { type: 'group', vis: { isUserDefined: true } }
    }
    const expectedPayload = {
      nodeIds: [0, 1],
      targetGroupNode: { id: 3, type: 'group', vis: { isUserDefined: true } },
      newVisibleLinks: [],
      replacedLinkIds: [0, 1]
    }

    mutations.GROUP_NODES(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toMatchObject(expectedPayload)
  })

  it('group nodes which have links with non-group members (no multilinks in result)', () => {
    const state = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular' },
        { id: 1, dataClass: 'document', type: 'regular' },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' },
        { id: 4, dataClass: 'c', type: 'regular' }
      ],
      links: [
        // inside group
        { id: 0, source: 0, target: 1 },
        { id: 1, source: 1, target: 0 },
        // outside group
        { id: 2, source: 2, target: 3 },
        { id: 3, source: 3, target: 4 },
        // between
        { id: 4, source: 2, target: 0 },
        { id: 5, source: 0, target: 3 },
        { id: 6, source: 4, target: 1 }
      ]
    }

    mutations.GROUP_NODES(state, {
      nodeIds: [0, 1],
      targetGroupNode: { type: 'group', vis: { isUserDefined: true } }
    })

    const expectedState = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular', vis: { inAggregation: 5 } },
        { id: 1, dataClass: 'document', type: 'regular', vis: { inAggregation: 5 } },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' },
        { id: 4, dataClass: 'c', type: 'regular' },
        { id: 5, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        { id: 0, source: 0, target: 1, vis: { inAggregation: 5 } },
        { id: 1, source: 1, target: 0, vis: { inAggregation: 5 } },
        // outside
        { id: 2, source: 2, target: 3 },
        { id: 3, source: 3, target: 4 },
        // disabled links
        { id: 4, source: 2, target: 0, vis: { inAggregation: 5 } },
        { id: 5, source: 0, target: 3, vis: { inAggregation: 5 } },
        { id: 6, source: 4, target: 1, vis: { inAggregation: 5 } },
        // new links connecting the group
        {
          id: 7,
          direction: false,
          source: 2,
          target: 5,
          vis: { isUserDefined: true, isTransferred: true }
        },
        {
          id: 8,
          direction: false,
          source: 5,
          target: 3,
          vis: { isUserDefined: true, isTransferred: true }
        },
        {
          id: 9,
          direction: false,
          source: 4,
          target: 5,
          vis: { isUserDefined: true, isTransferred: true }
        }
      ]
    }
    expect(state).toEqual(expectedState)
  })

  it('multilink simple', () => {
    const state = {
      nodes: [{ id: 0, type: 'regular' }, { id: 1, type: 'regular' }, { id: 2, type: 'regular' }],
      links: [
        {
          id: 0,
          source: 0,
          target: 1,
          direction: true,
          vis: { inMultilink: 2 }
        },
        {
          id: 1,
          source: 1,
          target: 0,
          direction: true,
          vis: { inMultilink: 2 }
        },
        {
          id: 2,
          source: 0,
          target: 1,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isMultilink: true }
        },
        {
          id: 3,
          source: 0,
          target: 2,
          direction: false
        }
      ]
    }
    const expectedState = {
      nodes: [
        { id: 0, type: 'regular' },
        { id: 1, type: 'regular', vis: { inAggregation: 3 } },
        { id: 2, type: 'regular', vis: { inAggregation: 3 } },
        { id: 3, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        {
          id: 0,
          source: 0,
          target: 1,
          direction: true,
          vis: { inMultilink: 2, inAggregation: 3 }
        },
        {
          id: 1,
          source: 1,
          target: 0,
          direction: true,
          vis: { inMultilink: 2, inAggregation: 3 }
        },
        {
          id: 2,
          source: 0,
          target: 1,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isMultilink: true, inAggregation: 3 }
        },
        {
          id: 3,
          source: 0,
          target: 2,
          direction: false,
          vis: { inAggregation: 3 }
        },
        // new
        {
          id: 4,
          source: 0,
          target: 3,
          direction: true,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        },
        {
          id: 5,
          source: 3,
          target: 0,
          direction: true,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        },
        {
          id: 6,
          source: 3,
          target: 0,
          direction: {
            nonDirectional: true,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isUserDefined: true, isTransferred: true, isMultilink: true }
        },
        {
          id: 7,
          source: 0,
          target: 3,
          direction: false,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        }
      ]
    }

    const payload = {
      nodeIds: [1, 2],
      targetGroupNode: { type: 'group' }
    }
    const expectedPayload = {
      nodeIds: [1, 2],
      targetGroupNode: { id: 3, type: 'group', vis: { isUserDefined: true } },
      newVisibleLinks: [
        {
          id: 6,
          source: 3,
          target: 0,
          direction: {
            nonDirectional: true,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isUserDefined: true, isTransferred: true, isMultilink: true }
        }
      ],
      replacedLinkIds: [0, 1, 2, 3]
    }

    mutations.GROUP_NODES(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toEqual(expectedPayload)
  })

  it('multilinks', () => {
    const state = {
      nodes: [
        {
          id: 0,
          dataClass: 'person',
          type: 'regular'
        },
        {
          id: 1,
          dataClass: 'document',
          type: 'regular'
        },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' }
      ],
      links: [
        {
          id: 0,
          source: 0,
          target: 2,
          direction: true
        },
        {
          id: 1,
          source: 2,
          target: 1,
          direction: true
        },
        {
          id: 2,
          source: 3,
          target: 0,
          direction: true
        },
        {
          id: 3,
          source: 3,
          target: 1,
          direction: false
        },
        {
          id: 4,
          source: 3,
          target: 1,
          direction: false
        }
      ]
    }

    const payload = {
      nodeIds: [0, 1],
      targetGroupNode: { type: 'group' }
    }
    const expectedPayload = {
      nodeIds: [0, 1],
      targetGroupNode: { id: 4, type: 'group', vis: { isUserDefined: true } },
      newVisibleLinks: [
        {
          id: 7,
          source: 4,
          target: 2,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 10,
          source: 4,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        }
      ],
      replacedLinkIds: [0, 1, 2, 3, 4]
    }

    mutations.GROUP_NODES(state, payload)

    const expectedState = {
      nodes: [
        {
          id: 0,
          dataClass: 'person',
          type: 'regular',
          vis: { inAggregation: 4 }
        },
        {
          id: 1,
          dataClass: 'document',
          type: 'regular',
          vis: { inAggregation: 4 }
        },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' },
        { id: 4, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        // original, disabled
        {
          id: 0,
          source: 0,
          target: 2,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 1,
          source: 2,
          target: 1,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 2,
          source: 3,
          target: 0,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 3,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        {
          id: 4,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        // new
        {
          id: 5,
          source: 4,
          target: 2,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7
          }
        },
        {
          id: 6,
          source: 2,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7
          }
        },
        {
          id: 7,
          source: 4,
          target: 2,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 8,
          source: 3,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        },
        {
          id: 9,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        },
        {
          id: 10,
          source: 4,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 11,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        }
      ]
    }

    expect(state).toEqual(expectedState)
    expect(payload).toMatchObject(expectedPayload)
  })

  it('repeated grouping (with multilinks)', () => {
    const state = {
      nodes: [
        { id: 0, type: 'regular', vis: { inAggregation: 4 } },
        { id: 1, type: 'regular', vis: { inAggregation: 4 } },
        { id: 2, type: 'regular' },
        { id: 3, type: 'regular' },
        { id: 4, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        // original, disabled
        {
          id: 0,
          source: 0,
          target: 2,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 1,
          source: 2,
          target: 1,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 2,
          source: 3,
          target: 0,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 3,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        {
          id: 4,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        // new
        {
          id: 5,
          source: 4,
          target: 2,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7
          }
        },
        {
          id: 6,
          source: 2,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7
          }
        },
        {
          id: 7,
          source: 4,
          target: 2,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 8,
          source: 3,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        },
        {
          id: 9,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        },
        {
          id: 10,
          source: 4,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 11,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10
          }
        }
      ]
    }

    const expectedState = {
      nodes: [
        {
          id: 0,
          type: 'regular',
          vis: { inAggregation: 4 }
        },
        {
          id: 1,
          type: 'regular',
          vis: { inAggregation: 4 }
        },
        { id: 2, type: 'regular', vis: { inAggregation: 5 } },
        { id: 3, type: 'regular' },
        { id: 4, type: 'group', vis: { isUserDefined: true, inAggregation: 5 } },
        { id: 5, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        // original, disabled
        {
          id: 0,
          source: 0,
          target: 2,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 1,
          source: 2,
          target: 1,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 2,
          source: 3,
          target: 0,
          direction: true,
          vis: { inAggregation: 4 }
        },
        {
          id: 3,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        {
          id: 4,
          source: 3,
          target: 1,
          direction: false,
          vis: { inAggregation: 4 }
        },
        // new
        {
          id: 5,
          source: 4,
          target: 2,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7,
            inAggregation: 5
          }
        },
        {
          id: 6,
          source: 2,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 7,
            inAggregation: 5
          }
        },
        {
          id: 7,
          source: 4,
          target: 2,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true,
            inAggregation: 5
          }
        },
        {
          id: 8,
          source: 3,
          target: 4,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10,
            inAggregation: 5
          }
        },
        {
          id: 9,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10,
            inAggregation: 5
          }
        },
        {
          id: 10,
          source: 4,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true,
            inAggregation: 5
          }
        },
        {
          id: 11,
          source: 3,
          target: 4,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 10,
            inAggregation: 5
          }
        },
        // new
        {
          id: 12,
          source: 3,
          target: 5,
          direction: true,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 14
          }
        },
        {
          id: 13,
          source: 3,
          target: 5,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 14
          }
        },
        {
          id: 14,
          source: 5,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        },
        {
          id: 15,
          source: 3,
          target: 5,
          direction: false,
          vis: {
            isTransferred: true,
            isUserDefined: true,
            inMultilink: 14
          }
        }
      ]
    }

    const payload = {
      nodeIds: [2, 4],
      targetGroupNode: { type: 'group' }
    }
    const expectedPayload = {
      nodeIds: [2, 4],
      targetGroupNode: { id: 5, type: 'group', vis: { isUserDefined: true } },
      newVisibleLinks: [
        {
          id: 14,
          source: 5,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: {
            isTransferred: true,
            isMultilink: true,
            isUserDefined: true
          }
        }
      ],
      replacedLinkIds: [5, 6, 7, 8, 9, 10, 11]
    }

    mutations.GROUP_NODES(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toMatchObject(expectedPayload)
  })
})

describe('store/data/UNGROUP_NODE', () => {
  it('fails with invalid node id', () => {
    for (const testId of [{}, [1], NaN, -1]) {
      expect(() => {
        mutations.UNGROUP_NODE({ nodes: [{ id: 0 }] }, { nodeId: testId })
      }).toThrow()
    }
  })

  it('fails if node does not exist', () => {
    expect(() => {
      mutations.UNGROUP_NODE({ nodes: [{ id: 0 }] }, { nodeId: 1 })
    }).toThrow()
  })

  it('fails if not group', () => {
    const state = { nodes: [{ id: 0 }], links: [] }

    expect(() => {
      mutations.UNGROUP_NODE(state, { nodeId: 0 })
    }).toThrow()
  })

  it('multilink simple', () => {
    const state = {
      nodes: [
        { id: 0, type: 'regular' },
        { id: 1, type: 'regular', vis: { inAggregation: 3 } },
        { id: 2, type: 'regular', vis: { inAggregation: 3 } },
        { id: 3, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        {
          id: 0,
          source: 0,
          target: 1,
          direction: true,
          vis: { inMultilink: 2, inAggregation: 3 }
        },
        {
          id: 1,
          source: 1,
          target: 0,
          direction: true,
          vis: { inMultilink: 2, inAggregation: 3 }
        },
        {
          id: 2,
          source: 0,
          target: 1,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isMultilink: true, inAggregation: 3 }
        },
        {
          id: 3,
          source: 0,
          target: 2,
          direction: false,
          vis: { inAggregation: 3 }
        },
        // new
        {
          id: 4,
          source: 0,
          target: 3,
          direction: true,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        },
        {
          id: 5,
          source: 3,
          target: 0,
          direction: true,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        },
        {
          id: 6,
          source: 3,
          target: 0,
          direction: {
            nonDirectional: true,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isUserDefined: true, isTransferred: true, isMultilink: true }
        },
        {
          id: 7,
          source: 0,
          target: 3,
          direction: false,
          vis: { isUserDefined: true, isTransferred: true, inMultilink: 6 }
        }
      ]
    }
    const expectedState = {
      nodes: [{ id: 0, type: 'regular' }, { id: 1, type: 'regular' }, { id: 2, type: 'regular' }],
      links: [
        {
          id: 0,
          source: 0,
          target: 1,
          direction: true,
          vis: { inMultilink: 2 }
        },
        {
          id: 1,
          source: 1,
          target: 0,
          direction: true,
          vis: { inMultilink: 2 }
        },
        {
          id: 2,
          source: 0,
          target: 1,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isMultilink: true }
        },
        {
          id: 3,
          source: 0,
          target: 2,
          direction: false
        }
      ]
    }

    const payload = {
      nodeId: 3
    }
    const expectedPayload = {
      nodeId: 3,
      newVisibleLinks: [
        {
          id: 2,
          source: 0,
          target: 1,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isMultilink: true }
        },
        {
          id: 3,
          source: 0,
          target: 2,
          direction: false
        }
      ],
      newVisibleNodes: [{ id: 1, type: 'regular' }, { id: 2, type: 'regular' }],
      removedLinkIds: [6]
    }

    mutations.UNGROUP_NODE(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toEqual(expectedPayload)
  })

  it('multilinks', () => {
    const state = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular', vis: { inAggregation: 4 } },
        { id: 1, dataClass: 'document', type: 'regular', vis: { inAggregation: 4 } },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' },
        { id: 4, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        // original, disabled
        { id: 0, source: 0, target: 2, direction: true, vis: { inAggregation: 4 } },
        { id: 1, source: 2, target: 1, direction: true, vis: { inAggregation: 4 } },
        { id: 2, source: 3, target: 0, direction: true, vis: { inAggregation: 4 } },
        { id: 3, source: 3, target: 1, direction: false, vis: { inAggregation: 4 } },
        { id: 4, source: 3, target: 1, direction: false, vis: { inAggregation: 4 } },
        // new
        {
          id: 5,
          source: 4,
          target: 2,
          direction: true,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 7 }
        },
        {
          id: 6,
          source: 2,
          target: 4,
          direction: true,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 7 }
        },
        {
          id: 7,
          source: 4,
          target: 2,
          direction: {
            nonDirectional: false,
            sourceToTarget: true,
            targetToSource: true
          },
          vis: { isTransferred: true, isMultilink: true, isUserDefined: true }
        },
        {
          id: 8,
          source: 3,
          target: 4,
          direction: true,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 10 }
        },
        {
          id: 9,
          source: 3,
          target: 4,
          direction: false,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 10 }
        },
        {
          id: 10,
          source: 4,
          target: 3,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: true
          },
          vis: { isTransferred: true, isMultilink: true, isUserDefined: true }
        },
        {
          id: 11,
          source: 3,
          target: 4,
          direction: false,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 10 }
        }
      ]
    }

    const expectedState = {
      nodes: [
        { id: 0, dataClass: 'person', type: 'regular' },
        { id: 1, dataClass: 'document', type: 'regular' },
        { id: 2, dataClass: 'a', type: 'regular' },
        { id: 3, dataClass: 'b', type: 'regular' }
      ],
      links: [
        { id: 0, source: 0, target: 2, direction: true },
        { id: 1, source: 2, target: 1, direction: true },
        { id: 2, source: 3, target: 0, direction: true },
        { id: 3, source: 3, target: 1, direction: false },
        { id: 4, source: 3, target: 1, direction: false }
      ]
    }

    const payload = {
      nodeId: 4
    }
    const expectedPayload = {
      nodeId: 4,
      newVisibleLinks: [
        { id: 0, source: 0, target: 2, direction: true },
        { id: 1, source: 2, target: 1, direction: true },
        { id: 2, source: 3, target: 0, direction: true },
        { id: 3, source: 3, target: 1, direction: false },
        { id: 4, source: 3, target: 1, direction: false }
      ],
      newVisibleNodes: [
        { id: 0, dataClass: 'person', type: 'regular' },
        { id: 1, dataClass: 'document', type: 'regular' }
      ],
      removedLinkIds: [7, 10]
    }

    mutations.UNGROUP_NODE(state, payload)

    expect(state).toEqual(expectedState)
    expect(payload).toEqual(expectedPayload)
  })

  it('ungrouping in different order', () => {
    const state = {
      nodes: [
        { id: 0, type: 'regular', vis: { inAggregation: 4 } },
        { id: 1, type: 'regular', vis: { inAggregation: 4 } },
        { id: 2, type: 'regular', vis: { inAggregation: 5 } },
        { id: 3, type: 'regular', vis: { inAggregation: 5 } },
        { id: 4, type: 'group', vis: { isUserDefined: true } },
        { id: 5, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        // original
        { id: 0, source: 0, target: 1, vis: { inAggregation: 4 } },
        { id: 1, source: 0, target: 2, vis: { inAggregation: 4 } },
        { id: 2, source: 3, target: 1, vis: { inAggregation: 4 } },
        // after aggregating 0,1 in 4
        {
          id: 3,
          source: 4,
          target: 2,
          vis: { inAggregation: 5, isTransferred: true, isUserDefined: true }
        },
        {
          id: 4,
          source: 3,
          target: 4,
          vis: { inAggregation: 5, isTransferred: true, isUserDefined: true }
        },
        // after aggregating 2,3 in 5
        {
          id: 5,
          source: 4,
          target: 5,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 7 }
        },
        {
          id: 6,
          source: 5,
          target: 4,
          vis: { isTransferred: true, isUserDefined: true, inMultilink: 7 }
        },
        {
          id: 7,
          source: 4,
          target: 5,
          direction: {
            nonDirectional: true,
            sourceToTarget: false,
            targetToSource: false
          },
          vis: { isTransferred: true, isMultilink: true, isUserDefined: true }
        }
      ]
    }
    const expectedStateAfterDissagregating4 = {
      nodes: [
        { id: 0, type: 'regular' },
        { id: 1, type: 'regular' },
        { id: 2, type: 'regular', vis: { inAggregation: 5 } },
        { id: 3, type: 'regular', vis: { inAggregation: 5 } },
        { id: 5, type: 'group', vis: { isUserDefined: true } }
      ],
      links: [
        { id: 0, source: 0, target: 1 },
        { id: 1, source: 0, target: 2, vis: { inAggregation: 5 } },
        { id: 2, source: 3, target: 1, vis: { inAggregation: 5 } },
        // after aggregating 0,1 in 4
        {
          id: 3,
          source: 4,
          target: 2,
          vis: { inAggregation: 5, isTransferred: true, isUserDefined: true }
        },
        {
          id: 4,
          source: 3,
          target: 4,
          vis: { inAggregation: 5, isTransferred: true, isUserDefined: true }
        },
        // new links replacing 1,2 after dissagregating
        { id: 5, source: 0, target: 5, vis: { isTransferred: true, isUserDefined: true } },
        { id: 6, source: 5, target: 1, vis: { isTransferred: true, isUserDefined: true } }
      ]
    }
    // also original state:
    const expectedStateAfterDissagregating5 = {
      nodes: [
        { id: 0, type: 'regular' },
        { id: 1, type: 'regular' },
        { id: 2, type: 'regular' },
        { id: 3, type: 'regular' }
      ],
      links: [
        { id: 0, source: 0, target: 1 },
        { id: 1, source: 0, target: 2 },
        { id: 2, source: 3, target: 1 }
      ]
    }

    // dissagregate 4
    const payload1 = { nodeId: 4 }
    mutations.UNGROUP_NODE(state, payload1)

    const expectedPayloadAfterDissagregating4 = {
      nodeId: 4,
      newVisibleLinks: [
        { id: 0, source: 0, target: 1 },
        { id: 5, source: 0, target: 5, vis: { isUserDefined: true, isTransferred: true } },
        { id: 6, source: 5, target: 1, vis: { isUserDefined: true, isTransferred: true } }
      ],
      newVisibleNodes: [{ id: 0, type: 'regular' }, { id: 1, type: 'regular' }],
      removedLinkIds: [7]
    }
    expect(state).toEqual(expectedStateAfterDissagregating4)
    expect(payload1).toEqual(expectedPayloadAfterDissagregating4)

    // dissagregate 5
    const payload2 = { nodeId: 5 }
    mutations.UNGROUP_NODE(state, payload2)

    const expectedPayloadAfterDissagregating5 = {
      nodeId: 5,
      newVisibleLinks: [{ id: 1, source: 0, target: 2 }, { id: 2, source: 3, target: 1 }],
      newVisibleNodes: [{ id: 2, type: 'regular' }, { id: 3, type: 'regular' }],
      removedLinkIds: [5, 6]
    }
    expect(state).toEqual(expectedStateAfterDissagregating5)
    expect(payload2).toEqual(expectedPayloadAfterDissagregating5)
  })

  it('ungrouping with a hierarchy', () => {
    const state = {
      nodes: [
        {
          id: 0,
          name: 'Danielle Cowan',
          type: 'regular',
          label: 'Danielle'
        },
        {
          id: 1,
          name: 'Malcolm Wang',
          type: 'regular',
          label: 'Malcolm'
        },
        {
          id: 2,
          name: 'Paula Walter',
          type: 'regular',
          label: 'Paula'
        },
        {
          id: 3,
          name: 'Steven Kang',
          type: 'regular',
          label: 'Steven'
        },
        {
          id: 4,
          name: 'Drill & co.',
          type: 'regular',
          label: 'Drill & co.'
        }
      ],
      links: [
        {
          id: 1,
          source: 3,
          target: 1,
          direction: false
        },
        {
          id: 2,
          source: 3,
          target: 0,
          direction: true
        },
        {
          id: 4,
          source: 4,
          target: 3,
          direction: false
        },
        {
          id: 6,
          source: 2,
          target: 3,
          direction: false
        },
        {
          id: 7,
          source: 0,
          target: 1,
          direction: true
        },
        {
          id: 8,
          source: 0,
          target: 2,
          direction: true
        },
        {
          id: 9,
          source: 0,
          target: 4,
          direction: false
        },
        {
          id: 10,
          source: 1,
          target: 4,
          direction: true
        }
      ]
    }
    const expectedState = cloneDeep(state)

    const groupNode0 = { type: 'group', vis: { isUserDefined: true } }
    mutations.GROUP_NODES(state, {
      nodeIds: [2, 3 /* paula, steven */],
      targetGroupNode: groupNode0
    })

    const groupNode1 = { type: 'group', vis: { isUserDefined: true } }
    mutations.GROUP_NODES(state, {
      nodeIds: [1, 4 /* malcolm, drill */],
      targetGroupNode: groupNode1
    })

    const groupNode2 = { type: 'group', vis: { isUserDefined: true } }
    mutations.GROUP_NODES(state, {
      nodeIds: [0, groupNode1.id /* danielle, group of malcolm+drill */],
      targetGroupNode: groupNode2
    })

    const payload0 = { nodeId: groupNode0.id }
    mutations.UNGROUP_NODE(state, payload0)

    const payload1 = { nodeId: groupNode2.id }
    mutations.UNGROUP_NODE(state, payload1)

    const payload2 = { nodeId: groupNode1.id }
    mutations.UNGROUP_NODE(state, payload2)

    expect(state).toEqual(expectedState)
  })

  it.skip('ungrouping in different order 2', () => {
    const state = {
      nodes: [
        [
          {
            id: 0,
            name: 'Danielle Cowan',
            dataClass: 'person',
            type: 'regular',
            label: 'Danielle'
          },
          { id: 1, name: 'Malcolm Wang', dataClass: 'person', type: 'regular', label: 'Malcolm' },
          { id: 2, name: 'Paula Walter', dataClass: 'person', type: 'regular', label: 'Paula' },
          { id: 3, name: 'Steven Kang', dataClass: 'person', type: 'regular', label: 'Steven' },
          {
            id: 4,
            name: 'Drill & co.',
            dataClass: 'company',
            type: 'regular',
            label: 'Drill & co.'
          },
          {
            id: 5,
            name: 'Building lease',
            dataClass: 'document',
            type: 'regular',
            label: 'Building lease'
          },
          {
            id: 6,
            name: "Walters's home",
            dataClass: 'location',
            type: 'regular',
            label: "Walters's home"
          }
        ]
      ],

      links: [
        { id: 1, source: 3, target: 1, direction: false, description: 'Norman' },
        { id: 2, source: 3, target: 0, direction: true, description: 'Walter' },
        { id: 4, source: 4, target: 3, direction: false, description: 'Lisa' },
        { id: 6, source: 2, target: 3, direction: false, description: 'Leah' },
        { id: 7, source: 0, target: 1, direction: true, description: 'Dean' },
        { id: 8, source: 0, target: 2, direction: true, description: 'Ethel' },
        { id: 9, source: 3, target: 6, direction: true, description: 'Walter' },
        { id: 10, source: 4, target: 6, direction: false },
        { id: 11, source: 0, target: 5, direction: false },
        { id: 12, source: 1, target: 5, direction: true },
        { id: 13, source: 5, target: 4, direction: true },
        { id: 14, source: 5, target: 6, direction: false, vis: { inMultilink: 16 } },
        { id: 15, source: 6, target: 5, direction: true, vis: { inMultilink: 16 } },
        {
          id: 16,
          source: 5,
          target: 6,
          direction: { nonDirectional: true, sourceToTarget: false, targetToSource: true },
          vis: { isMultilink: true }
        }
      ]
    }

    // aggregate people
    const payload = {
      nodeIds: [0, 1, 2, 3],
      targetGroupNode: { type: 'group', vis: { isUserDefined: true } }
    }
    mutations.GROUP_NODES(state, payload)
    expect(payload.newVisibleLinks.length).toEqual(3)
    expect(payload.replacedLinkIds).toEqual([9, 4, 12, 1, 7, 11, 2, 8, 6])

    // aggregate rest
    const payload2 = {
      nodeIds: [4, 5, 6],
      targetGroupNode: { type: 'group', vis: { isUserDefined: true } }
    }
    mutations.GROUP_NODES(state, payload2)
    expect(payload.newVisibleLinks.length).toEqual(1)
    expect(payload.replacedLinkIds).toEqual([10, 16, 18, 13, 21, 17])

    // dissagregate first group
    const payload3 = { nodeId: 7 }
    mutations.UNGROUP_NODE(state, payload3)

    const expectedPayload3 = {
      nodeId: 7,
      newVisibleLinks: [
        { id: 0, source: 0, target: 1 },
        { id: 5, source: 0, target: 5, vis: { isUserDefined: true, isTransferred: true } },
        { id: 6, source: 5, target: 1, vis: { isUserDefined: true, isTransferred: true } }
      ],
      newVisibleNodes: [{ id: 0, type: 'regular' }, { id: 1, type: 'regular' }],
      removedLinkIds: [5, 6, 7]
    }
    expect(state).toEqual(expectedStateAfterDissagregating4)
    expect(payload3).toEqual(expectedPayload3)
  })
})

describe('store/data/GROUP_NODES && store/data/UNGROUP_NODE', () => {
  it('aggregate nodes in big dataset randomly into one group, then disaggregate all in random order; should match initial state; ignore payload for graph', () => {
    // this test seems sophisticated yet did not uncover bug on a small dataset for some reason
    for (let i = 0; i < 100; i++) {
      const state = cloneDeep(mockDataset) // load a bigger dataset, like harry
      const expectedState = cloneDeep(state)

      if (state.nodes.find(n => n.type === 'group'))
        throw Error('invalid input dataset, cannot contain groups')

      let nonGroupedNodeIds = []
      state.nodes.forEach(n => nonGroupedNodeIds.push(n.id))
      const groupedNodesIds = []

      // grouping
      while (nonGroupedNodeIds.length > 1) {
        let chooseCount = 0
        if (nonGroupedNodeIds.length < 6) chooseCount = nonGroupedNodeIds.length
        else chooseCount = random(2, 5)

        let chosenIds = []
        for (let i = 0; i < chooseCount; i++) {
          const chosenId = nonGroupedNodeIds[random(0, nonGroupedNodeIds.length - 1)]
          chosenIds.push(chosenId)
          nonGroupedNodeIds = nonGroupedNodeIds.filter(n => n !== chosenId)
        }

        if (chosenIds.length < 2) throw Error('chosen less then 2 nodes for grouping')
        const groupNode = { type: 'group', vis: { isUserDefined: true } }
        mutations.GROUP_NODES(state, {
          nodeIds: chosenIds,
          targetGroupNode: groupNode
        })
        //console.log('Grouped: ' + JSON.stringify(chosenIds) + ' in: ' + groupNode.id)

        chosenIds.forEach(id => groupedNodesIds.push(id))

        // sometimes, do random ungroup
        if (random(0, 100) < 40) {
          const visible = filterVisibleNodes(state.nodes).filter(n => n.type === 'group')
          const selectedId = visible[random(0, visible.length - 1)].id
          mutations.UNGROUP_NODE(state, { nodeId: selectedId })
        }
      }

      // ungrouping
      while (state.nodes.find(n => n.type === 'group')) {
        const visible = filterVisibleNodes(state.nodes).filter(n => n.type === 'group')
        const selectedId = visible[random(0, visible.length - 1)].id
        //console.log('Selected to ungroup: ' + selectedId)
        mutations.UNGROUP_NODE(state, { nodeId: selectedId })
      }

      expect(state).toEqual(expectedState)
    }
  })
})

describe('helpers', () => {
  it('createLink', () => {
    const state = { links: [] }
    const expectedState = { links: [{ id: 0, source: 42, target: 24, vis: { inAggregation: 3 } }] }

    const link = createLink(0, 42, 24, { inAggregation: 3 })
    state.links.push(link)

    expect(state).toEqual(expectedState)
    expect(link).toEqual(state.links[0])
  })
})
