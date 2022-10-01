<template>
  <div>
    <editor-nav />
    <div class="bg-secondary min-h-screen text-white homegrid">
      <div class="nav-spacer"></div>
      <main class="w-full relative">
        <div class="w-full h-9/10 p-4 grid grid-cols-12">
         

          <client-only>
            <tip-tap/>
</client-only>
      
        </div>
        <gw-footer />
      </main>
    </div>
  </div>
</template>

<script setup>

useHead({
  title: "Editor",
  style: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css",
    },
  ],
});
definePageMeta({
  title: "Editor",
});
</script>
