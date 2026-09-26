import styled from 'styled-components';

// export const Input = styled.input`
//   display: block;
//   margin-top: 0.2rem;
// `;

export type InputProps = {
  $warning?: boolean;
  $small?: boolean;
};

export const Input = styled.input<InputProps>`
  display: block;
  margin: 5px 15px;
  border: 2px solid
    ${(props) => (props.$warning ? 'red' : 'var(--primary-color-light)')};
  border-radius: 4px;
  padding: 7px;
  min-height: 44px;
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

  ::focus {
    border: 2px solid var(--primary-color-dark);
  }

  @media only screen and (min-width: 768px) {
    width: ${(props) => (props.$small ? '70px' : '200px')};
  }
`;
