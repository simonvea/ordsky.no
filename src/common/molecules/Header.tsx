import React, { useState, useRef, useEffect, use } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import styled from 'styled-components';
import { NavButton } from '../atoms/Button';

const Logo = styled(Link)`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  line-height: 1;
  color: var(--text-color-primary);
  text-decoration: none;
  white-space: nowrap;
`;

const Header = styled.header`
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
  padding: 0 1rem 0 1.5rem;
  min-width: 100%;
  position: relative;

  @media (min-width: 769px) {
    padding: 0 2rem;
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    height: 100vh;
    height: 100dvh;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    background-color: var(--surface-container);
    width: min(320px, 85vw);
    padding: 88px 12px 32px;
    border-radius: 16px 0 0 16px;
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      visibility 0.25s;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? '0 8px 24px rgba(0, 0, 0, 0.5)' : 'none'};
    z-index: 1000;
  }
`;

const NavItem = styled(NavLink)`
  color: var(--on-surface-variant);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0.25rem;
  border-bottom: 2px solid transparent;

  &:hover {
    color: var(--text-color-primary);
  }

  &.active {
    color: var(--text-color-primary);
    border-bottom-color: var(--primary-color-text);
  }

  &:focus-visible {
    outline: var(--button-focus-outline);
    outline-offset: 2px;
  }

  /* Material 3 navigation drawer item with a pill active indicator. */
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 24px;
    border: none;
    border-radius: 28px;
    font-size: 1.125rem;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    &.active {
      background-color: var(--tonal-container);
      color: var(--on-tonal-container);
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: var(--button-focus-outline);
  }

  @media (max-width: 768px) {
    display: inline-flex;
  }
`;

const HamburgerIcon = styled.div<{ $isOpen: boolean }>`
  width: 25px;
  height: 2px;
  background: var(--text-color-primary);
  position: relative;
  transition: all 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0)')};

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 2px;
    background: var(--text-color-primary);
    transition: all 0.3s;
  }

  &::before {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotate(90deg)' : 'translateY(-8px)'};
  }

  &::after {
    opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
    transform: translateY(8px);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
  }
`;

const ActionContainer = styled.div`
  @media (max-width: 768px) {
    margin-top: auto;
    padding: 0 12px;

    > a {
      width: 100%;
    }
  }
`;

const NavRoutes = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
`;

export function OrdskyHeader(): React.ReactElement {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      if (
        isMenuOpen &&
        navRef.current &&
        buttonRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMenuOpen);
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  return (
    <Header>
      <Logo to="/">Ordsky.no</Logo>
      <HamburgerButton
        ref={buttonRef}
        type="button"
        aria-label={isMenuOpen ? 'Lukk meny' : 'Åpne meny'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <HamburgerIcon $isOpen={isMenuOpen} />
      </HamburgerButton>
      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <Nav ref={navRef} $isOpen={isMenuOpen}>
        <NavRoutes>
          <NavItem to="/" end>
            Hjem
          </NavItem>
          <NavItem to="/contact">Kontakt</NavItem>
          <NavItem to="/about">Om</NavItem>
        </NavRoutes>
        <ActionContainer>
          <NavButton to="/create">Lag en ordsky</NavButton>
        </ActionContainer>
      </Nav>
    </Header>
  );
}
