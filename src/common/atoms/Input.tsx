import styled from 'styled-components';

export type InputProps = {
  $warning?: boolean;
  $small?: boolean;
};

export const Input = styled.input<InputProps>`
  display: block;
  margin: 5px 15px;
  border: 1px solid
    ${(props) => (props.$warning ? 'var(--error-color)' : 'var(--outline)')};
  border-radius: 4px;
  padding: 8px 12px;
  min-height: 48px;
  background-color: var(--field-bg);
  color: var(--text-color-primary);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  // 16px stops iOS Safari from zooming the page on focus.
  font-size: 16px;
  width: ${(props) => (props.$small ? '70px' : '150px')};
  -webkit-transition-duration: 0.2s; /* Safari */
  transition-duration: 0.2s;
  font-family: 'Proza Libre', sans-serif;

  &:hover {
    border-color: ${(props) =>
      props.$warning ? 'var(--error-color)' : 'var(--text-color-primary)'};
  }

  /* Material 3 outlined field: the border thickens instead of a separate ring. */
  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$warning ? 'var(--error-color)' : 'var(--primary-color-light)'};
    box-shadow: inset 0 0 0 1px
      ${(props) =>
        props.$warning ? 'var(--error-color)' : 'var(--primary-color-light)'};
  }

  @media only screen and (min-width: 768px) {
    width: ${(props) => (props.$small ? '70px' : '200px')};
  }
`;
