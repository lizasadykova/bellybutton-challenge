document.addEventListener("DOMContentLoaded", function () {
    // D3.js and app.js
});

// Reading the data from the JSON using D3
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initialize Dashboard
function init() {
  const dropdownMenu = d3.select("#selDataset");

  // Use D3 to get sample names for selection
  d3.json(url).then(({ names, samples }) => {
    // Add samples to the menu
    names.forEach((id) => dropdownMenu.append("option").text(id).property("value", id));

    // Initialize first sample
    const firstSample = names[0];

    // Building initial plots
    buildBar(firstSample, samples);
    buildBubble(firstSample, samples);
    buildMetaData(firstSample, samples);
  });
}

// Func to build Bar Chart
function buildBar(sample, samples) {
  const data = samples.find(s => s.id === sample);
  const trace = {
    x: data.sample_values.slice(0, 10).reverse(),
    y: data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: data.otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  };
  const layout = { title: "Top 10 OTUs in a Sample" };

  Plotly.newPlot("bar", [trace], layout);
}

// Func to build Bubble Chart
function buildBubble(sample, samples) {
  const data = samples.find(s => s.id === sample);
  const trace = {
    x: data.otu_ids,
    y: data.sample_values,
    mode: "markers",
    marker: {
      size: data.sample_values,
      color: data.otu_ids,
      colorscale: "Viridis"
    },
    text: data.otu_labels
  };
  const layout = {
    title: "Bacteria by Sample",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Size by Sample" }
  };

  Plotly.newPlot("bubble", [trace], layout);
}

// Func for the metadata
function buildMetaData(sample, samples) {
  const metadata = samples.find(s => s.id === sample).metadata;
  d3.select("#sample-metadata").html("");

  // metadata info display
  for (const key in metadata) {
    d3.select("#sample-metadata").append("p").text(`${key}: ${metadata[key]}`);
  }
}

// when the dropdown changes
function optionChanged(newSample) {
  d3.json(url).then(({ samples }) => {
    buildBar(newSample, samples);
    buildBubble(newSample, samples);
    buildMetaData(newSample, samples);
  });
}

// Call initialization
init();
