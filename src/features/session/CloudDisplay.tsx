import React from 'react';
import styled from 'styled-components';
import { svgDataURL, downloadAsPng } from '../../utils/downloadAsPng';
import { createCloud } from '../../utils/cloud/createCloud';
import { Cloud } from '../../utils/cloud/cloud.types';
import { Button, SecondaryButton } from '../../components/atoms/Button';
import { Container } from '../../components/atoms/Container';
import { Row } from '../../components/atoms/Row';

import { analytics } from '../../firebase';
import { BarChart } from '../../components/BarChart';
import { WordCount } from '../../utils/countWords';

export type CloudDisplayProps = {
  cloud: Cloud[];
  wordCount: WordCount;
  onRestart: () => void;
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
}) {
  const svg = createCloud(cloud); // This is probably what should be saved?
  const xml = svgDataURL(svg); // Or this?
  const download = (): void => {
    // For some reason logEvent is typed to accept a specific event...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analytics.logEvent('download_cloud' as any);
    downloadAsPng(xml);
  };

  const NUMBER_OF_WORDS = 10;
  const title = `Top ${NUMBER_OF_WORDS} ord`;

  const top10Words = cloud.slice(0, NUMBER_OF_WORDS - 1);
  const top10Count = wordCount.slice(0, NUMBER_OF_WORDS - 1);

  const labels = top10Count.map(
    (word) => word.text[0] + word.text.slice(1).toLowerCase()
  );
  const data = top10Count.map((word) => word.count);
  const backgroundColors = top10Words.map((word) => word.fill);

  return (
    <Container>
      <CloudContainer>
        <CloudImage src={xml} alt="ordsky" />
      </CloudContainer>
      <Row>
        <SecondaryButton type="button" onClick={download}>
          Last ned ordsky
        </SecondaryButton>
        <Button type="button" onClick={onRestart}>
          Bli med i en ny økt
        </Button>
      </Row>
      <Row>
        <Container>
          <Title> {title}</Title>
          <BarChart
            data={data}
            labels={labels}
            backgroundColors={backgroundColors}
          />
        </Container>
      </Row>
    </Container>
  );
};
