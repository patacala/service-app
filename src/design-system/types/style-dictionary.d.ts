declare module 'style-dictionary' {
  interface StyleDictionaryConfig {
    source: string[];
    platforms: {
      [key: string]: {
        transformGroup?: string;
        buildPath: string;
        files: {
          destination: string;
          format: string;
          options?: Record<string, unknown>;
        }[];
      };
    };
  }

  class StyleDictionary {
    static extend(config: StyleDictionaryConfig): StyleDictionary;
    static registerTransform(transform: Record<string, unknown>): void;
  }

  export = StyleDictionary;
}
