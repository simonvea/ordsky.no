import styled from 'styled-components';
import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LinkButton } from './Button';

export const BackContainer = styled.nav`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
`;

export const BackButton = (): ReactElement => (
  <BackContainer>
    <LinkButton to="/" $variant="text">
      <FontAwesomeIcon icon={faChevronLeft} />
      Til forsiden
    </LinkButton>
  </BackContainer>
);
