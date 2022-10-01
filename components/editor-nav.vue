
<template>
    <nav class="backdrop-filter filter backdrop-blur-md  fixed w-full items-center justify-left p-4 bg-back-gray bg-opacity-95 firefox:bg-opacity-100 grid grid-cols-12 sm:grid-rows-1 grid-rows-2 gap-4 z-50 h-[11rem] sm:h-auto">
        <div class="md:col-span-4  sm:col-span-6 col-span-12 flex items-bottom">
            <nuxt-link to="/"> <img src="~/assets/images/icon.svg" alt="Graphite Writer Logo" class="h-12"></nuxt-link>
           
            <div class="ml-4 flex flex-col justify-center">
                <input type="text" placeholder="Document Title" class="gw-input focus:outline-none">
                <p class="text-sm text-white">Last edited: 5min ago <span class="text-primary">saved</span></p>
            </div>
        </div>
       <div class="col-span-5 md:block sm:hidden hidden"></div>
        
        <div class="md:col-span-3 sm:col-span-6 col-span-12 flex sm:justify-end items-center">
            <p class="text-red-500 pr-4 gw-btn-text">delete</p>
            <p class="text-white pr-4 gw-btn-text">print</p>
            <button class="gw-btn">SHARE</button>
            <img src="~/assets/images/profile.webp" class="rounded-full w-14 h-14 ml-4 hover:opacity-80 transition-all duration-150 ease-out" alt="profile image">
        </div>
      
    </nav>
</template>