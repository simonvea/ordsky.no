import styled from 'styled-components';

export const ContentArticle = styled.article`
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    width: 100%;
    max-width: 780px;
    margin: 1rem 0;
    text-rendering: optimizeLegibility;
    color: var(--text-color-primary);
    font-weight: 300;
  }
`;
