<script setup>
const { t } = useI18n();
</script>

<template>
  <div class="border-t border-gray-200 pt-8">
    <div class="flex flex-wrap flex-col md:flex-row gap-2 justify-between items-center">
      <div class="flex flex-wrap space-x-6">
        <div class="flex items-center space-x-2">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb0ed6e927bdf5bc4309e0_briefcase.svg">
          <a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium">{{ t("bottom.become_seller") }}</a>
        </div>
        <div class="flex items-center space-x-2">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb0ed6c4510c256356f4cd_gift.svg">
          <a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium">{{ t("bottom.gift_cards") }}</a>
        </div>
        <div class="flex items-center space-x-2">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb0ed6ae57fd74e0402aa4_help-circle.svg">
          <a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium">{{ t("bottom.help_center") }}</a>
        </div>
      </div>
      <div class="flex flex-wrap space-x-6">
        <a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium">{{ t("bottom.terms_of_service") }}</a>
        <a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium">{{ t("bottom.privacy_policy") }}</a>
      </div>
    </div>
  </div>
</template>