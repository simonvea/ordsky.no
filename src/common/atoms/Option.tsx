import styled from 'styled-components';

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 1000px;
`;

export const Option = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--surface-container);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--outline-variant);

  p {
    line-height: 1.6;
    margin: 0 0 1rem;
    color: var(--on-surface-variant);
  }

  /* Pushes the action to the bottom so buttons line up across cards. */
  > :last-child {
    margin-top: auto;
  }
`;

export const OptionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
`;
