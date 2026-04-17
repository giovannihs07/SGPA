import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title }: { title: string }) => {
  return (
    <Helmet>
      <title> {title} | Attex React - Responsive MUI Admin Dashboard </title>
    </Helmet>
  );
};

export default PageMetaData;
