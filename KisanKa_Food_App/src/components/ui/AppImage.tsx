import { Image, ImageProps } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type AppImageProps = ImageProps & {
  /** Icon size of the fallback shown when the image fails to load. */
  fallbackIconSize?: number;
};

/**
 * expo-image wrapper with a themed loading placeholder, smooth fade-in and
 * an error fallback so broken URLs never render as blank boxes.
 */
export function AppImage({ style, fallbackIconSize = 24, onError, ...rest }: AppImageProps) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);

  if (failed || !rest.source) {
    return (
      <View style={[styles.fallback, { backgroundColor: theme.backgroundElement }, style]}>
        <ImageOff size={fallbackIconSize} color={theme.textMuted} strokeWidth={1.5} />
      </View>
    );
  }

  return (
    <Image
      transition={200}
      cachePolicy="memory-disk"
      contentFit="cover"
      placeholderContentFit="cover"
      {...rest}
      style={[{ backgroundColor: theme.backgroundElement }, style]}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
