import styled from 'styled-components';

export const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
`;

export const Option = styled.section<{ disabled?: boolean }>`
  position: relative;
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  filter: ${(props) => (props.disabled ? 'grayscale(20%)' : 'none')};

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #e0e0e0;

    &:last-of-type {
      flex-grow: 1;
    }
  }

  strong {
    color: #ffffff;
    font-size: 1.25rem;
    display: block;
    margin-bottom: 1.5rem;
    text-align: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #3a3a3a;
  }
`;
