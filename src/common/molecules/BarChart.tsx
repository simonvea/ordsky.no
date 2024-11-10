import React, { useRef, useEffect } from 'react';
import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  BarElement,
} from 'chart.js';
import styled from 'styled-components';
import { Container } from '../atoms/Container';

export type BarChartProps = {
  labels: string[];
  data: number[];
  backgroundColors: string[];
  borderColors?: string[];
  title?: string;
};

const BarChartContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: 550px;
`;

Chart.register(BarController, LinearScale, CategoryScale, BarElement);
Chart.defaults.color = 'white';

export const BarChart: React.FC<BarChartProps> = function BarChart({
  labels,
  data,
  backgroundColors,
  title,
}) {
   
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let chart: Chart;
    if (ctx) {
      chart = new Chart(ctx, {
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
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
    return () => chart.destroy();
  }, [canvas, data, labels, title, backgroundColors]);
  return (
    <Container>
      <BarChartContainer>
        <canvas aria-label="bar chart" ref={canvas}>
          <p>
            For å kunne vise stolpediagram så må du bruke en browser som støtter
            HTML5.
          </p>
        </canvas>
      </BarChartContainer>
    </Container>
  );
};
