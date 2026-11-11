// Shared async loader for all site pages that need the talent tree data.
window.TALENTS_READY = window.TALENTS_READY || fetch('assets/data/talents.json')
  .then(response => {
    if (!response.ok) throw new Error(`Talent data request failed: ${response.status}`);
    return response.json();
  })
  .then(data => {
    if (!data || !Array.isArray(data.trees) || data.trees.length !== 3) {
      throw new Error('Talent data has an invalid schema');
    }
    window.TALENTS = data;
    return data;
  });
