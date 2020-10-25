import styled from 'styled-components';

export type ButtonProps = {
  outline?: boolean;
  small?: boolean;
};

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.outline ? 'transparent' : 'var(--secondary-color)'};
  border: none;
  border-radius: 4px;
  color: white;
  padding: ${(props) => (props.small ? '8px 16px' : '15px 32px')};
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  margin: 5px;

  &:hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    opacity: 1;
    ${(props) =>
      props.outline ? 'background-color: var(--secondary-color-dark);' : ''}
  }

  &::disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::active,
  &::focus {
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
