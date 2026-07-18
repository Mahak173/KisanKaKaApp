import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger-outline';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: PrimaryButtonProps) {
  const theme = useTheme();
  const blocked = disabled || loading;

  const backgroundColor =
    variant === 'primary' ? (blocked ? theme.backgroundSelected : theme.primary) : 'transparent';
  const borderColor =
    variant === 'outline' ? theme.primary : variant === 'danger-outline' ? theme.danger : 'transparent';
  const textColor =
    variant === 'primary'
      ? blocked
        ? theme.textMuted
        : theme.onPrimary
      : variant === 'danger-outline'
        ? theme.danger
        : theme.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, borderColor, borderWidth: variant === 'primary' ? 0 : 1.5 },
        pressed && !blocked && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TouchTarget + 4,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
