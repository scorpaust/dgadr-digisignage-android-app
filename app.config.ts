// app.config.ts
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "dgadr-digisignage-android-app",
  slug: "dgadr-digisignage-android-app",
  owner: "scorpaust",
  extra: {
    mediaStackApiKey: process.env.MEDIASTACK_API_KEY,
    eas: {
      projectId: "9865a449-ce96-4dc8-b5c2-f484cfd397fb", // Ensure projectId is included
    },
  },
});
