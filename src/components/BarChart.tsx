import React, { useRef, useLayoutEffect } from 'react';
import Chart from 'chart.js';
import './BarChart.css';

export type BarChartProps = {
  labels: string[];
  data: number[];
  backgroundColors: string[];
  borderColors?: string[];
  title?: string;
};

export const BarChart: React.FC<BarChartProps> = function BarChart({
  labels,
  data,
  backgroundColors,
  title,
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  Chart.defaults.global.defaultFontColor = 'white';
  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
  }, [canvas, data, labels, title, backgroundColors]);
  return (
    <div className="flex-container">
      <div className="chart__container">
        <canvas aria-label="bar chart" ref={canvas}>
          <p>
            For å kunne vise stolpediagram så må du bruke en browser som støtter
            HTML5.
          </p>
        </canvas>
      </div>
    </div>
  );
};
