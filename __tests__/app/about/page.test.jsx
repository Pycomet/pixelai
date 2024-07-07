/* eslint-disable no-undef */
jest.mock("../../../lib/firebase/firebaseConfig");

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Page from "../../../app/about/page";

describe("About Us Page", () => {
  it("renders wuthout crashing", () => {
    render(<Page />);
  });
});
