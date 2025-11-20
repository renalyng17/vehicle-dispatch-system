// src/hooks/useTimeAgo.js
import { useState, useEffect } from 'react';

const getTimeAgo = (dateString) => {
  if (!dateString) return "—";
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 0) return "Just now";

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
  return Math.max(1, Math.floor(seconds)) + " second" + (seconds === 1 ? "" : "s") + " ago";
};

export function useTimeAgo(dateString) {
  const [timeAgo, setTimeAgo] = useState(() => getTimeAgo(dateString));

  useEffect(() => {
    setTimeAgo(getTimeAgo(dateString));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(dateString));
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [dateString]);

  return timeAgo;
}