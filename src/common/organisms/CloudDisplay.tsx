import React from 'react';
import styled from 'styled-components';
import { svgDataURL, downloadAsPng } from '../core/downloadAsPng';
import { Button, SecondaryButton } from '../atoms/Button';
import { Row } from '../atoms/Row';

import { analytics } from '../../firebase';
import { BarChart } from '../molecules/BarChart';
import { WordCount, Cloud } from '../core/cloud.types';
import { createCloudSvg } from '../core/createCloud';
import { Column } from '../atoms/Column';

export type CloudDisplayProps = {
  cloud: Cloud[];
  wordCount?: WordCount;
  onRestart: () => void;
  restartText: string;
};

const CloudContainer = styled.section`
  height: 510px;
  width: 510px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloudImage = styled.img`
  margin: auto;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 1rem 0 2rem;
`;

export const CloudDisplay: React.FC<CloudDisplayProps> = function WordCloud({
  cloud,
  wordCount,
  onRestart,
  restartText,
}) {
  const svg = createCloudSvg(cloud); // This is probably what should be saved?
  const xml = svgDataURL(svg); // Or this?
  const download = (): void => {
    // For some reason logEvent is typed to accept a specific event...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analytics.logEvent('download_cloud' as any);
    downloadAsPng(xml);
  };

  const NUMBER_OF_WORDS = 10;
  const title = `Top ${NUMBER_OF_WORDS} ord`;

  const labels = cloud.map(
    (word) => word.text[0] + word.text.slice(1).toLowerCase()
  );
  const data = wordCount?.map((word) => word.count);
  const backgroundColors = cloud.map((word) => word.fill);

  return (
    <Column>
      <CloudContainer>
        <CloudImage src={xml} alt="ordsky" />
      </CloudContainer>
      <Row>
        <SecondaryButton type="button" onClick={download}>
          Last ned ordsky
        </SecondaryButton>
        <Button type="button" onClick={onRestart}>
          {restartText}
        </Button>
      </Row>
      {data && (
        <>
          <Title> {title}</Title>
          <BarChart
            data={data}
            labels={labels}
            backgroundColors={backgroundColors}
          />
        </>
      )}
    </Column>
  );
};
