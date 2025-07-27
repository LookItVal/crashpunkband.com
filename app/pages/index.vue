<template>
    <div class="h-[100svh] flex flex-col items-center justify-center bg-cover bg-center relative" style="background-image: url('/images/crash_replay.jpg');">
        <div class="absolute inset-0 bg-black opacity-60"></div>
        <div class="relative z-10 flex flex-col items-center">
            <img src="/images/crash_banner.png" alt="CRASH" class="w-64 md:w-96" />
            <h1 class="text-white text-4xl font-bold">Coming Soon.</h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'CRASH',
  meta: [
    {
      name: 'description',
      content: 'Official website for the punk band CRASH. Coming soon.'
    }
  ]
})
</script>