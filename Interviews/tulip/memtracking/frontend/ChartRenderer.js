window.MemtrackingChartRenderer = (function() {
  function browserSupportsWebGl() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");

    return (gl && gl instanceof WebGLRenderingContext);
  }

  function getColor(str) {
    let map = {
      "/processes": "orange",
      "/processes/editor": "purple",
      "/data": "green",
      "/analytics": "navy", 
      "/player": "aquamarine"
    };
    if (map[str]) return map[str];
    return 'black';
  }

  function formatData(points) {
    const x = [];
    const y = [];
    const colors = [];

    points.forEach(function(point) {
      x.push(new Date(point.time));
      y.push(point.memory);
      // console.log(point.page);
      colors.push(point.didCrash ? 'red' : getColor(point.page));
    });

    return {
      x: x,
      y: y,
      colors: colors,
    }
  }

  function renderChart(points) {
    const data = formatData(points);
    const series = {
      type: browserSupportsWebGl() ? 'scattergl' : 'scatter',
      x: data.x,
      y: data.y,
      mode: 'markers',
      marker: {
        color: data.colors,
      },
    };

    const layout = {
      title: 'Plot of memory data',
      xaxis: {
        title: 'Time',
      },
      yaxis: {
        title: 'Memory Usage (bytes)',
        ticksuffix: 'B'
      },
    }

    Plotly.newPlot('scatterPlot', [series], layout);
  }

  return {
    renderChart: renderChart,
  }
})();

