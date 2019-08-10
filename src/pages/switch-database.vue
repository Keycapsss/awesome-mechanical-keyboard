<template>
  <Layout>
    <div class="w-full mx-auto py-16">
      <h2 class="text-4xl font-bold mb-16">Mechanical Keyboard Switch Database</h2>
      <div>
        <ClientOnly>
        <vuetable ref="vuetable"
          :api-mode="false"
          :fields="fields"
          :per-page="perPage"
          :data-manager="dataManager"
          pagination-path="pagination"
          :detail-row-component="detailRow"
          :css="css.table"
          @vuetable:row-clicked="toggleDetailRow($event)"
        ></vuetable>
         </ClientOnly>
      </div>
    </div>

  </Layout>
</template>

<page-query>

</page-query>

<script>
import _ from "lodash";
import axios from "axios"
import Vuetable from 'vuetable-2'
import SwitchDetailRow from '~/components/SwitchDetailRow.vue'

export default {
  metaInfo: {
    title: 'Mechanical Keyboard Switch Database'
  },
  components: {
    Vuetable,
  },
  data(){
    return {
      perPage: 3,
      data: [],
      detailRow: SwitchDetailRow,
      fields: [
        { name: 'id',visible: false },
        { name: 'brand', sortField: 'brand', titleClass: 'text-left' },
        { name: 'model', sortField: 'model', titleClass: 'text-left' },
        { name: 'action', titleClass: 'text-left'},
        { name: 'keycap_mount', title: 'Keycap Mount', titleClass: 'text-left' },
        { name: 'switch_mount', title: 'Switch Mount', titleClass: 'text-left' },
        { name: 'force.actuation', sortField: 'force.actuation',  dataClass: 'text-center', formatter: (value) => `${value} gf`},
        { name: 'force.peak', sortField: 'force.peak',  dataClass: 'text-center', formatter: (value) => `${value} gf` },
      ],
      sortOrder: [
        {
          field: "brand",
          direction: "asc"
        }
      ],
      css: {
        table: {
          tableBodyClass: 'block overflow-x-auto w-full',
        },
      },
    };
  },
  watch: {
    data(newVal, oldVal) {
      this.$refs.vuetable.refresh();
    }
  },
  mounted: function () {
    axios
    .get('https://benroe.github.io/switch-database/mechanical-keyboard-switches.json')
    .then(response => (this.data = response.data))
  },
  methods: {
    toggleDetailRow(event) {
      this.$refs.vuetable.toggleDetailRow(event.data.id);
    },
    dataManager(sortOrder, pagination) {      
      if (this.data.length < 1) return;

      let local = this.data;

      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        // console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        local = _.orderBy(
          local,
          sortOrder[0].sortField,
          sortOrder[0].direction
        );
      }
      
      pagination = this.$refs.vuetable.makePagination(
        local.length,
        this.perPage
      );
      // console.log('pagination:', pagination)
      let from = pagination.from - 1;
      let to = from + this.perPage;

      return {
        pagination: pagination,
        data: _.slice(local, from, to)
      };

    },
  },
}
</script>

