window.MemtrackingDataLoader = (function() {

  const BACKEND = 'http://localhost:3265';

  // Given a datetime-local input element, returns the value of that input
  // in milliseconds since the UNIX epoch
  function getTimestampFromTimeInput(inputEl) {
    return (new Date(inputEl.value)).getTime()
  }

  // Returns the form data the user has entered into the filtering form
  function getFormData() {
    // Build list of pages to filter to
    const pages =
      Array.from(document.querySelectorAll('.page-filters input[type=checkbox]'))
        .filter(el => el.checked)
        .map(el => el.value);

    // get start/end times
    const startTime = getTimestampFromTimeInput(document.getElementById('filterTimeStart'));
    const endTime = getTimestampFromTimeInput(document.getElementById('filterTimeEnd'));

    return {
      pages: pages,
      startTime: startTime,
      endTime: endTime,
    };
  }

  // Given a path and an object of query parameters, builds the full URL to
  // send a request to
  function buildRequestURL(path, queryParams = {}) {
    const urlParams = new URLSearchParams(Object.entries(queryParams));

    return BACKEND + path + '?' + urlParams;
  }

  // Fetches the crash data from the server, based on current filter settings.
  // Takes a callback that recieves (error, result)
  function fetchData(callback) {
    fetch(buildRequestURL('/data', getFormData()))
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        callback(null, json);
      })
      .catch(function(error) {
        callback(error);
      });
  }

  return {
    fetchData: fetchData,
  }
})();
