export default {
  nodes: [
    {
      id: 0,
      name: 'Danielle Cowan',
      type: 'person',
      node_type: 'regular',
      label: 'Chris Eason',
      props: {
        user_defined: true
      }
    },
    {
      id: 1,
      name: 'Malcolm Wang',
      type: 'person',
      node_type: 'regular',
      label: 'Gene Riley',
      props: {
        user_defined: true
      }
    },
    {
      id: 2,
      name: 'Paula Walter',
      type: 'person',
      node_type: 'regular',
      label: 'Julia Crabtree',
      props: {
        user_defined: false
      }
    },
    {
      id: 3,
      name: 'Steven Kang',
      type: 'person',
      node_type: 'regular',
      label: 'Teresa Boyd',
      props: {
        user_defined: true
      }
    },
    {
      id: 4,
      name: 'Alan Hardison',
      type: 'person',
      node_type: 'regular',
      label: 'Peggy Rich',
      props: {
        user_defined: false
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
      props: {
        user_defined: false,
        multilink: false
      }
    },
    {
      id: 2,
      source: 3,
      target: 0,
      direction: true,
      description: 'Walter',
      props: {
        user_defined: false,
        multilink: true
      }
    },
    {
      id: 3,
      source: 3,
      target: 0,
      direction: true,
      description: 'Nina',
      props: {
        user_defined: false,
        multilink: false
      }
    },
    {
      id: 4,
      source: 4,
      target: 3,
      direction: false,
      description: 'Lisa',
      props: {
        user_defined: true,
        multilink: false
      }
    },
    {
      id: 5,
      source: 0,
      target: 0,
      direction: true,
      description: 'Heather',
      props: {
        user_defined: true,
        multilink: false
      }
    },
    {
      id: 6,
      source: 2,
      target: 3,
      direction: false,
      description: 'Leah',
      props: {
        user_defined: false,
        multilink: false
      }
    },
    {
      id: 7,
      source: 0,
      target: 1,
      direction: true,
      description: 'Dean',
      props: {
        user_defined: true,
        multilink: true
      }
    },
    {
      id: 8,
      source: 0,
      target: 2,
      direction: true,
      description: 'Ethel',
      props: {
        user_defined: true,
        multilink: true
      }
    }
  ]
}
