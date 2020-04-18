import React from 'react';
import './Charts.css';
import { BarChart } from './BarChart';
import { useCloudContext } from '../context/cloud/cloudContext.hook';

export const Charts: React.FC = function Charts() {
  const {
    state: { cloud, wordCount },
  } = useCloudContext();

  const NUMBER_OF_WORDS = 10;
  const title = `Top ${NUMBER_OF_WORDS} ord`;

  if (cloud && wordCount) {
    const top10Words = cloud.slice(0, NUMBER_OF_WORDS - 1);
    const top10Count = wordCount
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, NUMBER_OF_WORDS - 1);

    const labels = top10Count.map(
      (word) => word.text[0] + word.text.slice(1).toLowerCase()
    );
    const data = top10Count.map((word) => word.count);
    const backgroundColors = top10Words.map((word) => word.fill);

    return (
      <section className="chart">
        <h2 className="chart__title">{title}</h2>
        <BarChart
          labels={labels}
          data={data}
          backgroundColors={backgroundColors}
        />
      </section>
    );
  }

  return <div />;
};
