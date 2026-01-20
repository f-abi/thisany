<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-red-500" v-for="i in 100" :key="i">{{ t('hello') }}</div>
  </div>
</template>
