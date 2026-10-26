<script setup>
import { ref } from 'vue';
import { Volume2, VolumeX, Music } from '@lucide/vue';

const isPlaying = ref(false);
const audioRef = ref(null);

// Audio background royalty-free wedding acoustic / lofi
const audioSrc = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3";

const toggleMusic = () => {
  if (!audioRef.value) return;
  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    audioRef.value.play().then(() => {
      isPlaying.value = true;
    }).catch(err => {
      console.log('Audio autoplay prevented:', err);
    });
  }
};

const playMusic = () => {
  if (!audioRef.value) return;
  audioRef.value.play().then(() => {
    isPlaying.value = true;
  }).catch(err => {
    console.log('Auto play error:', err);
  });
};

defineExpose({
  playMusic
});
</script>

<template>
  <div class="music-controller">
    <audio ref="audioRef" :src="audioSrc" loop preload="auto"></audio>

    <button 
      class="music-disc-btn" 
      :class="{ 'is-rotating': isPlaying }"
      @click="toggleMusic"
      title="Musik Latar"
    >
      <div class="disc-inner">
        <component :is="isPlaying ? Volume2 : VolumeX" :size="16" />
      </div>
    </button>
  </div>
</template>

<style scoped>
.music-controller {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 1100;
}

.music-disc-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(36, 46, 39, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(197, 168, 128, 0.5);
  color: #c5a880;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
  outline: none;
}

.music-disc-btn:hover {
  transform: scale(1.08);
}

.music-disc-btn.is-rotating {
  animation: discSpin 4s linear infinite;
}

@keyframes discSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.disc-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
