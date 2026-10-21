export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * Strictly limited flat palette. No gradients anywhere: depth and light are
 * faked with solid geometric overlays only.
 */
export const COLORS = {
  black: '#000000',
  night: '#05070F',
  navy: '#0B1226',
  navyLight: '#16224A',
  wall: '#02030A',
  ground: '#04060D',
  white: '#FFFFFF',
  offWhite: '#EDEDED',
  paper: '#F7F4EC',
  grey: '#5A5A5A',
  greyDark: '#1E1E1E',
  yellow: '#FFD700',
  red: '#CC0000',
  redBright: '#FF2A2A',
  blue: '#2E7DFF',
  blueSoft: '#7FB2FF',
  orange: '#FF8A00',
  purple: '#4B3F72',
  beige: '#D9CBB0',
  brown: '#6B4226',
  green: '#39FF14',
} as const;

export const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
export const MONO = '"Courier New", "Roboto Mono", Menlo, monospace';
