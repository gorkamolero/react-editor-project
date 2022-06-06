import { Extension } from "@tiptap/core";
import deepEqual from "../utils/deepEqual";

export interface KVStorageOptions {}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {}
}

export const KVStorage = Extension.create<KVStorageOptions>({
  name: "kvStorage",

  addStorage() {
    return {
      headNumbering: undefined,
      tailNumbering: undefined,
    };
  },

  addCommands() {
    return {};
  },
});
