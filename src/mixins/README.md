All functionality that is common between components should be in this folder.
A mixin object:

export default {
props: {
...
},
data: function() {
...
},
methods: {
...
},
};

can be merged into component like this:

import ExampleMixin from '@/mixins/ExampleMixin';
// then, add to options:
mixins: [ExampleMixin],

See https://vuejs.org/v2/guide/mixins.html.
