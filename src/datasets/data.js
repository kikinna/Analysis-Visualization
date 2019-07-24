export default {
  nodes: [
    {
      id: 0,
      name: 'Danielle Cowan',
      dataClass: 'person',
      type: 'regular',
      label: 'Danielle'
    },
    {
      id: 1,
      name: 'Malcolm Wang',
      dataClass: 'person',
      type: 'regular',
      label: 'Malcolm'
    },
    {
      id: 2,
      name: 'Paula Walter',
      dataClass: 'person',
      type: 'regular',
      label: 'Paula'
    },
    {
      id: 3,
      name: 'Steven Kang',
      dataClass: 'person',
      type: 'regular',
      label: 'Steven'
    },
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
  ],

  links: [
    {
      id: 1,
      source: 3,
      target: 1,
      direction: false,
      description: 'Norman'
    },
    {
      id: 2,
      source: 3,
      target: 0,
      direction: true,
      description: 'Walter'
    },
    {
      id: 4,
      source: 4,
      target: 3,
      direction: false,
      description: 'Lisa'
    },
    {
      id: 6,
      source: 2,
      target: 3,
      direction: false,
      description: 'Leah'
    },
    {
      id: 7,
      source: 0,
      target: 1,
      direction: true,
      description: 'Dean'
    },
    {
      id: 8,
      source: 0,
      target: 2,
      direction: true,
      description: 'Ethel'
    },

    {
      id: 9,
      source: 3,
      target: 6,
      direction: true,
      description: 'Walter'
    },
    {
      id: 10,
      source: 4,
      target: 6,
      direction: false
    },
    {
      id: 11,
      source: 0,
      target: 5,
      direction: false
    },
    {
      id: 12,
      source: 1,
      target: 5,
      direction: true
    },
    {
      id: 13,
      source: 5,
      target: 4,
      direction: true
    },

    // multilink
    {
      id: 14,
      source: 5,
      target: 6,
      direction: false,
      vis: { inMultilink: 16 }
    },
    {
      id: 15,
      source: 6,
      target: 5,
      direction: true,
      vis: { inMultilink: 16 }
    },
    {
      id: 16,
      source: 5,
      target: 6,
      direction: {
        nonDirectional: true,
        sourceToTarget: false,
        targetToSource: true
      },
      vis: { isMultilink: true }
    }
  ]
}
