import styled from 'styled-components';
import { Link } from 'react-router';

export type ButtonProps = {
  $outline?: boolean;
  $small?: boolean;
};

export const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$outline ? 'transparent' : 'var(--secondary-color)'};
  border: none;
  border-radius: 4px;
  color: white;
  padding: ${(props) => (props.$small ? '8px 16px' : '15px 32px')};
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  margin: 5px;

  &:hover {
    box-shadow:
      0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    opacity: 1;
    background-color: var(--button-hover-bg);
    ${(props) =>
      props.$outline ? 'background-color: var(--secondary-color-dark);' : ''}
  }

  &:focus {
    outline: var(--button-focus-outline);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:active {
    border: none;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: var(--secondary-color-dark);
`;

export const IconButton = styled(Button)`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

export const LinkButton = styled(Link)<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$outline ? 'transparent' : 'var(--secondary-color)'};
  border: none;
  border-radius: 4px;
  color: white;
  padding: ${(props) => (props.$small ? '8px 16px' : '15px 32px')};
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  margin: 5px;

  &:hover {
    box-shadow:
      0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    opacity: 1;
    background-color: var(--button-hover-bg);
    ${(props) =>
      props.$outline ? 'background-color: var(--secondary-color-dark);' : ''}
  }

  &:focus {
    outline: var(--button-focus-outline);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:active {
    border: none;
  }
`;
