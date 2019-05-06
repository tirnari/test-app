/* eslint-env jest */
import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import TestTable from "./Table";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TestTable rows={[]} currentText="" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("matches snapshot", () => {
  const tree = renderer
    .create(
      <TestTable rows={["one", "two", "three"]} currentText="add something" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
