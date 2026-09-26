import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createCloudFromWordCount } from '../common/core/wordCountToCloudInput';
import { createCloudSvg } from '../common/core/createCloud';
import { WordCount } from '../common/core/cloud.types';

const SAMPLE_WORDS: WordCount = [
  { text: 'ordsky', count: 12 },
  { text: 'tekst', count: 9 },
  { text: 'ord', count: 8 },
  { text: 'presentasjon', count: 6 },
  { text: 'størrelse', count: 5 },
  { text: 'frekvens', count: 4 },
  { text: 'skole', count: 4 },
  { text: 'møte', count: 3 },
  { text: 'idé', count: 3 },
  { text: 'samarbeid', count: 3 },
  { text: 'poster', count: 2 },
  { text: 'workshop', count: 2 },
  { text: 'gratis', count: 2 },
  { text: 'enkel', count: 1 },
];

const Frame = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 300px;
  margin: 1rem auto 0;
`;

export const SampleCloud: React.FC = function SampleCloud() {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    createCloudFromWordCount(SAMPLE_WORDS)
      .then((cloud) => setSvg(createCloudSvg(cloud, { upscale: true })))
      // The sample is decorative, so a failed layout just leaves it out.
      .catch(() => setSvg(''));
  }, []);

  return <Frame aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
};
