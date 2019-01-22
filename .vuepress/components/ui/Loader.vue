<template>
    <div v-if="loading" class="p-4">
        <HashLoader
                class="mx-auto"
                :loading="loading"
                color="#97168a"
                :size="50"></HashLoader>
    </div>
</template>

<script>
  export default {
    name: 'Loader',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
