<template>

        <button :class="{ 'bg-gray-200': active }"  class="py-2 px-1 mr-1 rounded-sm hover:bg-gray-100 transition-colors duration-200 ease-out" :alt="description">
  <img :src="activeIcon && active? '/icons/'+activeIcon+'.svg' : '/icons/'+icon+'.svg'" :alt="description" class="w-5">
</button>

  
    </template>
    <script setup>
        const props = defineProps(['active', 'description','icon', 'activeIcon'])
        </script>