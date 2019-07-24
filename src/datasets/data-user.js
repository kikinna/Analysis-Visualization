export default {
  nodes: [
    {
      id: 0,
      name: 'Danielle Cowan',
      dataClass: 'person',
      type: 'regular',
      label: 'Danielle',
      vis: { isUserDefined: true }
    },
    {
      id: 1,
      name: 'Malcolm Wang',
      dataClass: 'person',
      type: 'regular',
      label: 'Malcolm',
      vis: { isUserDefined: true }
    },
    {
      id: 2,
      name: 'Paula Walter',
      dataClass: 'person',
      type: 'regular',
      label: 'Paula',
      vis: { isUserDefined: true }
    },
    {
      id: 3,
      name: 'Steven Kang',
      dataClass: 'person',
      type: 'regular',
      label: 'Steven',
      vis: { isUserDefined: true }
    },
    {
      id: 4,
      name: 'Drill & co.',
      dataClass: 'company',
      type: 'regular',
      label: 'Drill & co.',
      vis: { isUserDefined: true }
    },
    {
      id: 5,
      name: 'Building lease',
      dataClass: 'document',
      type: 'regular',
      label: 'Building lease',
      vis: { isUserDefined: true }
    },
    {
      id: 6,
      name: "Walters's home",
      dataClass: 'location',
      type: 'regular',
      label: "Walters's home",
      vis: { isUserDefined: true }
    }
  ],

  links: [
    {
      id: 1,
      source: 3,
      target: 1,
      direction: false,
      description: 'Norman',
      vis: { isUserDefined: true }
    },
    {
      id: 2,
      source: 3,
      target: 0,
      direction: true,
      description: 'Walter',
      vis: { isUserDefined: true }
    },
    {
      id: 4,
      source: 4,
      target: 3,
      direction: false,
      description: 'Lisa',
      vis: { isUserDefined: true }
    },
    {
      id: 6,
      source: 2,
      target: 3,
      direction: false,
      description: 'Leah',
      vis: { isUserDefined: true }
    },
    {
      id: 7,
      source: 0,
      target: 1,
      direction: true,
      description: 'Dean',
      vis: { isUserDefined: true }
    },
    {
      id: 8,
      source: 0,
      target: 2,
      direction: true,
      description: 'Ethel',
      vis: { isUserDefined: true }
    },

    {
      id: 9,
      source: 3,
      target: 6,
      direction: true,
      description: 'Walter',
      vis: { isUserDefined: true }
    },
    {
      id: 10,
      source: 4,
      target: 6,
      direction: false,
      vis: { isUserDefined: true }
    },
    {
      id: 11,
      source: 0,
      target: 5,
      direction: false,
      vis: { isUserDefined: true }
    },
    {
      id: 12,
      source: 1,
      target: 5,
      direction: true,
      vis: { isUserDefined: true }
    },
    {
      id: 13,
      source: 5,
      target: 4,
      direction: true,
      vis: { isUserDefined: true }
    },

    // multilink
    {
      id: 14,
      source: 5,
      target: 6,
      direction: false,
      vis: { isUserDefined: true, inMultilink: 16 }
    },
    {
      id: 15,
      source: 6,
      target: 5,
      direction: true,
      vis: { isUserDefined: true, inMultilink: 16 }
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
      vis: { isUserDefined: true, isMultilink: true }
    }
  ]
}
