import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    style,
    textStyle
}) => {
    const getButtonStyle = () => {
        let buttonStyle = { ...styles.button };

        // Handle variant
        switch (variant) {
            case 'primary':
                buttonStyle = { ...buttonStyle, ...styles.primaryButton };
                break;
            case 'secondary':
                buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
                break;
            case 'outline':
                buttonStyle = { ...buttonStyle, ...styles.outlineButton };
                break;
            default:
                buttonStyle = { ...buttonStyle, ...styles.primaryButton };
        }

        // Handle size
        switch (size) {
            case 'small':
                buttonStyle = { ...buttonStyle, ...styles.smallButton };
                break;
            case 'medium':
                buttonStyle = { ...buttonStyle, ...styles.mediumButton };
                break;
            case 'large':
                buttonStyle = { ...buttonStyle, ...styles.largeButton };
                break;
            default:
                buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        }

        // Handle disabled
        if (disabled) {
            buttonStyle = { ...buttonStyle, ...styles.disabledButton };
        }

        return buttonStyle;
    };

    const getTextStyle = () => {
        let textStyleVar = { ...styles.buttonText };

        // Handle variant
        switch (variant) {
            case 'primary':
                textStyleVar = { ...textStyleVar, ...styles.primaryButtonText };
                break;
            case 'secondary':
                textStyleVar = { ...textStyleVar, ...styles.secondaryButtonText };
                break;
            case 'outline':
                textStyleVar = { ...textStyleVar, ...styles.outlineButtonText };
                break;
            default:
                textStyleVar = { ...textStyleVar, ...styles.primaryButtonText };
        }

        // Handle size
        switch (size) {
            case 'small':
                textStyleVar = { ...textStyleVar, ...styles.smallButtonText };
                break;
            case 'medium':
                textStyleVar = { ...textStyleVar, ...styles.mediumButtonText };
                break;
            case 'large':
                textStyleVar = { ...textStyleVar, ...styles.largeButtonText };
                break;
            default:
                textStyleVar = { ...textStyleVar, ...styles.mediumButtonText };
        }

        // Handle disabled
        if (disabled) {
            textStyleVar = { ...textStyleVar, ...styles.disabledButtonText };
        }

        return textStyleVar;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.sizes.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Variants
    primaryButton: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
        borderWidth: 0,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },

    // Sizes
    smallButton: {
        paddingVertical: theme.sizes.spacing.xs,
        paddingHorizontal: theme.sizes.spacing.md,
    },
    mediumButton: {
        paddingVertical: theme.sizes.spacing.sm,
        paddingHorizontal: theme.sizes.spacing.lg,
    },
    largeButton: {
        paddingVertical: theme.sizes.spacing.md,
        paddingHorizontal: theme.sizes.spacing.xl,
    },

    // Disabled
    disabledButton: {
        backgroundColor: theme.colors.border,
        borderColor: theme.colors.border,
        opacity: 0.5,
    },

    // Text styles
    buttonText: {
        textAlign: 'center',
        ...theme.fonts.medium,
    },

    // Text variants
    primaryButtonText: {
        color: theme.colors.surface,
    },
    secondaryButtonText: {
        color: theme.colors.text,
    },
    outlineButtonText: {
        color: theme.colors.primary,
    },

    // Text sizes
    smallButtonText: {
        fontSize: theme.sizes.xs,
    },
    mediumButtonText: {
        fontSize: theme.sizes.sm,
    },
    largeButtonText: {
        fontSize: theme.sizes.md,
    },

    // Disabled text
    disabledButtonText: {
        color: theme.colors.textLight,
    },
});

export default Button;
