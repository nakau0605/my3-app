import React from 'react';

interface IconProps {
  name: string; // Google Fonts Icons (Material Symbols) name: e.g. 'palette', 'visibility', 'edit_note', 'auto_awesome', 'celebration', 'lightbulb', 'link', 'ads_click', 'arrow_forward'
  size?: number | string;
  color?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google Fonts Icons (Material Symbols) Component
 * https://fonts.google.com/icons
 */
export default function Icon({
  name,
  size = 20,
  color,
  fill = false,
  style,
  className = '',
}: IconProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontFamily: "'Material Symbols Outlined'",
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: sizeValue,
        lineHeight: 1,
        letterSpacing: 'normal',
        textTransform: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        direction: 'ltr',
        fontFeatureSettings: "'liga'",
        WebkitFontSmoothing: 'antialiased',
        color: color || 'currentColor',
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`,
        verticalAlign: 'middle',
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
