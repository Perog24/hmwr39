import React from 'react';
import { render, screen } from '@testing-library/react';
import RootApp from './RootApp';

test('renders learn react link', () => {
  render(<RootApp />);
  const linkElement = screen.getByText('');
  expect(linkElement).toBeInTheDocument();
});
