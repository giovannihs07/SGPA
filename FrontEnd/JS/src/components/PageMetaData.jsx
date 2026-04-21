import { Helmet } from "react-helmet-async";
const PageMetaData = ({
  title
}) => {
  return <Helmet>
      <title> {title} | Attex React - Responsive MUI Admin Dashboard </title>
    </Helmet>;
};
export default PageMetaData;