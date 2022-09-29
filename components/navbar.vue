<template>
    <nav class="items-center justify-left p-4 bg-back-gray grid md:grid-cols-12 md:grid-rows-1 sm:grid-rows-2 gap-4">
        <div class="md:col-span-4 col-span-6"><img src="~/assets/images/wordmark.svg" alt="Graphite Writer Logo" class="w-72"></div>
        <div class="md:block hidden  col-span-4 "><input type="search" class="gw-search w-full" placeholder="search"></div>
        <div class="md:col-span-4 col-span-6 flex justify-end">
            <button class="gw-btn">NEW</button>
            <img src="~/assets/images/profile.webp" class="rounded-full w-14 h-14 ml-4 hover:opacity-80 transition-all duration-150 ease-out" alt="profile image">
        </div>
        <div class="md:hidden block col-span-12 row-span-1 "><input type="search" class="gw-search w-full" placeholder="search"></div>
      
    </nav>
</template>