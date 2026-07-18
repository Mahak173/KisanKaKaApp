import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  title: string;
  /** Hide the back button on tab roots. */
  showBack?: boolean;
  right?: ReactNode;
  transparent?: boolean;
};

/** Consistent stack header: back chevron, centered title, optional right slot. */
export function ScreenHeader({ title, showBack = true, right, transparent = false }: ScreenHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: transparent ? 'transparent' : theme.background,
        },
      ]}>
      <View style={styles.side}>
        {showBack && router.canGoBack() ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: theme.surface },
              pressed && { opacity: 0.7 },
            ]}>
            <ChevronLeft size={22} color={theme.text} />
          </Pressable>
        ) : null}
      </View>
      <Text
        style={[styles.title, { color: theme.text }]}
        numberOfLines={1}
        accessibilityRole="header">
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  side: {
    width: TouchTarget,
    minHeight: TouchTarget - 4,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
