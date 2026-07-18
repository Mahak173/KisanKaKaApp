import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuantityStepperProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'small' | 'regular';
};

export function QuantityStepper({ value, onIncrease, onDecrease, size = 'regular' }: QuantityStepperProps) {
  const theme = useTheme();
  const buttonSize = size === 'small' ? 28 : 36;
  const fontSize = size === 'small' ? 14 : 16;

  return (
    <View
      style={[styles.container, { borderColor: theme.primary, borderRadius: Radius.sm + 2 }]}
      accessibilityRole="adjustable"
      accessibilityLabel="Quantity"
      accessibilityValue={{ text: `${value}` }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        hitSlop={6}
        onPress={onDecrease}
        style={({ pressed }) => [
          styles.button,
          { width: buttonSize, height: buttonSize },
          pressed && { opacity: 0.6 },
        ]}>
        <Minus size={fontSize} color={theme.primary} strokeWidth={2.5} />
      </Pressable>
      <Text style={[styles.value, { color: theme.text, fontSize, minWidth: buttonSize - 6 }]}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        hitSlop={6}
        onPress={onIncrease}
        style={({ pressed }) => [
          styles.button,
          { width: buttonSize, height: buttonSize },
          pressed && { opacity: 0.6 },
        ]}>
        <Plus size={fontSize} color={theme.primary} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
