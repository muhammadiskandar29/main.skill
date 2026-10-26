<script setup>
import { computed } from 'vue';

defineProps({
  dresscode: {
    type: Object,
    required: true
  },
  liveStream: {
    type: Object,
    required: true
  },
  loveStory: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <section class="attari-story-dress-section">
    <!-- Love Story -->
    <div class="story-wrapper">
      <span class="sub-tag">JOURNEY OF LOVE</span>
      <h2 class="title-heading">Our Love Story</h2>
      <p class="quote-text font-serif">“Step by step, hand in hand, for all of our days”</p>

      <div class="timeline-container">
        <div v-for="(story, idx) in loveStory" :key="idx" class="timeline-row">
          <div class="dot-line">
            <div class="dot"></div>
          </div>
          <div class="timeline-content">
            <span class="t-date">{{ story.date }}</span>
            <h4 class="t-title">{{ story.title }}</h4>
            <p class="t-desc">{{ story.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dresscode Notice -->
    <div class="dresscode-banner">
      <span class="dc-tag">DRESS CODE</span>
      <h3 class="dc-title">{{ dresscode.note }}</h3>
      <p class="dc-desc">{{ dresscode.description }}</p>
      
      <div class="color-palette">
        <div 
          v-for="(c, i) in dresscode.colors" 
          :key="i" 
          class="color-dot" 
          :style="{ backgroundColor: c }"
        ></div>
      </div>
    </div>

    <!-- Live Wedding -->
    <div class="livestream-box">
      <span class="live-pill">LIVE WEDDING</span>
      <h3 class="live-heading">{{ liveStream.title }}</h3>
      <p class="live-time">{{ liveStream.date }} ({{ liveStream.time }})</p>
      <p class="live-desc">{{ liveStream.desc }}</p>
      <a :href="liveStream.link" target="_blank" rel="noopener" class="btn-live">
        JOIN LIVE STREAM
      </a>
    </div>
  </section>
</template>

<style scoped>
.attari-story-dress-section {
  padding: 50px 20px;
  background-color: #0b0d0c;
  color: #ffffff;
}

.story-wrapper {
  text-align: center;
  margin-bottom: 50px;
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

.quote-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin: 8px 0 36px;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  padding-left: 10px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 20px;
  left: 16px;
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.timeline-row {
  display: flex;
  gap: 20px;
  margin-bottom: 26px;
  position: relative;
}

.dot-line {
  position: relative;
  z-index: 2;
  margin-top: 4px;
}

.dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #0b0d0c;
  border: 2px solid #d8c29d;
}

.timeline-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px 18px;
}

.t-date {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #d8c29d;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

.t-title {
  font-family: 'newyork', Georgia, serif;
  font-size: 20px;
  color: #ffffff;
  margin: 4px 0 6px;
  font-weight: 400;
}

.t-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

/* Dresscode */
.dresscode-banner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 36px;
}

.dc-tag {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 2.5px;
  color: #d8c29d;
  font-weight: 600;
}

.dc-title {
  font-family: 'newyork', Georgia, serif;
  font-size: 22px;
  color: #ffffff;
  margin: 6px 0 10px;
  font-weight: 400;
}

.dc-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  max-width: 320px;
  margin: 0 auto 18px;
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Livestream */
.livestream-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
}

.live-pill {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 4px 12px;
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 12px;
  font-weight: 600;
}

.live-heading {
  font-family: 'newyork', Georgia, serif;
  font-size: 24px;
  color: #ffffff;
  font-weight: 400;
  margin-bottom: 6px;
}

.live-time {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #d8c29d;
  margin-bottom: 12px;
}

.live-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-live {
  display: block;
  width: 100%;
  padding: 12px;
  background: #ffffff;
  color: #0b0d0c;
  border-radius: 6px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-live:hover {
  opacity: 0.9;
}
</style>
