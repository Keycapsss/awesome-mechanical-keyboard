<template>
  <div class="p-4 bg-gray-200 rounded-b">
    <div class="flex flex-wrap">
      <div class="md:w-1/4 w-1/3 mb-4">
        <div class="font-bold mb-1">
          Colors
        </div>
        <ul>
          <li>Stem: {{ rowData.stem_color }}</li>
          <li>Housing Top: {{ rowData.housing_color.top }}</li>
          <li>Housing Bottom: {{ rowData.housing_color.bottom }}</li>
          <li>Spring: {{ rowData.spring_color }}</li>
        </ul>
      </div>
      <div class="md:w-1/4 w-1/3 mb-4">
        <div class="font-bold mb-1">
          Travel
        </div>
        <ul>
          <li>Actuation: {{ rowData.travel.actuation }}mm</li>
          <li>Bottom Out: {{ rowData.travel.bottom_out }}mm</li>
        </ul>
      </div>
      <div class="md:w-1/4 w-1/3 mb-4">
        <div class="font-bold mb-1">
          Mic
        </div>
        <ul>
          <li>Sense Method: {{ rowData.sense_method }}</li>
          <li>Led Style: {{ rowData.led_style }}</li>
          <li v-if="rowData.datasheet">
            <a :href="rowData.datasheet">Datasheet</a>
          </li>
        </ul>
      </div>
      <div :v-if="rowData.images.length > 0" class="md:w-1/4 w-full md:justify-center">
        <img :src="rowData.images[0]" :alt="rowData.brand + rowData.model">
      </div>
    </div>
    <div class="mt-4">
        <div class="font-bold">
          Notes
        </div>
      <p>{{ rowData.notes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "switch-detail-row",
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    },
    options: {
      type: Object,
    }
  }
}
</script>

<style>
.vuetable-detail-row td {
  padding-top: 0;
}
</style>