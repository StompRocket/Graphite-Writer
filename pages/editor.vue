<template>
  <div>
    <editor-nav />
    <div class="bg-secondary min-h-screen text-white editorgrid">
      <div class="editor-nav-spacer"></div>
      <main class="w-full relative">
        <div class="w-full p-4 grid grid-cols-12 my-4 sm:my-12">
         

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
