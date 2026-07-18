import { Heart } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { discountPercent, formatPrice } from '@/utils/format';

import { AppImage } from './AppImage';

export type ProductCardProps = {
  title: string;
  imageUrl?: string | null;
  price?: string | number | null;
  compareAtPrice?: string | number | null;
  /** Variant/size label, e.g. "1 kg". */
  unit?: string | null;
  onPress: () => void;
  onAddToCart?: () => void;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Grid/rail product card: image, discount badge, wishlist heart, price and Add CTA. */
export const ProductCard = memo(function ProductCard({
  title,
  imageUrl,
  price,
  compareAtPrice,
  unit,
  onPress,
  onAddToCart,
  isFavourite = false,
  onToggleFavourite,
  style,
}: ProductCardProps) {
  const theme = useTheme();
  const discount = discountPercent(price, compareAtPrice);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface },
        Shadows.card,
        pressed && { opacity: 0.92 },
        style,
      ]}>
      <View style={styles.imageWrap}>
        <AppImage
          source={imageUrl ? { uri: imageUrl } : undefined}
          style={styles.image}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
        {discount ? (
          <View style={[styles.discountBadge, { backgroundColor: theme.accent }]}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        ) : null}
        {onToggleFavourite ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavourite ? 'Remove from wishlist' : 'Add to wishlist'}
            hitSlop={8}
            onPress={onToggleFavourite}
            style={[styles.heartButton, { backgroundColor: theme.surface }]}>
            <Heart
              size={16}
              color={isFavourite ? theme.danger : theme.textSecondary}
              fill={isFavourite ? theme.danger : 'transparent'}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
        {unit ? (
          <Text style={[styles.unit, { color: theme.textSecondary }]} numberOfLines={1}>
            {unit}
          </Text>
        ) : null}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>{formatPrice(price)}</Text>
          {discount ? (
            <Text style={[styles.compareAt, { color: theme.textMuted }]}>
              {formatPrice(compareAtPrice)}
            </Text>
          ) : null}
        </View>
      </View>

      {onAddToCart ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${title} to cart`}
          onPress={onAddToCart}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.85 },
          ]}>
          <Text style={[styles.addLabel, { color: theme.onPrimary }]}>Add to Cart</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    flex: 1,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    minHeight: 38,
  },
  unit: {
    fontSize: 12,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  compareAt: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  addButton: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    borderRadius: Radius.sm + 2,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
