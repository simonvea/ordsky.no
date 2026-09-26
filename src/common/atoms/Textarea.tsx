import styled from 'styled-components';

export const Textarea = styled.textarea`
  height: 40vh;
  width: 100%;
  max-width: 350px;
  border: 2px solid var(--primary-color-light);
  border-radius: 4px;
  padding: 7px;
  background-color: var(--field-bg);
  color: var(--text-color-primary);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  // 16px stops iOS Safari from zooming the page on focus.
  font-size: 16px;
  -webkit-transition-duration: 0.2s; /* Safari */
  transition-duration: 0.2s;
  font-family: 'Proza Libre', sans-serif;
`;
