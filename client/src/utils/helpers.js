export const formatDuration = (duration) => {
  if (!duration) return '00:00';
  
  const seconds = typeof duration === 'string' 
    ? parseDuration(duration) 
    : duration;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (match) {
    if (match[1]) hours = parseInt(match[1].slice(0, -1));
    if (match[2]) minutes = parseInt(match[2].slice(0, -1));
    if (match[3]) seconds = parseInt(match[3].slice(0, -1));
  }

  return hours * 3600 + minutes * 60 + seconds;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
