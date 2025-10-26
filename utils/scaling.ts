import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Base width for scaling calculations (iPhone SE width)
const BASE_WIDTH = 320;

// Calculate scale factor with a maximum cap for very large screens
export const scaleFactor = Math.min(screenWidth / BASE_WIDTH, 2.5);

// Utility functions for consistent scaling across the app
export const scale = (size: number): number => size * scaleFactor;

export const scaleFont = (size: number, minSize?: number): number => {
  const scaled = size * scaleFactor;
  return minSize ? Math.max(scaled, minSize) : scaled;
};

export const scaleVertical = (size: number): number => {
  const baseHeight = 568; // iPhone SE height
  const heightScale = Math.min(screenHeight / baseHeight, 2.5);
  return size * heightScale;
};

// Predefined font sizes for consistency
export const FontSizes = {
  tiny: scaleFont(10, 12),
  small: scaleFont(12, 14),
  medium: scaleFont(14, 16),
  large: scaleFont(16, 18),
  xlarge: scaleFont(18, 20),
  xxlarge: scaleFont(20, 22),
  title: scaleFont(24, 26),
  header: scaleFont(28, 30),
};

// Predefined spacing for consistency
export const Spacing = {
  tiny: scale(4),
  small: scale(8),
  medium: scale(12),
  large: scale(16),
  xlarge: scale(20),
  xxlarge: scale(24),
  huge: scale(32),
};

// Screen dimensions
export const ScreenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 414,
  isLargeScreen: screenWidth >= 414,
  isTablet: screenWidth >= 768,
};

// Helper to determine if we're on a large screen
export const isLargeScreen =
  ScreenDimensions.isLargeScreen || ScreenDimensions.isTablet;
