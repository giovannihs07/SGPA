const lightTheme = {
  label: {
    color: "#495057"
  },
  item: {
    color: "#495057",
    hover: "#4f71e5",
    active: "#3e60d5"
  }
};
const darkTheme = {
  label: {
    color: "#8791a0"
  },
  item: {
    color: "#969ba0",
    hover: "#c8d2dc",
    active: "#e1e6eb"
  }
};
export const getLeftbarTheme = themeMode => {
  return themeMode == "light" ? lightTheme : darkTheme;
};