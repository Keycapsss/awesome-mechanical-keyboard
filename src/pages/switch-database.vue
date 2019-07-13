<template>
  <Layout>
    <div class="container-inner mx-auto py-16">
      <h2 class="text-4xl font-bold mb-16">Mechanical Keyboard Switch Database</h2>
      <div>
        <vue-good-table
          :columns="columns"
          :rows="switches"/>
      </div>
    </div>

  </Layout>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

const axios = require('axios');

export default {
  metaInfo: {
    title: 'Mechanical Keyboard Switch Database'
  },
  components: {
    VueGoodTable,
  },
  data(){
    return {
      switches: null,
      columns: [
        {
          label: 'Id',
          field: 'id',
        },
        {
          label: 'Marke',
          field: 'brand',
        },
        {
          label: 'Type',
          field: 'type',
        },
      ],
    };
  },
  mounted: function () {
    axios
    .get('https://benroe.github.io/switch-database/mechanical-keyboard-switches.json')
    .then(response => (this.switches = response.data))
  }
}
</script>

