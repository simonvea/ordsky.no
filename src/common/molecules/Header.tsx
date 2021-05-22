import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Title: React.FC = styled.h1`
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

const Header: React.FC = styled.header`
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

const Nav: React.FC = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
`;

const NavButton = styled(Link)`
  background-color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  margin: 0 5px;

  ::hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    opacity: 1;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color-primary);
  font-size: 1.2rem;
  margin: 0 5px;
`;

export const OrdskyHeader: React.FC = () => {
  return (
    <Header>
      <Title>
        <Link to="/">Ordsky.no</Link>
      </Title>
      <Nav>
        <NavButton to="/words" role="button">
          Ny Ordsky
        </NavButton>
        <NavButton to="/collab" role="button">
          Lag en felles ordsky
        </NavButton>
        <NavLink to="/about">Om Ordsky.no</NavLink>
      </Nav>
    </Header>
  );
};
