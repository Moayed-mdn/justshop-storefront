<script setup>

const { t } = useI18n();

const departmentLinks = [
  { key: 'departments.fashion' },
  { key: 'departments.education' },
  { key: 'departments.frozen_food' },
  { key: 'departments.beverages' },
  { key: 'departments.organic_grocery' },
  { key: 'departments.office_supplies' },
  { key: 'departments.beauty_products' },
  { key: 'departments.books' },
  { key: 'departments.electronics' },
  { key: 'departments.travel' },
  { key: 'departments.fitness' },
  { key: 'departments.sneakers' },
  { key: 'departments.toys' },
  { key: 'departments.furniture' },
];

const aboutUsLinks = [
  { key: 'about.about_shopcart' },
  { key: 'about.careers' },
  { key: 'about.news_blog' },
  { key: 'about.help' },
  { key: 'about.press_center' },
  { key: 'about.shop_by_location' },
  { key: 'about.shopcart_brands' },
  { key: 'about.affiliate_partners' },
  { key: 'about.ideas_guides' },
];

const servicesLinks = [
  { key: 'service_list.gift_card' },
  { key: 'service_list.mobile_app' },
  { key: 'service_list.shipping_delivery' },
  { key: 'service_list.order_pickup' },
  { key: 'service_list.account_signup' },
];

const helpLinks = [
  { key: 'help_list.shopcart_help' },
  { key: 'help_list.returns' },
  { key: 'help_list.track_orders' },
  { key: 'help_list.contact_us' },
  { key: 'help_list.feedback' },
  { key: 'help_list.security_fraud' },
];
</script>

<template>
  <footer class="px-(--site-gutter) pt-24 pb-12 border-y bg-[var(--footer-bg)] border-[var(--footer-border)]">
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          <div class="col-span-2">
              <FooterInfo />
              <FooterAcceptedPayments />
          </div>
          
          <FooterLinkList title="department" :links="departmentLinks" />
          <FooterLinkList title="about_us" :links="aboutUsLinks" />
          <FooterLinkList title="services" :links="servicesLinks" />
          <FooterLinkList title="help_section" :links="helpLinks" />
      </div>
  
  <FooterBottom />
  </footer>
</template>