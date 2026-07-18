import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SectionHeaderProps = {
  title: string;
  onViewAll?: () => void;
};

export function SectionHeader({ title, onViewAll }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
        {title}
      </Text>
      {onViewAll ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View all ${title}`}
          hitSlop={8}
          onPress={onViewAll}
          style={({ pressed }) => [styles.viewAll, pressed && { opacity: 0.6 }]}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
          <ChevronRight size={16} color={theme.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
