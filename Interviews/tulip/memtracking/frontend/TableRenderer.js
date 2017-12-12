window.MemtrackingTableRenderer = (function() {
  function renderStat(spanId, value) {
    document.getElementById(spanId).innerText = value;
  }

  function bytesToMb(bytes) {
    let mb = bytes/ (1000**2)
    return mb.toFixed(2) + "MB";
  }

  function renderTable(stats) {
    renderStat('statTotalReadings', stats.totalReadings);
    renderStat('statNumCrashes', stats.totalCrashes);
    renderStat('statAvgMem', bytesToMb(stats.averageMemory));
    renderStat('statAvgCrashMem', bytesToMb(stats.averageMemoryAtCrash));
  }

  return {
    renderTable: renderTable,
  }
})();
