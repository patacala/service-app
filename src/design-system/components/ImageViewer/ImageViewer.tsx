import React from "react";
import { Image, ImageSourcePropType, StyleProp, ImageStyle, View } from "react-native";

type SourceType = "url" | "file" | "asset";

interface Props {
  sourceType: SourceType;
  source: string | ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
}

export const ImageViewer = ({
  sourceType,
  source,
  style,
  width,
  height
}: Props) => {
  let imageSource: ImageSourcePropType;

  switch (sourceType) {
    case "url":
      imageSource = { uri: source as string };
      break;

    case "file":
      imageSource = { uri: source as string };
      break;

    case "asset":
      imageSource = source as ImageSourcePropType;
      break;

    default:
      imageSource = { uri: "" };
  }

  return (
    <View>
      <Image
        source={imageSource}
        style={[
          { width: width ?? 200, height: height ?? 200, borderRadius: 8 },
          style
        ]}
        resizeMode="cover"
      />
    </View>
  );
};
