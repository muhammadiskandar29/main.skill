<script setup>
import { computed } from 'vue';
import { Home, Users, Calendar, Image as GalleryIcon, Gift, MessageSquareHeart } from 'lucide-vue-next';

defineProps({
  activeNav: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['navigate']);

const navItems = [
  { id: 'cover', label: 'Home', icon: Home },
  { id: 'couple', label: 'Mempelai', icon: Users },
  { id: 'event', label: 'Acara', icon: Calendar },
  { id: 'gallery', label: 'Galeri', icon: GalleryIcon },
  { id: 'rsvp', label: 'RSVP', icon: MessageSquareHeart },
  { id: 'gift', label: 'Gift', icon: Gift }
];

const scrollTo = (id) => {
  emit('navigate', id);
  if (id === 'cover') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <nav class="bottom-nav">
    <button 
      v-for="item in navItems" 
      :key="item.id" 
      class="nav-tab" 
      :class="{ active: activeNav === item.id }"
      @click="scrollTo(item.id)"
    >
      <component :is="item.icon" :size="18" />
      <span class="tab-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 440px;
  background: rgba(30, 37, 33, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 12px;
  z-index: 900;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.nav-tab {
  background: transparent;
  border: none;
  color: #a7b3ac;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: 4px 6px;
  transition: all 0.25s ease;
  outline: none;
}

.tab-label {
  font-size: 0.62rem;
  letter-spacing: 0.5px;
}

.nav-tab.active, .nav-tab:hover {
  color: #c5a880;
  transform: translateY(-2px);
}
</style>
