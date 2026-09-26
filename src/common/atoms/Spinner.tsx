import styled, { keyframes } from 'styled-components';

const spin = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

export const Spinner = styled.span`
  display: inline-block;
  flex-shrink: 0;
  border: 4px solid var(--outline-variant);
  border-top-color: var(--primary-color-light);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: ${spin} 1s linear infinite;
`;
