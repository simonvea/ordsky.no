import styled from 'styled-components';
import { Link } from 'react-router';
import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export const BackContainer = styled.section`
  margin-top: 4rem;
  display: flex;
  justify-content: center;

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.08);
    }
  }
`;

export const BackButton = (): ReactElement => (
  <BackContainer>
    <Link to="/">
      <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '0.6rem' }} />
      Til fremsiden
    </Link>
  </BackContainer>
);
