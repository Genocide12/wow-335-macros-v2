// Shared asynchronous source of truth used by both Talent Viewer and Hero demo.
window.TALENTS_READY = window.TALENTS_READY || fetch('assets/data/talents.json')
  .then(response => {
    if (!response.ok) throw new Error(`Talent data request failed (${response.status})`);
    return response.json();
  })
  .then(data => {
    if (!data || !Array.isArray(data.trees) || data.trees.length !== 3) {
      throw new Error('Invalid talent data schema');
    }
    window.TALENTS = data;
    return data;
  });
