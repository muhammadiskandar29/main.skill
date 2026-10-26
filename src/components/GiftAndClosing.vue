<script setup>
import { ref } from 'vue';
import { Gift, Copy, Check } from '@lucide/vue';

defineProps({
  bankAccounts: {
    type: Array,
    required: true
  },
  giftRegistry: {
    type: Array,
    required: true
  }
});

const copiedIndex = ref(null);

const copyAccount = (number, index) => {
  navigator.clipboard.writeText(number);
  copiedIndex.value = index;
  setTimeout(() => {
    copiedIndex.value = null;
  }, 2000);
};

const sendWhatsAppConfirmation = (bankName) => {
  const text = encodeURIComponent(`Halo Ria & Iskandar, saya ingin mengonfirmasi pengiriman tanda kasih pernikahan via ${bankName}. Semoga berkah dan bahagia selalu!`);
  window.open(`https://wa.me/628123456789?text=${text}`, '_blank');
};
</script>

<template>
  <section id="gift" class="attari-gift-section">
    <div class="gift-header">
      <span class="sub-tag">WEDDING GIFT</span>
      <h2 class="title-heading">Tanda Kasih Digital</h2>
      <p class="desc-text">
        Doa restu Anda adalah hadiah terindah bagi kami. Namun apabila Anda berkenan memberikan tanda kasih, dapat melalui rekening digital di bawah ini:
      </p>
    </div>

    <!-- Bank Cards -->
    <div class="bank-list">
      <div v-for="(acc, idx) in bankAccounts" :key="idx" class="bank-card">
        <div class="bank-head">
          <span class="bank-name">{{ acc.bank }}</span>
          <Gift :size="16" class="gift-icon" />
        </div>
        <div class="bank-details">
          <p class="acc-name">{{ acc.name }}</p>
          <div class="acc-row">
            <span class="acc-num">{{ acc.number }}</span>
            <button class="btn-copy" @click="copyAccount(acc.number, idx)">
              <component :is="copiedIndex === idx ? Check : Copy" :size="12" />
              <span>{{ copiedIndex === idx ? 'Disalin' : 'Salin' }}</span>
            </button>
          </div>
        </div>
        <button class="btn-wa" @click="sendWhatsAppConfirmation(acc.bank)">
          Konfirmasi via WhatsApp
        </button>
      </div>
    </div>

    <!-- Closing Section Background Persis ByAttari -->
    <div class="closing-box">
      <span class="closing-cursive font-script">Warmest Regards</span>
      <h3 class="closing-title">THANK YOU</h3>
      <p class="closing-desc">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan restu bagi lembaran baru kehidupan kami.
      </p>
      <div class="closing-names">
        <span class="bride-txt">Ria</span>
        <span class="amp-txt font-script">&amp;</span>
        <span class="groom-txt">Iskandar</span>
      </div>
      <p class="hashtag-tag">#RiaIskandarForever</p>
    </div>
  </section>
</template>

<style scoped>
.attari-gift-section {
  padding: 50px 20px 40px;
  background-color: #0b0d0c;
  color: #ffffff;
}

.gift-header {
  text-align: center;
  margin-bottom: 30px;
}

.sub-tag {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: #d8c29d;
  display: block;
  margin-bottom: 6px;
}

.title-heading {
  font-family: 'newyork', Georgia, serif;
  font-size: 40px;
  color: #ffffff;
  font-weight: 400;
}

.desc-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.bank-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 45px;
}

.bank-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 22px;
}

.bank-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bank-name {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #ffffff;
}

.gift-icon {
  color: #d8c29d;
}

.acc-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.acc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 14px;
}

.acc-num {
  font-family: monospace;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  color: #0b0d0c;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.btn-wa {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-wa:hover {
  background: #ffffff;
  color: #0b0d0c;
}

/* Closing */
.closing-box {
  background: url("https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-MLN00894.webp") center center no-repeat;
  background-size: cover;
  border-radius: 12px;
  padding: 50px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.closing-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(11, 13, 12, 0.82);
}

.closing-box > * {
  position: relative;
  z-index: 2;
}

.closing-cursive {
  font-size: 24px;
  color: #d8c29d;
  display: block;
  margin-bottom: 4px;
}

.closing-title {
  font-family: 'newyork', Georgia, serif;
  font-size: 32px;
  color: #ffffff;
  letter-spacing: 2px;
  font-weight: 400;
  margin-bottom: 14px;
}

.closing-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto 24px;
}

.closing-names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.bride-txt, .groom-txt {
  font-family: 'newyork', Georgia, serif;
  font-size: 32px;
  color: #ffffff;
}

.amp-txt {
  font-size: 24px;
  color: #d8c29d;
}

.hashtag-tag {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: #d8c29d;
  margin-top: 10px;
}
</style>
