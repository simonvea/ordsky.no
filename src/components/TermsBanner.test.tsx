import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TermsBanner } from './TermsBanner';

describe('TermsBanner component', () => {
  it('when mounted, renders a link to find out more', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TermsBanner onClose={() => {}} />
      </MemoryRouter>
    );

    const linkElement = getByText(/finn ut mer/i);
    expect(linkElement).toBeInTheDocument();
  });
});
