function shouldBlockNow(schedule) {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const { start, end } = schedule[day] || { start: "00:00", end: "00:00" };
    return currentTime >= start && currentTime < end;
  }
  
  function isAllowedPath(pathname) {
    return (
      pathname.startsWith("/account") ||
      pathname.startsWith("/watch") ||
      pathname.startsWith("/feed") ||
      pathname.startsWith("/results")
    );
  }
  
  function checkAndRedirect(schedule) {
    if (shouldBlockNow(schedule)) {
      const isYouTube = location.hostname === "www.youtube.com";
      const disallowed = !isAllowedPath(location.pathname);
      if (isYouTube && disallowed) {
        window.location.href = "https://www.youtube.com/feed/subscriptions";
      }
    }
  }
  
  
  chrome.storage.sync.get("schedule", (data) => {
    const schedule = data.schedule || {};
  
    // Run on initial page load
    checkAndRedirect(schedule);
  
    // Also monitor navigation changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        checkAndRedirect(schedule);
      }
    }).observe(document, { subtree: true, childList: true });
  });
  