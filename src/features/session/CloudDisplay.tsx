import React from 'react';
import styled from 'styled-components';
import { svgDataURL, downloadAsPng } from '../../utils/downloadAsPng';
import { createCloud } from '../../utils/cloud/createCloud';
import { Cloud } from '../../utils/cloud/cloud.types';
import { Button, SecondaryButton } from '../../components/atoms/Button';
import { Container } from '../../components/atoms/Container';
import { Row } from '../../components/atoms/Row';

import { analytics } from '../../firebase';

export type CloudDisplayProps = {
  cloud: Cloud[];
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

export const CloudDisplay: React.FC<CloudDisplayProps> = function WordCloud({
  cloud,
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
          Bli med i en ny session
        </Button>
      </Row>
    </Container>
  );
};
