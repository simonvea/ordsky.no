import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { downloadAsPng } from '../core/downloadAsPng';
import { downloadAsSvg } from '../core/downloadAsSvg';
import { Button } from '../atoms/Button';
import { logger } from '../core/analytics';
import { BarChart } from '../molecules/BarChart';
import { WordCount, Cloud } from '../core/cloud.types';
import { createCloudSvg } from '../core/createCloud';
import { Column } from '../atoms/Column';
import { SupportCallout } from '../molecules/SupportCallout';
import { useCallToAction } from '../hooks/useCallToAction';
import { ShareLink } from '../molecules/ShareLink';
import randomColor from 'randomcolor';
import { BackgroundChoice } from '../molecules/BackgroundChoice';
import {
  CloudBackground,
  backgroundFill,
  loadCloudBackground,
  saveCloudBackground,
} from '../core/cloudBackground';
import { cloudFontFaceCss } from '../core/cloudFontFaceCss';
import { SerializeOptions } from '../core/serializeSvg';

export type CloudDisplayProps = {
  cloud: Cloud[];
  wordCount?: WordCount;
  onRestart: () => void;
  restartText: string;
  shouldDisplayCallToAction: boolean;
  shareable?: boolean;
};

const CloudContainer = styled.figure<{ $background: CloudBackground }>`
  aspect-ratio: 5 / 3;
  width: 100%;
  /* Keeps the download buttons above the fold on short screens. */
  max-width: calc(60vh * 5 / 3);
  max-width: calc(60dvh * 5 / 3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 1rem;
  /* Previews the background the download will get. */
  background-color: ${(props) =>
    backgroundFill[props.$background] ?? 'var(--surface-container)'};
  border: 1px solid var(--outline-variant);
  transition: background-color 0.15s;
  border-radius: 16px;

  svg {
    max-width: 100%;
    max-height: 100%;
  }
`;

const CloudImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0 0.75rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 1.375rem;
  font-weight: 500;
  margin: 3rem 0 1rem;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
`;

const logDownloadError = (error: unknown): void =>
  logger.logError({ description: String(error), fatal: false });

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
  const [background, setBackground] =
    useState<CloudBackground>(loadCloudBackground);

  const changeBackground = (next: CloudBackground): void => {
    setBackground(next);
    saveCloudBackground(next);
  };

  const downloadOptions = async (): Promise<SerializeOptions> => ({
    background: backgroundFill[background],
    fontFaceCss: await cloudFontFaceCss(),
  });

  useEffect(() => {
    incrementCloudCount();

    if (svgElement.current) {
      const SVG = createCloudSvg(cloud, { upscale: true });
      svgElement.current.innerHTML = SVG;
    }
  }, [cloud]);

  const downloadPng = (): void => {
    const svg = svgElement.current?.querySelector('svg');
    if (!svg) return;

    logger.logEvent('download_cloud');
    downloadOptions()
      .then((options) => downloadAsPng(svg, options))
      .catch(logDownloadError);
  };

  const downloadSvg = (): void => {
    const svg = svgElement.current?.querySelector('svg');
    if (!svg) return;

    logger.logEvent('download_cloud_svg');
    downloadOptions()
      .then((options) => downloadAsSvg(svg, options))
      .catch(logDownloadError);
  };

  const title = 'Mest brukte ord';

  const data = wordCount?.map((word) => word.count);

  const labels = wordCount?.map((word) => capitalize(word.text));

  const fillByWord = getFillColorsByWord(cloud);

  const backgroundColors = wordCount?.map(
    (word) => fillByWord[word.text] || randomColor(),
  );

  const imageTitle = 'Ordsky';
  const imageDescription =
    'En ordsky som viser de mest brukte ordene i teksten';

  return (
    <MainContainer>
      <CloudContainer
        ref={svgElement}
        role="img"
        aria-label={imageDescription}
        $background={background}
      ></CloudContainer>
      <BackgroundChoice value={background} onChange={changeBackground} />
      <Actions>
        <Button type="button" onClick={downloadPng}>
          Last ned som PNG
        </Button>
        <Button type="button" $variant="tonal" onClick={downloadSvg}>
          Last ned som SVG
        </Button>
        <Button type="button" $variant="outlined" onClick={onRestart}>
          {restartText}
        </Button>
      </Actions>
      {shareable && <ShareLink />}
      {shouldDisplayCallToAction && <SupportCallout />}
      {data && (
        <>
          <Title>{title}</Title>
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
