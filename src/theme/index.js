import { COLORS } from './colors';

export const FONTS = {
    regular: {
        fontFamily: 'System',
        fontWeight: '400',
    },
    medium: {
        fontFamily: 'System',
        fontWeight: '500',
    },
    bold: {
        fontFamily: 'System',
        fontWeight: '700',
    },
};

export const SIZES = {
    // Font sizes
    xxxs: 10,
    xxs: 12,
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 36,

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    // Border radius
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
};

const theme = {
    colors: COLORS,
    fonts: FONTS,
    sizes: SIZES,
    shadows: SHADOWS,
};

export default theme;
