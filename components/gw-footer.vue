<template>
    <footer class="bg-back-gray w-full p-4 grid grid-rows-footer gap-4 ">
        <div class="flex">
            <img src="~/assets/images/wordmark.svg" alt="Graphite Writer Logo" class="h-8"/>
            <select name="Language" id="languageSelect" class="ml-auto">
                <option value="english">english</option>
            </select>
        </div>
        <div class="flex flex-grid grid-cols-3 gap-4">
            <div class="flex flex-col">
                <h4 class="font-light">App</h4>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
            </div>
            <div class="flex flex-col">
                <h4 class="font-light">App</h4>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
            </div>
            <div class="flex flex-col">
                <h4 class="font-light">App</h4>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
                <nuxt-link>Documents</nuxt-link>
            </div>
            
            
        </div>
        <div>
<p>Graphite Writer is a free and open source project developed by Ronan Furuta</p>
<div class="flex items-center">
    <p>Graphite Writer is released under the APL-2.0 License. If you’re interested in contributing to its development check out our Github</p>
<p class="ml-auto text-right">Have a question? Contact Support.</p>
</div>
<hr class="my-2">
<div class="flex items-center">
    <p>Tagline goes here about fast and speed</p>
    <p class="ml-auto text-xs">By using Graphite Writer you consent to our use of cookies and agree to be bound by our terms of use and privacy policy</p>
</div>
        </div>
        
     
    </footer>
</template>