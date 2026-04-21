/*
 * Copyright (c) 2023.
 * File Name: global.ts
 * Author: Coderthemes
 */

export const deepMergeObjects = list => {
  let object = {};
  list.forEach(l => {
    object = {
      ...object,
      ...l
    };
  });
  return object;
};