<template>
  <div>
    <editor-nav />
    <div class="bg-secondary min-h-screen text-white homegrid">
      <div class="nav-spacer"></div>
      <main class="w-full">
        <div class="w-full h-9/10 p-4 grid grid-cols-12">
          <div
            class="editor col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 xl:col-start-4 xl:col-span-6 my-12 min-h-[90vh] bg-white rounded-md text-secondary p-4"
          >

          <client-only>
            <tip-tap/>
</client-only>
          </div>
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
