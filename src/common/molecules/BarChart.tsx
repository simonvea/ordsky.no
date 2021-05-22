import React, { useRef, useLayoutEffect } from 'react';
import Chart from 'chart.js';
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

export const BarChart: React.FC<BarChartProps> = function BarChart({
  labels,
  data,
  backgroundColors,
  title,
}) {
  // eslint-disable-next-line unicorn/no-null
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
