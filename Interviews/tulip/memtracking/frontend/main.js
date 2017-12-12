function hideEl(id) {
  document.getElementById(id).style.display = 'none';
}

function showEl(id) {
  document.getElementById(id).style.display = '';
}

function fetchAndRenderData() {
  hideEl('statusLoaded');
  showEl('statusLoading');

  MemtrackingDataLoader.fetchData(function(err, result) {
    showEl('statusLoaded');
    hideEl('statusLoading');

    if (err) {
      console.error(err);
      return;
    }

    MemtrackingChartRenderer.renderChart(result.points);
    MemtrackingTableRenderer.renderTable(result.stats);
  });
}


// On page load, do an initial fetch-and-render
fetchAndRenderData();

// Bind event handlers for any filter changing
document.querySelectorAll('#filters input').forEach(function(el) {
  el.addEventListener('change', function() {
    fetchAndRenderData();
  });
});
