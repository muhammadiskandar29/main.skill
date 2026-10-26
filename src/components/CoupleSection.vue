<script setup>
import { computed } from 'vue';

defineProps({
  quote: {
    type: Object,
    required: true
  },
  bride: {
    type: Object,
    required: true
  },
  groom: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section id="couple" class="attari-couple-section">
    <!-- Verse Box (Ar-Rum 21) -->
    <div class="verse-box">
      <p class="verse-label">{{ quote.verse }}</p>
      <p class="verse-arabic">{{ quote.arabic }}</p>
      <p class="verse-translation">"{{ quote.translation }}"</p>
      <div class="thin-separator"></div>
    </div>

    <!-- Opening Text -->
    <div class="greeting-area">
      <p class="salam-title">ASSALAMU’ALAIKUM WR. WB.</p>
      <p class="salam-desc">
        Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
      </p>
    </div>

    <!-- The Bride -->
    <div class="profile-block">
      <!-- Foto Prewed Pengantin Wanita dari Template Asli ByAttari -->
      <div class="photo-container">
        <div class="photo-frame bride-frame">
          <div class="photo-overlay"></div>
        </div>
      </div>

      <div class="profile-info">
        <span class="role-title">THE BRIDE</span>
        <h2 class="name-display">{{ bride.callName }}</h2>
        <div class="name-separator"></div>
        <p class="parents-meta">{{ bride.parents }}</p>
      </div>
    </div>

    <!-- Connector Ampersand -->
    <div class="ampersand-divider">
      <span class="amp-symbol">&amp;</span>
    </div>

    <!-- The Groom -->
    <div class="profile-block">
      <!-- Foto Prewed Pengantin Pria dari Template Asli ByAttari -->
      <div class="photo-container">
        <div class="photo-frame groom-frame">
          <div class="photo-overlay"></div>
        </div>
      </div>

      <div class="profile-info">
        <span class="role-title">THE GROOM</span>
        <h2 class="name-display">{{ groom.callName }}</h2>
        <div class="name-separator"></div>
        <p class="parents-meta">{{ groom.parents }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attari-couple-section {
  padding: 60px 24px 50px;
  background-color: #0b0d0c;
  color: #ffffff;
  position: relative;
}

/* Verse */
.verse-box {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 10px;
}

.verse-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: #d8c29d;
  margin-bottom: 14px;
}

.verse-arabic {
  font-size: 18px;
  line-height: 2.2;
  color: #f1ede6;
  margin-bottom: 16px;
  font-family: serif;
  direction: rtl;
}

.verse-translation {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
  max-width: 380px;
  margin: 0 auto 20px;
}

.thin-separator {
  width: 50px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
}

/* Salam */
.greeting-area {
  text-align: center;
  margin-bottom: 45px;
}

.salam-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #ffffff;
  margin-bottom: 8px;
}

.salam-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 360px;
  margin: 0 auto;
}

/* Profile Block */
.profile-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.photo-container {
  width: 200px;
  height: 280px;
  border-radius: 120px 120px 10px 10px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 24px;
  position: relative;
}

.photo-frame {
  width: 100%;
  height: 100%;
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  filter: grayscale(100%) contrast(105%);
}

.bride-frame {
  background-image: url("https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-profil-MLN00771-copy-scaled.webp");
}

.groom-frame {
  background-image: url("https://byattari.com/wp-content/uploads/2026/07/UW-26JUN-290-Putri-Firly-profil-MLN00846-copy-scaled.webp");
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(11, 13, 12, 0.8) 100%);
}

.role-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ffffff;
  display: block;
  margin-bottom: 4px;
}

.name-display {
  font-family: 'newyork', 'Cormorant Garamond', Georgia, serif;
  font-size: 42px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 10px;
}

.name-separator {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 auto 12px;
}

.parents-meta {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto;
}

.ampersand-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 36px 0;
}

.amp-symbol {
  font-family: 'newyork', Georgia, serif;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
