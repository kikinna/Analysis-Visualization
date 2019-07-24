export default {
  nodes: [
    {
      id: 0,
      name: 'Danielle Cowan',
      dataClass: 'person',
      type: 'regular',
      label: 'Danielle',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 1,
      name: 'Malcolm Wang',
      dataClass: 'person',
      type: 'regular',
      label: 'Malcolm',
      vis: {
        isUserDefined: true
      }
    },
    {
      id: 2,
      name: 'Paula Walter',
      dataClass: 'person',
      type: 'regular',
      label: 'Paula',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 3,
      name: 'Steven Kang',
      dataClass: 'person',
      type: 'regular',
      label: 'Steven',
      vis: {
        isUserDefined: true
      }
    },
    {
      id: 4,
      name: 'Alan Hardison',
      dataClass: 'person',
      type: 'regular',
      label: 'A. Hardison',
      vis: {
        isUserDefined: false
      }
    }
  ],

  links: [
    {
      id: 1,
      source: 3,
      target: 1,
      direction: false,
      description: 'Norman',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 2,
      source: 3,
      target: 0,
      direction: true,
      description: 'Walter',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 4,
      source: 4,
      target: 3,
      direction: false,
      description: 'Lisa',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 6,
      source: 2,
      target: 3,
      direction: false,
      description: 'Leah',
      vis: {
        isUserDefined: false
      }
    },
    {
      id: 7,
      source: 0,
      target: 1,
      direction: true,
      description: 'Dean',
      vis: {
        isUserDefined: true
      }
    },
    {
      id: 8,
      source: 0,
      target: 2,
      direction: true,
      description: 'Ethel',
      vis: {
        isUserDefined: true
      }
    }
  ]
}
