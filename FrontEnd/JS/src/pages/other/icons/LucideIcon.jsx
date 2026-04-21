import { icons } from "lucide-react";
const LucideIcon = ({
  name,
  size
}) => {
  const LucideIcon = icons[name];
  return <LucideIcon size={size} />;
};
export default LucideIcon;