import React, { useState, useRef, useEffect, use } from 'react';
import { Link, useLocation } from 'react-router';
import styled from 'styled-components';
import { NavButton } from '../atoms/NavButton';

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  height: 70px;
  line-height: 70px;
  color: var(--text-color-primary);
  text-decoration: none;

  a {
    color: var(--text-color-primary);
    text-decoration: none;
  }
`;

const Header = styled.header`
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.24);
  box-shadow: 2px 3px 3px 2px rgba(0, 0, 0, 0.4);
  padding: 1rem 2rem;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  min-width: 100%;
  position: relative;
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (min-width: 769px) {
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    background-color: #121212;
    width: 256px;
    padding: 100px 0 56px 0;
    transition: right 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $isOpen }) =>
      $isOpen
        ? '0px 8px 10px -5px rgba(0,0,0,0.5), 0px 16px 24px 2px rgba(0,0,0,0.4), 0px 6px 30px 5px rgba(0,0,0,0.3)'
        : 'none'};
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color-primary);
  font-size: 1.2rem;
  margin: 0 5px;

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    text-align: right;
    padding: 0 2rem;
    height: 48px;
    line-height: 48px;
    font-size: 2rem;
    letter-spacing: 0.25px;
    color: rgba(255, 255, 255, 0.87);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;

  @media (max-width: 768px) {
    display: block;
  }
  z-index: 1001;
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

const ActionContainer = styled.section`
  @media (min-width: 769px) {
    margin-left: 1rem;
  }

  @media (max-width: 768px) {
    margin-top: auto;
  }
`;

const NavRoutes = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
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

  return (
    <Header>
      <Title>
        <Link to="/">Ordsky.no</Link>
      </Title>
      <HamburgerButton
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <HamburgerIcon $isOpen={isMenuOpen} />
      </HamburgerButton>
      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <Nav ref={navRef} $isOpen={isMenuOpen}>
        <NavRoutes>
          <NavLink to="/">Hjem</NavLink>
          <NavLink to="/contact">Kontakt</NavLink>
          <NavLink to="/about">Om</NavLink>
        </NavRoutes>
        <ActionContainer>
          <NavButton to="/create">Lag en ordsky</NavButton>
        </ActionContainer>
      </Nav>
    </Header>
  );
}
