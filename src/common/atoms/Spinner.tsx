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
  border: 5px solid var(--primary-color);
  border-top: 5px solid var(--primary-color-dark);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: ${spin} 2s linear infinite;
`;
