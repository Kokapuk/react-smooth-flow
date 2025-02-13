import { MutableStyleProperty } from './types';

export const computedStylePropertiesToCapture: Readonly<MutableStyleProperty[]> = [
  'opacity',
  'backgroundColor',
  'color',
  'boxShadow',
  'backdropFilter',

  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderTopLeftRadius',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',

  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
  'borderLeftStyle',
];

export const computedStylePropertiesToAnimate: Readonly<MutableStyleProperty[]> = [
  'backgroundColor',
  'boxShadow',

  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderTopLeftRadius',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',

  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
];