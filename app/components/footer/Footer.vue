<script setup>
const { t } = useI18n();
</script>

<template>

    <AppContainer>
        <footer  class="bg-white pt-24 pb-12 border-y border-gray-200">
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8">
                <div class="col-span-2">
                    <div class="relative bottom-5">
                        <img class="w-62.5 h-25 " src="~/assets/icons/logo.png">
                        <p class="text-gray-800 mt-4">{{ t("description") }}</p>
                    </div>
                    <div class="mt-6">
                        <div class="text-gray-800 font-bold">{{ t("accepted_payments") }}</div>
                        <div class="flex space-x-2 mt-2 flex-wrap gap-y-2">
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2 "><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8816711ebecac46d8_stripe.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce82d440b7ab84a993f_visa.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8f032504012a5896b_Mastercard.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e48b497e6ce846b7ff_Amazon.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1f054e419e42aca4a9a2_Klarna.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce7c4510cf9a55828a0_PayPal.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e4707380264b25e680_ApplePay.png"></div>
                        <div class="w-16 h-10 rounded-md flex items-center justify-center border border-gray-300 p-2"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1f55dc68c5ee83d0cbf8_GooglePay.png"></div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <div class="text-gray-800 font-bold">{{ t("department") }}</div>
                    <ul class="mt-4 space-y-2">
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all ">{{ t("departments.fashion") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.education") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.frozen_food") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.beverages") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.organic_grocery") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.office_supplies") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.beauty_products") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.books") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.electronics") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.travel") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.fitness") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.sneakers") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.toys") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("departments.furniture") }}</a></li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <div class="text-gray-800 font-bold">{{ t("about_us") }}</div>
                    <ul class="mt-4 space-y-2">
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.about_shopcart") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.careers") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.news_blog") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.help") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.press_center") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.shop_by_location") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.shopcart_brands") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.affiliate_partners") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("about.ideas_guides") }}</a></li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <div class="text-gray-800 font-bold">{{ t("services") }}</div>
                    <ul class="mt-4 space-y-2">
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("service_list.gift_card") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("service_list.mobile_app") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("service_list.shipping_delivery") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("service_list.order_pickup") }}</a></li>
                    <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("service_list.account_signup") }}</a></li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <div class="text-gray-800 font-bold">{{ t("help_section") }}</div>
                    <ul class="mt-4 space-y-2">
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.shopcart_help") }}</a></li>
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.returns") }}</a></li>
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.track_orders") }}</a></li>
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.contact_us") }}</a></li>
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.feedback") }}</a></li>
                        <li><a href="#" class="text-gray-800 hover:text-(--color-accent) font-medium relative left-0 hover:left-2 transition-all">{{ t("help_list.security_fraud") }}</a></li>
                    </ul>
                </div>
            </div>
        
        <FooterBottom />
        </footer>
    </AppContainer>
</template>