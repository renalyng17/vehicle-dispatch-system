
// src/hooks/useTimeAgo.js
import { useState, useEffect } from 'react';

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " year" + (interval >= 2 ? "s" : "") + " ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " month" + (interval >= 2 ? "s" : "") + " ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " day" + (interval >= 2 ? "s" : "") + " ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hour" + (interval >= 2 ? "s" : "") + " ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minute" + (interval >= 2 ? "s" : "") + " ago";

  return Math.floor(seconds) + " seconds ago";
}

export function useTimeAgo(date) {
  const [timeAgo, setTimeAgo] = useState(() => getTimeAgo(date));

  useEffect(() => {
    setTimeAgo(getTimeAgo(date));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(date));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
}