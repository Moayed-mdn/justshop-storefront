<script setup>
const { t } = useI18n();
</script>

<template>
    <div>
        <div class="relative bottom-5">
            <img class="w-62.5 h-25 " src="~/assets/icons/logo.png">
            <p class="mt-4 text-[var(--footer-text)]">{{ t("description") }}</p>
        </div>
    </div>
</template>