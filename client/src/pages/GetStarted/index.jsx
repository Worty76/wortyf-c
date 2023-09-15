import React from "react";
import Footer from "./components/Footer";
import Head from "./components/Head";
import PreviewContents from "./components/PreviewContents";
import Recommendations from "./components/Recommendations";

export default function index() {
  return (
    <React.Fragment>
      <main>
        <Head />
        <PreviewContents />
        <Recommendations />
      </main>
      <Footer />
    </React.Fragment>
  );
}
