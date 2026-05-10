import React from "react";
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon, G } from "react-native-svg";
import type { ViewStyle } from "react-native";

export type IconName =
  | "wrench" | "clipboard" | "user" | "store" | "calendar" | "chat"
  | "check" | "check-double" | "close" | "back" | "send" | "warning"
  | "car" | "heart" | "heart-outline" | "eye" | "eye-off"
  | "circle-dot" | "refresh" | "history" | "phone" | "globe" | "pin"
  | "empty" | "edit" | "logout" | "search";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  style?: ViewStyle;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = "#fff", strokeWidth = 2, fill = "none", style }) => {
  const strokeProps = { stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", ...strokeProps, style };

  switch (name) {
    case "wrench":      return <Svg {...p}><Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></Svg>;
    case "clipboard":   return <Svg {...p}><Rect x="9" y="2" width="6" height="4" rx="1"/><Path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3"/><Line x1="9" y1="12" x2="15" y2="12"/><Line x1="9" y1="16" x2="13" y2="16"/></Svg>;
    case "user":        return <Svg {...p}><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><Circle cx="12" cy="7" r="4"/></Svg>;
    case "store":       return <Svg {...p}><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><Polyline points="9 22 9 12 15 12 15 22"/></Svg>;
    case "calendar":    return <Svg {...p}><Rect x="3" y="4" width="18" height="18" rx="2"/><Line x1="16" y1="2" x2="16" y2="6"/><Line x1="8" y1="2" x2="8" y2="6"/><Line x1="3" y1="10" x2="21" y2="10"/></Svg>;
    case "chat":        return <Svg {...p}><Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>;
    case "check":       return <Svg {...p}><Polyline points="20 6 9 17 4 12"/></Svg>;
    case "check-double":return <Svg {...p}><Polyline points="17 6 9 17 4 12"/><Polyline points="22 6 14 17 12 15"/></Svg>;
    case "close":       return <Svg {...p}><Line x1="18" y1="6" x2="6" y2="18"/><Line x1="6" y1="6" x2="18" y2="18"/></Svg>;
    case "back":        return <Svg {...p}><Line x1="19" y1="12" x2="5" y2="12"/><Polyline points="12 19 5 12 12 5"/></Svg>;
    case "send":        return <Svg {...p}><Line x1="22" y1="2" x2="11" y2="13"/><Polygon points="22 2 15 22 11 13 2 9 22 2" fill={color} stroke="none"/></Svg>;
    case "warning":     return <Svg {...p}><Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><Line x1="12" y1="9" x2="12" y2="13"/><Line x1="12" y1="17" x2="12.01" y2="17"/></Svg>;
    case "car":         return <Svg {...p}><Path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/><Path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><Path d="M5 9l2-5h10l2 5"/><Rect x="1" y="9" width="22" height="8" rx="1"/><Circle cx="7" cy="17" r="2"/><Circle cx="17" cy="17" r="2"/></Svg>;
    case "heart":       return <Svg {...p} fill={color} stroke="none"><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>;
    case "heart-outline":return <Svg {...p}><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>;
    case "eye":         return <Svg {...p}><Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><Circle cx="12" cy="12" r="3"/></Svg>;
    case "eye-off":     return <Svg {...p}><Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><Line x1="1" y1="1" x2="23" y2="23"/></Svg>;
    case "circle-dot":  return <Svg {...p} fill={color} stroke="none"><Circle cx="12" cy="12" r="5"/></Svg>;
    case "refresh":     return <Svg {...p}><Polyline points="23 4 23 10 17 10"/><Polyline points="1 20 1 14 7 14"/><Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Svg>;
    case "history":     return <Svg {...p}><Polyline points="12 8 12 12 14 14"/><Path d="M3.05 11a9 9 0 1 1 .5 4m-.5-4V7l3 3-3 3V11z"/></Svg>;
    case "phone":       return <Svg {...p}><Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.42 2 2 0 0 1 3.55 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.07 6.07l1.06-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></Svg>;
    case "globe":       return <Svg {...p}><Circle cx="12" cy="12" r="10"/><Line x1="2" y1="12" x2="22" y2="12"/><Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Svg>;
    case "pin":         return <Svg {...p}><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><Circle cx="12" cy="10" r="3"/></Svg>;
    case "empty":       return <Svg {...p}><Rect x="4" y="6" width="16" height="12" rx="2" ry="2"/><Line x1="8" y1="10" x2="16" y2="10"/><Line x1="8" y1="14" x2="12" y2="14"/><Path d="M16 14h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/></Svg>;
    case "edit":        return <Svg {...p}><Path d="M17 3l4 4L7 21H3v-4L17 3z"/><Line x1="17" y1="3" x2="21" y2="7"/></Svg>;
    case "logout":      return <Svg {...p}><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><Polyline points="16 17 21 12 16 7"/><Line x1="21" y1="12" x2="9" y2="12"/></Svg>;
    case "search":      return <Svg {...p}><Path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/><Line x1="21" y1="21" x2="15" y2="15"/></Svg>;
    default:            return null;
  }
};

export default Icon;