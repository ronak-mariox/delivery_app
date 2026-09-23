import React from 'react';
import Svg, {Circle, Line, Path, Rect} from 'react-native-svg';

export type IconName =
  | 'bell'
  | 'phone'
  | 'lock'
  | 'message-circle'
  | 'navigation'
  | 'map-pin'
  | 'clock'
  | 'chevron-left'
  | 'check'
  | 'star'
  | 'user'
  | 'headphones'
  | 'credit-card'
  | 'bar-chart'
  | 'arrow-right'
  | 'eye'
  | 'eye-off'
  | 'x'
  | 'alert-triangle'
  | 'package'
  | 'refresh'
  | 'alert-circle'
  | 'info'
  | 'mail'
  | 'shield'
  | 'bicycle'
  | 'user-plus'
  | 'camera'
  | 'image'
  | 'chevron-down'
  | 'file-text'
  | 'upload'
  | 'edit'
  | 'wifi-off'
  | 'arrow-down'
  | 'toggle'
  | 'store'
  | 'copy'
  | 'map'
  | 'turn-left'
  | 'volume-off'
  | 'grid'
  | 'scan'
  | 'send'
  | 'mic-off'
  | 'phone-off'
  | 'volume-2'
  | 'smartphone'
  | 'home'
  | 'map-pin-off'
  | 'plus'
  | 'chevron-right'
  | 'share'
  | 'ban'
  | 'filter'
  | 'wallet'
  | 'megaphone'
  | 'globe'
  | 'help-circle'
  | 'user-x'
  | 'calendar'
  | 'trash'
  | 'download'
  | 'x-circle'
  | 'scooter'
  | 'motorbike'
  | 'truck'
  | 'check-circle'
  | 'folder'
  | 'zoom-in'
  | 'zoom-out'
  | 'search'
  | 'dollar-sign'
  | 'wrench'
  | 'monitor'
  | 'log-out'
  | 'server';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

export function Icon({name, size = 24, color = '#1F2937', strokeWidth = 2, filled = false}: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  switch (name) {
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 2a6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9a6 6 0 0 0-6-6z" {...common} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...common} />
        </Svg>
      );
    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
            {...common}
          />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={11} width={18} height={11} rx={2} {...common} />
          <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...common} />
        </Svg>
      );
    case 'message-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M21 11.5a8.38 8.38 0 0 1-4.8 7.6 8.5 8.5 0 0 1-9.08-.8L3 21l1.9-5.72a8.38 8.38 0 0 1-.8-3.78 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            {...common}
          />
        </Svg>
      );
    case 'navigation':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 11l19-9-9 19-2-8-8-2z" {...common} fill={filled ? color : 'none'} />
        </Svg>
      );
    case 'map-pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...common} />
          <Circle cx={12} cy={10} r={3} {...common} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Path d="M12 6v6l4 2" {...common} />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M15 18l-6-6 6-6" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M20 6L9 17l-5-5" {...common} />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
            {...common}
            fill={filled ? color : 'none'}
          />
        </Svg>
      );
    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={7} r={4} {...common} />
          <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" {...common} />
        </Svg>
      );
    case 'headphones':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 18v-6a9 9 0 0 1 18 0v6" {...common} />
          <Rect x={3} y={15} width={4} height={6} rx={1} {...common} />
          <Rect x={17} y={15} width={4} height={6} rx={1} {...common} />
        </Svg>
      );
    case 'credit-card':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={1} y={4} width={22} height={16} rx={2} {...common} />
          <Line x1={1} y1={10} x2={23} y2={10} {...common} />
        </Svg>
      );
    case 'bar-chart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={18} y1={20} x2={18} y2={10} {...common} />
          <Line x1={12} y1={20} x2={12} y2={4} {...common} />
          <Line x1={6} y1={20} x2={6} y2={14} {...common} />
        </Svg>
      );
    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={5} y1={12} x2={19} y2={12} {...common} />
          <Path d="M12 5l7 7-7 7" {...common} />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...common} />
          <Circle cx={12} cy={12} r={3} {...common} />
        </Svg>
      );
    case 'eye-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.7 19.7 0 0 1 5-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a19.6 19.6 0 0 1-2.16 3.19" {...common} />
          <Line x1={1} y1={1} x2={23} y2={23} {...common} />
        </Svg>
      );
    case 'x':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={18} y1={6} x2={6} y2={18} {...common} />
          <Line x1={6} y1={6} x2={18} y2={18} {...common} />
        </Svg>
      );
    case 'alert-triangle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...common} />
          <Line x1={12} y1={9} x2={12} y2={13} {...common} />
          <Line x1={12} y1={17} x2={12.01} y2={17} {...common} />
        </Svg>
      );
    case 'package':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 8l-9-5-9 5 9 5 9-5z" {...common} />
          <Path d="M3 8v8l9 5 9-5V8" {...common} />
          <Line x1={12} y1={13} x2={12} y2={21} {...common} />
        </Svg>
      );
    case 'refresh':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M23 4v6h-6" {...common} />
          <Path d="M1 20v-6h6" {...common} />
          <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" {...common} />
          <Path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...common} />
        </Svg>
      );
    case 'alert-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Line x1={12} y1={8} x2={12} y2={12} {...common} />
          <Line x1={12} y1={16} x2={12.01} y2={16} {...common} />
        </Svg>
      );
    case 'info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Line x1={12} y1={16} x2={12} y2={12} {...common} />
          <Line x1={12} y1={8} x2={12.01} y2={8} {...common} />
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={2} y={4} width={20} height={16} rx={2} {...common} />
          <Path d="M22 6l-10 7L2 6" {...common} />
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />
        </Svg>
      );
    case 'bicycle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={6} cy={17} r={3} {...common} />
          <Circle cx={18} cy={17} r={3} {...common} />
          <Path d="M6 17L10 8h4l4 9" {...common} />
          <Line x1={10} y1={8} x2={13} y2={8} {...common} />
        </Svg>
      );
    case 'user-plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={10} cy={8} r={4} {...common} />
          <Path d="M3 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 3.5 1.4" {...common} />
          <Line x1={19} y1={8} x2={19} y2={14} {...common} />
          <Line x1={16} y1={11} x2={22} y2={11} {...common} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 9l6 6 6-6" {...common} />
        </Svg>
      );
    case 'wifi-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={1} y1={1} x2={23} y2={23} {...common} />
          <Path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" {...common} />
          <Path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" {...common} />
          <Path d="M10.71 5.05A16 16 0 0 1 22.58 9" {...common} />
          <Path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" {...common} />
          <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" {...common} />
          <Line x1={12} y1={20} x2={12.01} y2={20} {...common} />
        </Svg>
      );
    case 'arrow-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={12} y1={5} x2={12} y2={19} {...common} />
          <Path d="M19 12l-7 7-7-7" {...common} />
        </Svg>
      );
    case 'toggle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={1} y={5} width={22} height={14} rx={7} {...common} />
          <Circle cx={16} cy={12} r={3} {...common} />
        </Svg>
      );
    case 'file-text':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...common} />
          <Path d="M14 2v6h6" {...common} />
          <Line x1={8} y1={13} x2={16} y2={13} {...common} />
          <Line x1={8} y1={17} x2={16} y2={17} {...common} />
        </Svg>
      );
    case 'upload':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...common} />
          <Path d="M17 8l-5-5-5 5" {...common} />
          <Line x1={12} y1={3} x2={12} y2={15} {...common} />
        </Svg>
      );
    case 'edit':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...common} />
          <Path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" {...common} />
        </Svg>
      );
    case 'camera':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...common} />
          <Circle cx={12} cy={13} r={4} {...common} />
        </Svg>
      );
    case 'image':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={3} width={18} height={18} rx={2} {...common} />
          <Circle cx={8.5} cy={8.5} r={1.5} {...common} />
          <Path d="M21 15l-5-5L5 21" {...common} />
        </Svg>
      );
    case 'store':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 9l1-5h16l1 5" {...common} />
          <Path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" {...common} />
          <Path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" {...common} />
          <Path d="M9 21v-6h6v6" {...common} />
        </Svg>
      );
    case 'copy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={9} y={9} width={13} height={13} rx={2} {...common} />
          <Path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" {...common} />
        </Svg>
      );
    case 'map':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 3L3 5.5v15L9 18l6 2.5L21 18V3l-6 2.5L9 3z" {...common} />
          <Line x1={9} y1={3} x2={9} y2={18} {...common} />
          <Line x1={15} y1={5.5} x2={15} y2={20.5} {...common} />
        </Svg>
      );
    case 'turn-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M18 20v-7a4 4 0 0 0-4-4H4" {...common} />
          <Path d="M9 4L4 9l5 5" {...common} />
        </Svg>
      );
    case 'volume-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M11 5L6 9H2v6h4l5 4V5z" {...common} />
          <Line x1={23} y1={9} x2={17} y2={15} {...common} />
          <Line x1={17} y1={9} x2={23} y2={15} {...common} />
        </Svg>
      );
    case 'grid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={3} width={7} height={7} rx={1} {...common} />
          <Rect x={14} y={3} width={7} height={7} rx={1} {...common} />
          <Rect x={3} y={14} width={7} height={7} rx={1} {...common} />
          <Rect x={14} y={14} width={7} height={7} rx={1} {...common} />
        </Svg>
      );
    case 'scan':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 7V5a2 2 0 0 1 2-2h2" {...common} />
          <Path d="M17 3h2a2 2 0 0 1 2 2v2" {...common} />
          <Path d="M21 17v2a2 2 0 0 1-2 2h-2" {...common} />
          <Path d="M7 21H5a2 2 0 0 1-2-2v-2" {...common} />
          <Line x1={3} y1={12} x2={21} y2={12} {...common} />
        </Svg>
      );
    case 'send':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M22 2L11 13" {...common} />
          <Path d="M22 2L15 22l-4-9-9-4 20-7z" {...common} />
        </Svg>
      );
    case 'mic-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" {...common} />
          <Path d="M17 16.95A7 7 0 0 1 5 12v-2" {...common} />
          <Path d="M19 10v2a7 7 0 0 1-.11 1.23" {...common} />
          <Line x1={12} y1={19} x2={12} y2={23} {...common} />
          <Line x1={1} y1={1} x2={23} y2={23} {...common} />
        </Svg>
      );
    case 'phone-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.53-2.9M4.27 4.27A19.79 19.79 0 0 0 2.06 3.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
            {...common}
          />
          <Line x1={1} y1={1} x2={23} y2={23} {...common} />
        </Svg>
      );
    case 'volume-2':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M11 5L6 9H2v6h4l5 4V5z" {...common} />
          <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" {...common} />
          <Path d="M18.36 5.64a9 9 0 0 1 0 12.72" {...common} />
        </Svg>
      );
    case 'smartphone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={5} y={2} width={14} height={20} rx={2} {...common} />
          <Line x1={11} y1={18} x2={13} y2={18} {...common} />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 11l9-8 9 8" {...common} />
          <Path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" {...common} />
        </Svg>
      );
    case 'map-pin-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6.5 6.5C7.6 5.03 9.34 4 11.5 4a7 7 0 0 1 7 7c0 2.5-1.6 5.2-3.3 7.4" {...common} />
          <Path d="M14.5 17.5C13.3 18.9 12.2 20 12 20s-6-5-6-9c0-1 .2-2 .6-2.9" {...common} />
          <Circle cx={11.5} cy={11} r={2.5} {...common} />
          <Line x1={1} y1={1} x2={23} y2={23} {...common} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={12} y1={5} x2={12} y2={19} {...common} />
          <Line x1={5} y1={12} x2={19} y2={12} {...common} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 18l6-6-6-6" {...common} />
        </Svg>
      );
    case 'share':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={18} cy={5} r={3} {...common} />
          <Circle cx={6} cy={12} r={3} {...common} />
          <Circle cx={18} cy={19} r={3} {...common} />
          <Line x1={8.59} y1={13.51} x2={15.42} y2={17.49} {...common} />
          <Line x1={15.41} y1={6.51} x2={8.59} y2={10.49} {...common} />
        </Svg>
      );
    case 'ban':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Line x1={5} y1={19} x2={19} y2={5} {...common} />
        </Svg>
      );
    case 'filter':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 5h16l-6 8v6l-4-2v-4z" {...common} />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" {...common} />
          <Path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z" {...common} />
          <Circle cx={17} cy={13} r={1.5} {...common} />
        </Svg>
      );
    case 'megaphone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 11v2a2 2 0 0 0 2 2h1l3 5V9L6 8H5a2 2 0 0 0-2 2z" {...common} />
          <Path d="M9 6.5l11-4v19l-11-4" {...common} />
          <Path d="M18 10a3 3 0 0 1 0 4" {...common} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 6h18" {...common} />
          <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" {...common} />
          <Line x1={10} y1={11} x2={10} y2={17} {...common} />
          <Line x1={14} y1={11} x2={14} y2={17} {...common} />
        </Svg>
      );
    case 'download':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...common} />
          <Path d="M7 10l5 5 5-5" {...common} />
          <Line x1={12} y1={15} x2={12} y2={3} {...common} />
        </Svg>
      );
    case 'x-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Line x1={15} y1={9} x2={9} y2={15} {...common} />
          <Line x1={9} y1={9} x2={15} y2={15} {...common} />
        </Svg>
      );
    case 'scooter':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={5.5} cy={18} r={2.5} {...common} />
          <Circle cx={18.5} cy={18} r={2.5} {...common} />
          <Path d="M5.5 18h6l2-8h4" {...common} />
          <Path d="M13.5 6h3l2 4h-2.5" {...common} />
          <Path d="M11.5 10h-3" {...common} />
        </Svg>
      );
    case 'motorbike':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={5} cy={17} r={3} {...common} />
          <Circle cx={19} cy={17} r={3} {...common} />
          <Path d="M5 17l3-8h6l3 4h2" {...common} />
          <Path d="M8 9h5" {...common} />
          <Path d="M14 13l2-4" {...common} />
        </Svg>
      );
    case 'truck':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={1} y={6} width={13} height={11} rx={1} {...common} />
          <Path d="M14 10h4l3 3v4h-7z" {...common} />
          <Circle cx={6} cy={19} r={2} {...common} />
          <Circle cx={17} cy={19} r={2} {...common} />
        </Svg>
      );
    case 'check-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Path d="M8 12l2.5 2.5L16 9" {...common} />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={11} cy={11} r={8} {...common} />
          <Line x1={21} y1={21} x2={16.65} y2={16.65} {...common} />
        </Svg>
      );
    case 'dollar-sign':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={12} y1={1} x2={12} y2={23} {...common} />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...common} />
        </Svg>
      );
    case 'wrench':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"
            {...common}
          />
        </Svg>
      );
    case 'monitor':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={2} y={4} width={20} height={13} rx={2} {...common} />
          <Line x1={8} y1={21} x2={16} y2={21} {...common} />
          <Line x1={12} y1={17} x2={12} y2={21} {...common} />
        </Svg>
      );
    case 'log-out':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} />
          <Line x1={16} y1={17} x2={21} y2={12} {...common} />
          <Line x1={16} y1={7} x2={21} y2={12} {...common} />
          <Line x1={21} y1={12} x2={9} y2={12} {...common} />
        </Svg>
      );
    case 'server':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={2} y={3} width={20} height={7} rx={2} {...common} />
          <Rect x={2} y={14} width={20} height={7} rx={2} {...common} />
          <Line x1={6} y1={6.5} x2={6.01} y2={6.5} {...common} />
          <Line x1={6} y1={17.5} x2={6.01} y2={17.5} {...common} />
        </Svg>
      );
    case 'folder':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" {...common} />
        </Svg>
      );
    case 'zoom-in':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={11} cy={11} r={8} {...common} />
          <Line x1={21} y1={21} x2={16.65} y2={16.65} {...common} />
          <Line x1={11} y1={8} x2={11} y2={14} {...common} />
          <Line x1={8} y1={11} x2={14} y2={11} {...common} />
        </Svg>
      );
    case 'zoom-out':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={11} cy={11} r={8} {...common} />
          <Line x1={21} y1={21} x2={16.65} y2={16.65} {...common} />
          <Line x1={8} y1={11} x2={14} y2={11} {...common} />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={4} width={18} height={18} rx={2} {...common} />
          <Line x1={16} y1={2} x2={16} y2={6} {...common} />
          <Line x1={8} y1={2} x2={8} y2={6} {...common} />
          <Line x1={3} y1={10} x2={21} y2={10} {...common} />
        </Svg>
      );
    case 'globe':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Line x1={2} y1={12} x2={22} y2={12} {...common} />
          <Path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" {...common} />
        </Svg>
      );
    case 'help-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} {...common} />
          <Path d="M9.5 9a2.5 2.5 0 0 1 4.9.75c0 1.75-2.4 2-2.4 3.25" {...common} />
          <Line x1={12} y1={17} x2={12.01} y2={17} {...common} />
        </Svg>
      );
    case 'user-x':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={9} cy={7} r={4} {...common} />
          <Path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 3 1.34" {...common} />
          <Line x1={17} y1={8} x2={22} y2={13} {...common} />
          <Line x1={22} y1={8} x2={17} y2={13} {...common} />
        </Svg>
      );
    default:
      return null;
  }
}
