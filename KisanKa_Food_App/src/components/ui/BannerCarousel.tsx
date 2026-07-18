import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AppImage } from './AppImage';

export type Banner = {
  id: string;
  imageUrl: string;
  title?: string;
};

type BannerCarouselProps = {
  banners: Banner[];
  autoPlayInterval?: number;
};

/** Auto-rotating, swipeable hero banner carousel with dot indicators. */
export function BannerCarousel({ banners, autoPlayInterval = 4000 }: BannerCarouselProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Banner>>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const itemWidth = width - Spacing.three * 2;

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % banners.length;
      listRef.current?.scrollToOffset({ offset: next * itemWidth, animated: true });
      indexRef.current = next;
      setActiveIndex(next);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [banners.length, paused, autoPlayInterval, itemWidth]);

  const onMomentumEnd = useCallback(
    (offsetX: number) => {
      const next = Math.max(0, Math.min(banners.length - 1, Math.round(offsetX / itemWidth)));
      indexRef.current = next;
      setActiveIndex(next);
    },
    [banners.length, itemWidth],
  );

  if (banners.length === 0) return null;

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onScrollBeginDrag={() => setPaused(true)}
        onScrollEndDrag={() => setPaused(false)}
        onMomentumScrollEnd={(e) => onMomentumEnd(e.nativeEvent.contentOffset.x)}
        getItemLayout={(_, index) => ({ length: itemWidth, offset: itemWidth * index, index })}
        contentContainerStyle={{ paddingHorizontal: Spacing.three }}
        renderItem={({ item }) => (
          <View style={{ width: itemWidth }}>
            <AppImage
              source={{ uri: item.imageUrl }}
              style={[styles.banner, { width: itemWidth - Spacing.two }]}
              contentFit="cover"
              accessibilityLabel={item.title ?? 'Promotional banner'}
              accessibilityIgnoresInvertColors
            />
          </View>
        )}
      />
      {banners.length > 1 ? (
        <View style={styles.dots}>
          {banners.map((banner, index) => (
            <View
              key={banner.id}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? theme.primary : theme.backgroundSelected,
                  width: index === activeIndex ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    aspectRatio: 16 / 8,
    borderRadius: Radius.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.two,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
