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
  max-width: 510px;
  width: 100%;
  height: 100%;
  aspect-ratio: 5/3;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  svg {
    width: 100%;
    height: 100%;
    viewbox: 0 0 500 300;
    preserveaspectratio: xMidYMid meet;
  }
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

  const svgElement = useRef<SVGSVGElement>(null);

  useEffect(() => {
    incrementCloudCount();
  }, [cloud]);

  const SVG = createCloudSvg(cloud);
  svgElement.current?.append(SVG);

  const download = (): void => {
    logger.logEvent('download_cloud');
    const xml = svgDataURL(SVG);
    downloadAsPng(xml);
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
    <Column>
      <CloudContainer>
        <svg ref={svgElement} role="img" aria-label={imageDescription}>
          <title>{imageTitle}</title>
          <desc>{imageDescription}</desc>
        </svg>
      </CloudContainer>
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
    </Column>
  );
};

function getFillColorsByWord(cloud: Cloud[]): Record<string, string> {
  const fillByWord = {} as Record<string, string>;

  for (const word of cloud) {
    fillByWord[word.text] = word.fill;
  }
  return fillByWord;
}
