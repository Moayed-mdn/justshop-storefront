<script setup>
const { t } = useI18n();
</script>

<template>
    <div class="mt-6">
        <div class="font-bold text-[var(--footer-heading)]">{{ t("accepted_payments") }}</div>
        <div class="flex space-x-2 mt-2 flex-wrap gap-y-2">
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8816711ebecac46d8_stripe.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce82d440b7ab84a993f_visa.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8f032504012a5896b_Mastercard.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e48b497e6ce846b7ff_Amazon.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1f054e419e42aca4a9a2_Klarna.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce7c4510cf9a55828a0_PayPal.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e4707380264b25e680_ApplePay.png"></div>
        <div class="w-16 h-10 rounded-md flex items-center justify-center border p-2 border-[var(--footer-payment-border)]"><img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1f55dc68c5ee83d0cbf8_GooglePay.png"></div>
        </div>
    </div>
</template>