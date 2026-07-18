import { CloudOff, LucideIcon, PackageOpen, Sparkles } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { PrimaryButton } from './PrimaryButton';

type StateViewProps = {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  badge?: string;
  children?: ReactNode;
};

/** Centered illustration + copy used for empty, error and coming-soon states. */
export function StateView({ icon: Icon, title, message, actionLabel, onAction, badge, children }: StateViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconOuter, { backgroundColor: theme.primarySoft }]}>
        <View style={[styles.iconInner, { backgroundColor: theme.surface }]}>
          <Icon size={40} color={theme.primary} strokeWidth={1.5} />
        </View>
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
          <Text style={[styles.badgeText, { color: theme.accent }]}>{badge}</Text>
        </View>
      ) : null}
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
        {title}
      </Text>
      {message ? <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {children}
    </View>
  );
}

type PartialStateProps = Partial<Omit<StateViewProps, 'children'>> & { children?: ReactNode };

export function EmptyState(props: PartialStateProps) {
  return (
    <StateView
      icon={PackageOpen}
      title="Nothing here yet"
      message="We couldn't find anything to show."
      {...props}
    />
  );
}

export function ErrorState({ onRetry, ...props }: PartialStateProps & { onRetry?: () => void }) {
  return (
    <StateView
      icon={CloudOff}
      title="Something went wrong"
      message="Please check your connection and try again."
      actionLabel={onRetry ? 'Retry' : undefined}
      onAction={onRetry}
      {...props}
    />
  );
}

export function ComingSoon(props: PartialStateProps) {
  return (
    <StateView
      icon={Sparkles}
      badge="COMING SOON"
      title="Feature Coming Soon"
      message="This feature will be available in an upcoming release."
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.six,
  },
  iconOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginBottom: Spacing.two,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: Spacing.two,
    maxWidth: 280,
  },
  action: {
    marginTop: Spacing.four,
    minWidth: 180,
  },
});
