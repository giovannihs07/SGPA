import { GoogleApiWrapper } from "google-maps-react";

// components
import { BasicGoogleMap, DarkStyledMap, LightStyledMap, MapWithMarkers, PolyLineMap, StreetViewMap } from "./data";
import { PageBreadcrumb } from "@src/components";
import { Grid, Typography } from "@mui/material";

type MapContainerProps = {
  google: any;
};

const GoogleMaps = ({ google }: MapContainerProps) => {
  return (
    <>
      <PageBreadcrumb title="Google Maps" subName="Maps" />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <BasicGoogleMap google={google} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <MapWithMarkers google={google} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <StreetViewMap google={google} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PolyLineMap google={google} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LightStyledMap google={google} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DarkStyledMap google={google} />
        </Grid>
      </Grid>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDsucrEdmswqYrw0f6ej3bf4M4suDeRgNA",
})(GoogleMaps);
