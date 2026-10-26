<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-vue-next';

const props = defineProps({
  eventDate: {
    type: Date,
    required: true
  },
  events: {
    type: Array,
    required: true
  }
});

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval = null;

const calculateCountdown = () => {
  const target = new Date(props.eventDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff > 0) {
    timeLeft.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

const addToGoogleCalendar = () => {
  const title = encodeURIComponent("The Wedding of Ria & Iskandar");
  const details = encodeURIComponent("Pernikahan Ria & Iskandar. Akad: 8 Januari, Resepsi: 10 Januari.");
  const location = encodeURIComponent("Jakarta");
  const start = "20270108T010000Z";
  const end = "20270110T070000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, '_blank');
};

onMounted(() => {
  calculateCountdown();
  timerInterval = setInterval(calculateCountdown, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <section id="event" class="attari-event-section">
    <!-- Header Section -->
    <div class="event-header">
      <p class="tag-label">SAVE THE DATE</p>
      <h2 class="title-heading">Wedding Schedule</h2>
      <p class="sub-date">Akad: 8 Januari &amp; Resepsi: 10 Januari</p>
    </div>

    <!-- Countdown Timer -->
    <div class="timer-grid">
      <div class="timer-box">
        <span class="t-val">{{ timeLeft.days }}</span>
        <span class="t-lbl">Days</span>
      </div>
      <div class="timer-box">
        <span class="t-val">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
        <span class="t-lbl">Hours</span>
      </div>
      <div class="timer-box">
        <span class="t-val">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
        <span class="t-lbl">Mins</span>
      </div>
      <div class="timer-box">
        <span class="t-val">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
        <span class="t-lbl">Secs</span>
      </div>
    </div>

    <!-- Add To Calendar Button -->
    <div class="action-wrap">
      <button class="btn-attari-action" @click="addToGoogleCalendar">
        ADD TO CALENDAR
      </button>
    </div>

    <!-- Event Cards -->
    <div class="event-cards-list">
      <div v-for="ev in events" :key="ev.id" class="attari-card">
        <span class="badge-status">{{ ev.statusNote }}</span>
        <h3 class="event-title">{{ ev.title }}</h3>
        <p class="event-subtitle font-script">{{ ev.subtitle }}</p>

        <div class="card-meta">
          <div class="meta-item">
            <Calendar :size="15" class="icon" />
            <span>{{ ev.date }}</span>
          </div>
          <div class="meta-item">
            <Clock :size="15" class="icon" />
            <span>{{ ev.time }}</span>
          </div>
          <div class="meta-item">
            <MapPin :size="15" class="icon" />
            <div>
              <strong>{{ ev.location }}</strong>
              <p class="addr">{{ ev.address }}</p>
            </div>
          </div>
        </div>

        <a :href="ev.mapsUrl" target="_blank" rel="noopener" class="btn-maps">
          <span>OPEN MAPS</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.attari-event-section {
  padding: 60px 20px 50px;
  background-color: #0b0d0c;
  color: #ffffff;
}

.event-header {
  text-align: center;
  margin-bottom: 30px;
}

.tag-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: #d8c29d;
  font-weight: 500;
  margin-bottom: 6px;
}

.title-heading {
  font-family: 'newyork', 'Cormorant Garamond', Georgia, serif;
  font-size: 40px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.1;
}

.sub-date {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6px;
}

/* Countdown */
.timer-grid {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.timer-box {
  width: 68px;
  height: 68px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.t-val {
  font-family: 'newyork', Georgia, serif;
  font-size: 26px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1;
}

.t-lbl {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.action-wrap {
  text-align: center;
  margin-bottom: 40px;
}

.btn-attari-action {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  padding: 10px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-attari-action:hover {
  background: #ffffff;
  color: #0b0d0c;
}

/* Cards */
.event-cards-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.attari-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 30px 22px;
  text-align: center;
}

.badge-status {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #d8c29d;
  display: inline-block;
  margin-bottom: 8px;
}

.event-title {
  font-family: 'newyork', Georgia, serif;
  font-size: 24px;
  color: #ffffff;
  font-weight: 400;
}

.event-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.card-meta {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.icon {
  color: #d8c29d;
  margin-top: 3px;
  flex-shrink: 0;
}

.addr {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.btn-maps {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.25s;
}

.btn-maps:hover {
  background: #ffffff;
  color: #0b0d0c;
}
</style>
