<template>
    <div class="absolute w-full top-[15%] bg-secondary rounded-md drop-shadow-xl">
        <slot class="w-full top-0"></slot>
       <div class="p-4" v-if="false">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-2">
            <collection-pill/>
            <collection-pill/>
            <collection-pill/>
        </div>
        <div class="mt-6">
<document-search-result/>
<document-search-result/>
        </div>
        
       </div>
    </div>
</template>