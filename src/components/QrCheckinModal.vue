<script setup>
import { ref, onMounted, watch } from 'vue';
import QRCode from 'qrcode';
import { X, Download, ShieldCheck } from 'lucide-vue-next';

const props = defineProps({
  guestName: {
    type: String,
    default: 'Tamu Undangan'
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const qrCanvas = ref(null);

const generateCode = () => {
  if (!qrCanvas.value) return;
  const payload = JSON.stringify({
    event: "The Wedding of Ria & Iskandar",
    date: "Akad: 8 Jan | Resepsi: 10 Jan",
    venue: "Jakarta",
    guest: props.guestName,
    seat: "VIP Guest",
    code: "RI-" + Math.abs(props.guestName.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase()
  });

  QRCode.toCanvas(qrCanvas.value, payload, {
    width: 200,
    margin: 2,
    color: {
      dark: '#242e27',
      light: '#ffffff'
    }
  });
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(generateCode, 100);
  }
});

onMounted(() => {
  if (props.show) generateCode();
});
</script>

<template>
  <div v-if="show" class="qr-modal-backdrop" @click="emit('close')">
    <div class="qr-card-container" @click.stop>
      <!-- Close button -->
      <button class="close-icon-btn" @click="emit('close')">
        <X :size="20" />
      </button>

      <div class="card-ticket-top">
        <span class="badge-ticket">ENTRANCE ACCESS PASS</span>
        <h3 class="ticket-brand">The Wedding of Ria &amp; Iskandar</h3>
        <p class="ticket-date">8 &amp; 10 Januari</p>
      </div>

      <div class="ticket-notch-row">
        <div class="notch left"></div>
        <div class="dashed-line"></div>
        <div class="notch right"></div>
      </div>

      <div class="ticket-body">
        <div class="guest-info">
          <span class="info-label">KEPADA YTH.</span>
          <h4 class="guest-title">{{ guestName }}</h4>
          <span class="guest-badge">REGULER GUEST • SESI 1</span>
        </div>

        <div class="canvas-wrap">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>

        <p class="scan-instruction">
          Silakan tunjukkan QR Code ini kepada penerima tamu / scanner di lokasi Palma One Grand Ballroom.
        </p>

        <div class="ticket-footer">
          <div class="security-tag">
            <ShieldCheck :size="15" />
            <span>Official Digital Pass</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 20, 17, 0.82);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qr-card-container {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  animation: pulseSoft 0.3s ease;
}

.close-icon-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
  z-index: 10;
}

.card-ticket-top {
  background: #242e27;
  color: #fff;
  padding: 28px 20px 20px;
  text-align: center;
}

.badge-ticket {
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: #c5a880;
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}

.ticket-brand {
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.ticket-date {
  font-size: 0.75rem;
  color: #aebdb4;
  margin-top: 4px;
}

.ticket-notch-row {
  display: flex;
  align-items: center;
  position: relative;
  height: 20px;
  background: #ffffff;
  margin-top: -10px;
}

.notch {
  width: 20px;
  height: 20px;
  background: rgba(15, 20, 17, 0.82);
  border-radius: 50%;
  position: absolute;
}

.notch.left {
  left: -10px;
}

.notch.right {
  right: -10px;
}

.dashed-line {
  flex: 1;
  border-bottom: 2px dashed #d5dbd7;
  margin: 0 15px;
}

.ticket-body {
  padding: 10px 24px 24px;
  text-align: center;
}

.guest-info {
  margin-bottom: 16px;
}

.info-label {
  font-size: 0.65rem;
  letter-spacing: 1.5px;
  color: #89724f;
  font-weight: 600;
}

.guest-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2521;
  margin: 2px 0 6px;
}

.guest-badge {
  font-size: 0.65rem;
  background: #f0ebe1;
  color: #635036;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.canvas-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.qr-canvas {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.scan-instruction {
  font-size: 0.72rem;
  color: #67716a;
  line-height: 1.45;
  margin-bottom: 16px;
}

.ticket-footer {
  display: flex;
  justify-content: center;
}

.security-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #2b7a48;
  font-weight: 600;
}
</style>
