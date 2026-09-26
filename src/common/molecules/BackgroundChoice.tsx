import React from 'react';
import styled from 'styled-components';
import { CloudBackground } from '../core/cloudBackground';

const options: Array<{ value: CloudBackground; label: string }> = [
  { value: 'transparent', label: 'Gjennomsiktig' },
  { value: 'white', label: 'Hvit' },
];

const Fieldset = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 1.5rem 0 0;
  padding: 0;
  border: none;
`;

const Legend = styled.legend`
  float: left;
  color: var(--on-surface-variant);
`;

// Material 3 segmented button.
const Segments = styled.div`
  display: inline-flex;
  border: 1px solid var(--outline);
  border-radius: 999px;
  overflow: hidden;
`;

const Segment = styled.label`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-color-primary);

  & + & {
    border-left: 1px solid var(--outline);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  &:has(input:checked) {
    background-color: var(--tonal-container);
    color: var(--on-tonal-container);
  }

  &:has(input:focus-visible) {
    outline: var(--button-focus-outline);
    outline-offset: -4px;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
`;

export type BackgroundChoiceProps = {
  value: CloudBackground;
  onChange: (background: CloudBackground) => void;
};

export const BackgroundChoice = ({
  value,
  onChange,
}: BackgroundChoiceProps): React.JSX.Element => (
  <Fieldset>
    <Legend>Bakgrunn</Legend>
    <Segments>
      {options.map((option) => (
        <Segment key={option.value}>
          <input
            type="radio"
            name="cloud-background"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </Segment>
      ))}
    </Segments>
  </Fieldset>
);
