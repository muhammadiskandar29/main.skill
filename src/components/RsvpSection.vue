<script setup>
import { ref } from 'vue';
import { Send, CheckCircle2, MessageSquareHeart } from 'lucide-vue-next';
import confetti from 'canvas-confetti';

const props = defineProps({
  guestName: {
    type: String,
    default: ''
  }
});

const rsvpName = ref(props.guestName || '');
const attendance = ref('Hadir');
const guestCount = ref('1');
const wishMessage = ref('');
const isSubmitting = ref(false);
const submitted = ref(false);

const wishesList = ref([
  {
    name: "Alvaro & Nadya",
    status: "Hadir",
    time: "2 jam yang lalu",
    msg: "Selamat Ria dan Iskandar! Semoga menjadi keluarga yang sakinah mawaddah warahmah, dilancarkan sampai hari H nanti. Barakallah!"
  },
  {
    name: "Dimas Anggara",
    status: "Hadir",
    time: "5 jam yang lalu",
    msg: "Congrats bro Iskandar & Ria! Akhirnya berlabuh ke pelaminan. See you on the big day!"
  },
  {
    name: "Sarah Amanda",
    status: "Tidak Hadir",
    time: "1 hari yang lalu",
    msg: "Happy wedding Ria & Iskandar! Mohon maaf belum bisa hadir langsung karena masih dinas, doa terbaik untuk kalian berdua ya!"
  }
]);

const submitRsvp = () => {
  if (!rsvpName.value || !wishMessage.value) return;
  isSubmitting.value = true;

  setTimeout(() => {
    wishesList.value.unshift({
      name: rsvpName.value,
      status: attendance.value,
      time: "Baru saja",
      msg: wishMessage.value
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    submitted.value = true;
    isSubmitting.value = false;
    wishMessage.value = '';
  }, 600);
};
</script>

<template>
  <section id="rsvp" class="attari-rsvp-section">
    <div class="rsvp-header">
      <span class="sub-tag">RSVP &amp; WISHES</span>
      <h2 class="title-heading">Ucapan &amp; Doa Restu</h2>
      <p class="desc-text">Kehadiran dan doa restu Anda merupakan kehormatan terbesar bagi kami.</p>
    </div>

    <!-- RSVP Form -->
    <div class="form-container">
      <form @submit.prevent="submitRsvp" class="form-body">
        <div class="form-group">
          <label>Nama</label>
          <input 
            type="text" 
            v-model="rsvpName" 
            placeholder="Nama Lengkap" 
            required 
            class="attari-input" 
          />
        </div>

        <div class="form-group">
          <label>Konfirmasi Kehadiran</label>
          <div class="btn-toggle-row">
            <button 
              type="button" 
              class="toggle-btn" 
              :class="{ active: attendance === 'Hadir' }"
              @click="attendance = 'Hadir'"
            >
              Hadir
            </button>
            <button 
              type="button" 
              class="toggle-btn" 
              :class="{ active: attendance === 'Tidak Hadir' }"
              @click="attendance = 'Tidak Hadir'"
            >
              Tidak Hadir
            </button>
          </div>
        </div>

        <div v-if="attendance === 'Hadir'" class="form-group">
          <label>Jumlah Kehadiran</label>
          <select v-model="guestCount" class="attari-input">
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
          </select>
        </div>

        <div class="form-group">
          <label>Ucapan &amp; Doa</label>
          <textarea 
            v-model="wishMessage" 
            rows="3" 
            placeholder="Tuliskan ucapan dan doa Anda..."
            required 
            class="attari-input"
          ></textarea>
        </div>

        <button type="submit" class="btn-attari-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'MENGIRIM...' : 'KIRIM UCAPAN' }}
        </button>

        <div v-if="submitted" class="success-alert">
          <CheckCircle2 :size="16" />
          <span>Terima kasih! Pesan Anda telah terkirim.</span>
        </div>
      </form>
    </div>

    <!-- Wishes Stream -->
    <div class="wishes-wrapper">
      <div class="stream-title-row">
        <MessageSquareHeart :size="16" class="stream-icon" />
        <span>Ucapan Doa ({{ wishesList.length }})</span>
      </div>

      <div class="stream-box">
        <div v-for="(wish, i) in wishesList" :key="i" class="stream-item">
          <div class="item-head">
            <span class="user-name">{{ wish.name }}</span>
            <span class="status-tag" :class="wish.status === 'Hadir' ? 'tag-attend' : 'tag-absent'">
              {{ wish.status }}
            </span>
          </div>
          <p class="user-text">{{ wish.msg }}</p>
          <span class="user-time">{{ wish.time }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attari-rsvp-section {
  padding: 50px 20px;
  background-color: #0b0d0c;
  color: #ffffff;
}

.rsvp-header {
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
}

.form-container {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 24px 20px;
  margin-bottom: 36px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.attari-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s;
}

.attari-input:focus {
  border-color: #ffffff;
}

.btn-toggle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.toggle-btn {
  padding: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #ffffff;
  color: #0b0d0c;
  border-color: #ffffff;
  font-weight: 600;
}

.btn-attari-submit {
  width: 100%;
  padding: 12px;
  background: #ffffff;
  color: #0b0d0c;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-attari-submit:hover {
  opacity: 0.9;
}

.success-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(43, 122, 72, 0.2);
  border: 1px solid rgba(43, 122, 72, 0.4);
  color: #72e09b;
  border-radius: 6px;
  font-size: 12px;
}

/* Stream */
.stream-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  letter-spacing: 1px;
  color: #d8c29d;
  margin-bottom: 16px;
}

.stream-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
}

.stream-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px 16px;
}

.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.user-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
}

.status-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.tag-attend {
  background: rgba(43, 122, 72, 0.3);
  color: #8ce3a8;
}

.tag-absent {
  background: rgba(214, 69, 69, 0.3);
  color: #f7a1a1;
}

.user-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 6px;
}

.user-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
