<template>
  <div class="bg-secondary h-screen relative">
    <NuxtPage/>
  </div>
</template>

<script setup>
  useHead({
    titleTemplate: (title) => title ? `${title} | Graphite Writer` : 'Graphite Writer',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    charset: 'utf-8',
    meta: [
     // { name: 'description', content: 'My amazing site.' }
    ]
  })
  </script>