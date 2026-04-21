import { IconButton, InputAdornment } from "@mui/material";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useToggle } from "@src/hooks";
import { FormInput } from "@src/components";
const PasswordInput = ({
  ...other
}) => {
  const {
    isOpen,
    toggleOpen
  } = useToggle();
  return <FormInput {...other} endAdornment={<InputAdornment position="end">
          <IconButton onClick={toggleOpen} edge="end">
            {isOpen ? <LuEyeOff /> : <LuEye />}
          </IconButton>
        </InputAdornment>} type={isOpen ? "text" : "password"} />;
};
export default PasswordInput;