export default {
  nodes: [
    {
      /**
       *  Unique identifier in the dataset.
       */
      id: 0,
      /**
       *  Node type: regular | alias | bundle | group
       */
      type: 'regular',
      /**
       *  TYPE
       *  Type of an object. Based on a type, character of other node attributes
       *  is decided.
       *
       *  List of known type-specific attributes
       *  Person    name, ...
       *  Group     members, ...
       */
      dataClass: 'Person',
      name: 'Alice',
      /**
       *  LABEL
       *  A string showed in node label. It can consist of one node attribute,
       *  depending on type, or it can be a combination of several attributes,
       *  e.g. SPZ + MPZ for cars
       */
      label: 'Alice',
      /**
       *  Properties specified for visualization purposes.
       */
      vis: {
        isUserDefined: Boolean,
        inAggregation: Number,
        isRemoved: Boolean // only for original nodes
      }
    }
  ],

  links: [
    /**
     * Link
     */
    {
      /**
       *  Unique identifier in the dataset.
       */
      id: 0,
      /**
       *  Node id in which the given link starts.
       */
      source: 0,
      /**
       *  Node id in which the given link ends.
       */
      target: 1,
      /**
       *  Properties specified for visualization purposes.
       */
      vis: {
        isUserDefined: Boolean,
        isMultilink: Boolean,
        isTransferred: Boolean,
        inAggregation: Number,
        inMultilink: Number
      }
    }
  ]
}
