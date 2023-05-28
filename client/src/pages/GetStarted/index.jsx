import React from "react";
import Footer from "./Section/Footer";
import Head from "./Section/Head";
import PreviewContents from "./Section/PreviewContents";
import Recommendations from "./Section/Recommendations";

export default function index() {
  return (
    <React.Fragment>
      <Head />
      <PreviewContents />
      <Recommendations />
      <Footer />
    </React.Fragment>
  );
}
