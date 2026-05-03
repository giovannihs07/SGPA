/*
 * Copyright (c) 2023.
 * File Name: index.ts
 * Author: Coderthemes
 */

import { deepMergeObjects } from "@src/helpers/global";
import getTableOverWrites from "@src/theme/components/table";
import getTooltipOverWrites from "@src/theme/components/tooltip";
const componentOverrides = theme => {
  return deepMergeObjects([getTableOverWrites(theme), getTooltipOverWrites(theme)]);
};
export default componentOverrides;