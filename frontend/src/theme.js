import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'red',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '700',
  },
  colors: {
    red: [
      '#ffe8e8',
      '#ffcfcf',
      '#ff9b9b',
      '#ff6464',
      '#ff3838',
      '#e03131', // Primary red
      '#c92a2a',
      '#a61e1e',
      '#851515',
      '#670d0d',
    ],
  },
  primaryShade: 5,
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Container: {
      defaultProps: {
        size: 'xl',
      },
    },
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '75em',
    xl: '90em',
  },
});
