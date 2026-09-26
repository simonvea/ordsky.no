import styled from 'styled-components';

export const Textarea = styled.textarea`
  display: block;
  height: 40vh;
  min-height: 200px;
  width: 100%;
  max-width: 640px;
  border: 1px solid var(--outline);
  border-radius: 4px;
  padding: 12px 16px;
  background-color: var(--field-bg);
  color: var(--text-color-primary);
  line-height: 1.5;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:hover {
    border-color: var(--text-color-primary);
  }

  /* Material 3 outlined field: the border thickens instead of a separate ring. */
  &:focus {
    outline: none;
    border-color: var(--primary-color-light);
    box-shadow: inset 0 0 0 1px var(--primary-color-light);
  }

  // 16px stops iOS Safari from zooming the page on focus.
  font-size: 16px;
  font-family: 'Proza Libre', sans-serif;
`;
