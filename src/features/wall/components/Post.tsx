import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Box } from '../../../design-system/components/layout/Box';
import { Typography } from '../../../design-system/components/foundation/Typography';
import { theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { Icon } from '@/design-system/components/layout/Icon';
import { Service } from '@/features/services/store';
import { getProfileStyles } from '@/features/profile/screens/profile/profile.styles';

interface PostProps {
  post: Service;
  onPress?: () => void;
}

const getVideoThumbnail = async (url: string): Promise<string | null> => {
  try {
    // Extraer el video ID de la URL
    const videoIdMatch = url.match(/\/([a-f0-9]{32})\//);
    if (!videoIdMatch) {
      return null;
    }

    const videoId = videoIdMatch[1];
    const customerCode = 'kb0znv13nolt7e8g';
    const thumbnailUrl = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;

    return thumbnailUrl;
  } catch {
    return null;
  }
};

export const Post = ({ post, onPress }: PostProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (post.media[0]?.kind === 'video') {
        const url = post.media[0]?.variants.public?.url;
        if (url) {
          const thumb = await getVideoThumbnail(url);
          setThumbnail(thumb);
        }
      }
    };
    loadThumbnail();
  }, [post]);

  const mainImageUri =
    post.media[0]?.kind === 'image'
      ? post.media[0]?.variants.cover?.url
      : thumbnail ?? undefined;

  return (
    <TouchableOpacity onPress={onPress}>
      <Box style={styles.card}>
        <Box style={styles.images}>
          <Image
            style={styles.mainImage}
            source={{ uri: mainImageUri }}
            resizeMode="cover"
          />
          <Image
            style={styles.linearGradientBlack}
            source={images.linearGradientBlack as ImageSourcePropType}
            resizeMode="cover"
          />
        </Box>

        <Box justifyContent="center">
          <Box style={styles.labelPrice} justifyContent="center" alignItems="center">
            <Image style={styles.imageLabelPrice} source={images.labelImage as ImageSourcePropType} />
            {images.labelImage ? (
              <Typography variant="bodyMedium" color="white">
                {post.price}/hr
              </Typography>
            ) : (
              ''
            )}
          </Box>
        </Box>

        <Row style={styles.footerCard} justifyContent="space-between">
          <Row>
            <Box>
              <Image
                source={{ uri: post.provider.media?.profileThumbnail?.url }}
                resizeMode="contain"
                style={getProfileStyles.profileImageAll}
              />
              <Box
                paddingLeft="sm"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                style={styles.rating}
              >
                <Box paddingRight="xs">
                  <Icon name="star" size={13} color="colorBaseWhite" />
                  <Box style={styles.secondStar}>
                    <Icon name="star" fillColor="colorBaseBlack" size={13} color="colorBaseWhite" />
                  </Box>
                </Box>
                <Typography variant="bodyXSmall" color="white">
                  {post.rating}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="bodyMedium" color="white">
                {post.provider.name}
              </Typography>
              <Typography variant="bodyXSmall" color="white">
                Service
              </Typography>
              <Box maxWidth={220}>
                <Typography variant="bodyMedium" color="white" truncate>
                  {post.title}
                </Typography>
              </Box>
            </Box>
          </Row>
          <Box alignItems="flex-end">
            <Typography variant="bodyMedium" color="white">
              1.5 Km
            </Typography>
            <Box paddingTop="sm">
              <Image
                source={
                  post.isFavorite
                    ? (images.bookmarkSiBg as ImageSourcePropType)
                    : (images.bookmarkNoBg as ImageSourcePropType)
                }
                width={14}
                height={20}
              />
            </Box>
          </Box>
        </Row>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    padding: theme.spacing.md,
    width: 392,
    height: 230,
    overflow: 'hidden',
    borderRadius: 12,
  },
  images: {
    position: 'absolute',
  },
  mainImage: {
    width: 392,
    height: 227,
    objectFit: 'cover'
  },
  linearGradientBlack: {
    position: 'absolute',
  },
  labelPrice: {
    width: 95,
    height: 32,
  },
  imageLabelPrice: {
    position: 'absolute',
  },
  footerCard: {
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: 0,
    width: '100%',
    margin: 16,
  },
  rating: {
    position: 'absolute',
    left: -8,
    bottom: -8,
    backgroundColor: theme.colors.colorBaseBlack,
    width: 55,
    height: 20,
    borderRadius: 40,
  },
  secondStar: {
    position: 'absolute',
    left: -7,
  },
});
