import React from 'react';
import { Link } from 'react-router';
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
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
`;

const NavLink = styled(Link)`
  color: var(--text-color-primary);
  font-size: 1.2rem;
  margin: 0 5px;
`;

export function OrdskyHeader(): React.ReactElement {
  return (
    <Header>
      <Title>
        <Link to="/">Ordsky.no</Link>
      </Title>
      <Nav>
        <NavButton to="/words" $small>
          Ny Ordsky
        </NavButton>
        <NavButton to="/collab" $small>
          Lag en felles ordsky
        </NavButton>
        <NavLink to="/about">Om Ordsky.no</NavLink>
      </Nav>
    </Header>
  );
}
