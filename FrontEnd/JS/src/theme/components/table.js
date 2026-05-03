/*
 * Copyright (c) 2023.
 * File Name: accordion.ts
 * Author: Coderthemes
 */

const getTableOverWrites = theme => {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: theme.palette?.mode == "light" ? "#eee" : "#333"
        }
      }
    },
    // @ts-ignore
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          borderColor: theme.palette?.mode == "light" ? "#eee" : "#333"
        }
      }
    }
  };
};
export default getTableOverWrites;