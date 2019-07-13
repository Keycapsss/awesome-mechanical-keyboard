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

export default {
  metaInfo: {
    title: 'Mechanical Keyboard Switch Database'
  },
  data(){
    return {
      switches: null,
    };
  }
}
</script>

