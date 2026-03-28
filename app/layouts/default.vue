<template>
    <div class="flex flex-col min-h-screen  ">
        <Topbar/>
        <Header/>
         <main class="flex-1 ">
            <slot/>
         </main>

         <Footer/>
    </div>    
</template>
