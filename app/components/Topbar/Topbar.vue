<template>
    <div class="h-[var(--topbar-mobile-height)]
                sm:h-[var(--topbar-height)] 
                bg-[var(--topbar-bg)]
                text-[var(--topbar-text-color)]
                text-[length:var(--topbar-text-size)]
                font-bold
                px-[var(--site-gutter)]
         ">
          <div class="h-full flex flex-col sm:flex-row justify-evenly   items-center ">
            <a class="inline-flex items-center gap-2 hover:opacity-90 transition-opacity" href="tel:+001234567890">
                <span aria-hidden="true" class="inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46683 10.5325C0.868173 5.93332 1.52209 3.82727 2.00687 3.14861C2.06915 3.03892 3.60415 0.741091 5.24956 2.08922C9.33372 5.45281 4.16324 4.97725 7.59277 8.40736C11.023 11.8368 10.5474 6.66647 13.9104 10.7498C15.2586 12.3958 12.9607 13.9308 12.8517 13.9923C12.173 14.4778 10.0662 15.1317 5.46683 10.5325Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="sr-only">Call</span>
                <span>+00 123 456 7890</span>
            </a>
            <!-- center -->
            <div class=" hidden sm:flex flex-1 justify-center ">
                <p class="text-center">Get 50% Off on Selected Items</p>
                <span class="mx-4">|</span>
                <p> Shop Now</p>
            </div>

            <div class="flex">
                <div class="mx-3">
                    <TopbarLanguageSwitcher/>
                </div>
            </div>
          </div>
    </div>
</template>