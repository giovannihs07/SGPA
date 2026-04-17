/*
 * Copyright (c) 2023.
 * File Name: LanguageDropdown.tsx
 * Author: Coderthemes
 */

import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import country1 from "@src/assets/images/flags/Argentina.png";
import country2 from "@src/assets/images/flags/Canada.png";
import country3 from "@src/assets/images/flags/Bharat.png";
import country4 from "@src/assets/images/flags/Japan.png";
import country5 from "@src/assets/images/flags/UK.png";
import country6 from "@src/assets/images/flags/US.png";
import { LuChevronDown } from "react-icons/lu";
import { useDropdownMenu } from "@src/hooks";

const LanguageDropdown = () => {
  const selectedLanguage = country3;
  const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();

  return (
    <Box sx={{ cursor: "pointer", gap: 1, alignItems: "center", display: "flex", height: "100%", width: "auto" }}>
      <Button
        sx={{ color: "text.secondary" }}
        onClick={handleClick}
        variant="text"
        startIcon={<Avatar variant="square" sx={{ width: 18, height: 12 }} src={selectedLanguage} />}
        endIcon={<LuChevronDown />}>
        English
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={handleClose}>
          <ListItemAvatar sx={{ minWidth: "25px" }}>
            
            <img src={country6} height={"12px"} width={"18px"} />
          </ListItemAvatar>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemAvatar sx={{ minWidth: "25px" }}>
            
            <img src={country1} height={"12px"} width={"18px"} />
          </ListItemAvatar>
          <ListItemText>Argentina</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemAvatar sx={{ minWidth: "25px" }}>
            
            <img src={country2} height={"12px"} width={"18px"} />
          </ListItemAvatar>
          <ListItemText>Canada</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemAvatar sx={{ minWidth: "25px" }}>
            
            <img src={country4} height={"12px"} width={"18px"} />
          </ListItemAvatar>
          <ListItemText>Japan</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemAvatar sx={{ minWidth: "25px" }}>
            
            <img src={country5} height={"12px"} width={"18px"} />
          </ListItemAvatar>
          <ListItemText>UK</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageDropdown;
