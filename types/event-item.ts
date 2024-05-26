import { ImageSourcePropType } from "react-native/types";

export type EventItemType = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  date: string;
  time: string;
  imgUrl: ImageSourcePropType;
};
