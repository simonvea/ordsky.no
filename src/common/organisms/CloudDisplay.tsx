import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { svgDataURL, downloadAsPng } from '../core/downloadAsPng';
import { Button, SecondaryButton } from '../atoms/Button';
import { Row } from '../atoms/Row';
import { logger } from '../core/analytics';
import { BarChart } from '../molecules/BarChart';
import { WordCount, Cloud } from '../core/cloud.types';
import { createCloudSvg } from '../core/createCloud';
import { Column } from '../atoms/Column';
import { SupportCallout } from '../molecules/SupportCallout';
import { useCallToAction } from '../hooks/useCallToAction';
import { ShareLink } from '../molecules/ShareLink';
import randomColor from 'randomcolor';

export type CloudDisplayProps = {
  cloud: Cloud[];
  wordCount?: WordCount;
  onRestart: () => void;
  restartText: string;
  shouldDisplayCallToAction: boolean;
  shareable?: boolean;
};

const CloudContainer = styled.section`
  max-width: 80vw;
  max-height: 80vw;
  aspect-ration 5 / 3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const CloudImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 1rem 0 2rem;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 80vw;
`;

const capitalize = (word: string): string =>
  word[0].toUpperCase() + word.slice(1).toLowerCase();

export const CloudDisplay: React.FC<CloudDisplayProps> = function WordCloud({
  cloud,
  wordCount,
  onRestart,
  restartText,
  shouldDisplayCallToAction,
  shareable = false,
}) {
  const { incrementCloudCount } = useCallToAction();

  const svgElement = useRef<HTMLElement>(null);

  useEffect(() => {
    incrementCloudCount();

    if (svgElement.current) {
      const SVG = createCloudSvg(cloud);
      svgElement.current.innerHTML = SVG;
    }
  }, [cloud]);

  const download = (): void => {
    logger.logEvent('download_cloud');
    downloadAsPng(svgElement.current?.firstChild as SVGElement, {});
  };

  const NUMBER_OF_WORDS = 10;
  const title = `Top ${NUMBER_OF_WORDS} ord`;

  const data = wordCount?.map((word) => word.count);

  const labels = wordCount?.map((word) => capitalize(word.text));

  const fillByWord = getFillColorsByWord(cloud);

  const backgroundColors = wordCount?.map(
    (word) => fillByWord[word.text] || randomColor()
  );

  const imageTitle = 'Ordsky';
  const imageDescription =
    'En ordsky som viser de mest brukte ordene i teksten';

  return (
    <MainContainer>
      <CloudContainer ref={svgElement}></CloudContainer>
      {shouldDisplayCallToAction && <SupportCallout />}
      <Row>
        <SecondaryButton type="button" onClick={download}>
          Last ned ordsky
        </SecondaryButton>
        <Button type="button" onClick={onRestart}>
          {restartText}
        </Button>
      </Row>
      {shareable && <ShareLink />}
      {data && (
        <>
          <Title> {title}</Title>
          <BarChart
            data={data}
            labels={labels!}
            backgroundColors={backgroundColors!}
          />
        </>
      )}
    </MainContainer>
  );
};

function getFillColorsByWord(cloud: Cloud[]): Record<string, string> {
  const fillByWord = {} as Record<string, string>;

  for (const word of cloud) {
    fillByWord[word.text] = word.fill;
  }
  return fillByWord;
}
