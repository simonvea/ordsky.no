import styled from 'styled-components';

export const Main = styled.main`
  padding: 3rem 20px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: calc(100vh - 80px - 80px);
  /* iOS Safari's 100vh includes the collapsing toolbar. */
  min-height: calc(100dvh - 80px - 80px);
`;
