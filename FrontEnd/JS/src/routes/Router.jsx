/*
 * Copyright (c) 2023.
 * File Name: Router.tsx
 * Author: Coderthemes
 */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "@src/components/ScrollToTop";
import DefaultLayout from '@src/layouts/DefaultLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
import { defaultLayoutRoutes, verticalLayoutRoutes } from './routes';
const Router = props => {
  return <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {verticalLayoutRoutes.map((route, idx) => <Route key={idx + (route.path ?? '')} path={route.path} {...props} element={<VerticalLayout>{route.element}</VerticalLayout>} />)}
        {defaultLayoutRoutes.map((route, idx) => <Route key={idx + (route.path ?? '')} path={route.path} {...props} element={<DefaultLayout>{route.element}</DefaultLayout>} />)}
      </Routes>
    </BrowserRouter>;
};
export default Router;