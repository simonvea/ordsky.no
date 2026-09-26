import styled, { css } from 'styled-components';
import { Link, NavLink } from 'react-router';

// Material 3 button emphasis levels, highest to lowest.
export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

export type ButtonProps = {
  $variant?: ButtonVariant;
  $small?: boolean;
};

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  filled: css`
    background-color: var(--secondary-color);
    color: #fff;
  `,
  tonal: css`
    background-color: var(--tonal-container);
    color: var(--on-tonal-container);
  `,
  outlined: css`
    background-color: transparent;
    color: var(--primary-color-text);
    border-color: var(--outline);
  `,
  text: css`
    background-color: transparent;
    color: var(--primary-color-text);
    padding-left: 12px;
    padding-right: 12px;
  `,
};

const disabledContainer: Record<ButtonVariant, string> = {
  filled: 'background-color: rgba(255, 255, 255, 0.12);',
  tonal: 'background-color: rgba(255, 255, 255, 0.12);',
  outlined: 'border-color: rgba(255, 255, 255, 0.12);',
  text: '',
};

const buttonStyles = css<ButtonProps>`
  display: inline-flex;
  flex-shrink: 0;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: ${(props) => (props.$small ? '6px 16px' : '10px 24px')};
  min-height: ${(props) => (props.$small ? '40px' : '48px')};
  margin: 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1px;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
  ${(props) => variantStyles[props.$variant ?? 'filled']}

  /* State layer: a translucent overlay in the label colour, as in Material 3. */
  &:hover:not(:disabled) {
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.08)
    );
  }

  &:active:not(:disabled) {
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.14),
      rgba(255, 255, 255, 0.14)
    );
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--button-focus-outline);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.38);
    ${(props) => disabledContainer[props.$variant ?? 'filled']}
  }
`;

export const Button = styled.button<ButtonProps>`
  ${buttonStyles}
`;

export const LinkButton = styled(Link)<ButtonProps>`
  ${buttonStyles}
`;

export const NavButton = styled(NavLink)<ButtonProps>`
  ${buttonStyles}
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--on-surface-variant);
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--text-color-primary);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--button-focus-outline);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.38;
  }
`;
