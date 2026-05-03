import { Box, Grid } from "@mui/material";
import Chart from "chart.js/auto";
import { useEffect } from "react";
import { bubbleConfig, donutConfig, pieConfig, polarAreaConfig, radarConfig, scatterConfig, barLineConfig } from "./data";

// components
import { ComponentContainerCard, PageBreadcrumb } from "@src/components";
const OtherChartjs = () => {
  useEffect(() => {
    const bubbleTag = document.getElementById("bubble-example");
    const bubbleChart = new Chart(bubbleTag, bubbleConfig);
    const donutTag = document.getElementById("donut-example");
    const donutChart = new Chart(donutTag, donutConfig);
    const pieTag = document.getElementById("pie-example");
    const pieChart = new Chart(pieTag, pieConfig);
    const polarAreaTag = document.getElementById("polar-area-example");
    const polarAreaChart = new Chart(polarAreaTag, polarAreaConfig);
    const radarTag = document.getElementById("radar-example");
    const radarChart = new Chart(radarTag, radarConfig);
    const scatterTag = document.getElementById("scatter-example");
    const scatterChart = new Chart(scatterTag, scatterConfig);
    const barLineTag = document.getElementById("bar-line-example");
    const barLine = new Chart(barLineTag, barLineConfig);
    return () => {
      bubbleChart.destroy();
      donutChart.destroy();
      pieChart.destroy();
      polarAreaChart.destroy();
      radarChart.destroy();
      scatterChart.destroy();
      barLine.destroy();
    };
  });
  return <>
      <PageBreadcrumb title="Chartjs" subName="Charts" />

      <Grid container spacing={3}>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Bubble">
            <Box height={"320px"} width={"100%"}>
              <canvas id="bubble-example" data-colors="#3e60d5,#47ad77"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Donut">
            <Box height={"320px"} width={"100%"}>
              <canvas id="donut-example" data-colors="#3e60d5,#fa5c7c,#47ad77,#ebeff2"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Pie">
            <Box height={"320px"} width={"100%"}>
              <canvas id="pie-example" data-colors="#3e60d5,#fa5c7c,#47ad77,#ebeff2, #f56f36"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Polar Area">
            <Box height={"320px"} width={"100%"}>
              <canvas id="polar-area-example" data-colors="#3e60d5,#fa5c7c,#47ad77,#ebeff2, #f56f36"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Radar">
            <Box height={"320px"} width={"100%"}>
              <canvas id="radar-example" data-colors="#3e60d5,#47ad77"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Scatter">
            <Box height={"320px"} width={"100%"}>
              <canvas id="scatter-example" data-colors="#3e60d5,#47ad77"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
        <Grid item xl={6} xs={12}>
          <ComponentContainerCard title="Stacked Bar/Line">
            <Box height={"320px"} width={"100%"}>
              <canvas id="bar-line-example" data-colors="#3e60d5,#47ad77"></canvas>
            </Box>
          </ComponentContainerCard>
        </Grid>
      </Grid>
    </>;
};
export default OtherChartjs;