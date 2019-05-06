import { uniqueId } from "lodash";
import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { url } from "./config/api";

export default class TestTable extends React.Component {
  constructor(props) {
    super(props);
    const { rows, currentText } = this.props;
    this.state = { rows, currentText, error: false };
  }

  handleChange = e => {
    e.preventDefault();
    const row = e.target.value;
    this.setState({
      currentText: row
    });
  };

  addRow = async e => {
    e.preventDefault();
    const { currentText } = this.state;
    this.setState({ error: false });

    await axios.post(`${url}/rows`, { text: currentText }).catch(error => {
      this.setState({ error: error.response.data.error });
    });

    if (this.state.error) return;

    const { data } = await axios.get(`${url}/rows`);

    this.setState({
      rows: data.rows,
      currentText: ""
    });
  };

  removeRow = ({ id }) => async e => {
    e.preventDefault();
    await axios.delete(`${url}/rows`, { data: { id } });
    const { data } = await axios.get(`${url}/rows`);
    this.setState({
      rows: data.rows
    });
  };

  async componentDidMount() {
    const res = await axios.get(`${url}/rows`);
    const { rows } = res.data;
    this.setState({ rows });
  }

  render() {
    const { rows, currentText, error } = this.state;

    const renderRow = row => {
      return (
        <TableRow key={uniqueId()}>
          <TableCell onClick={this.removeRow(row)}>{row.text}</TableCell>
        </TableRow>
      );
    };

    return (
      <div>
        {error && <div>{error}</div>}
        <div>
          <form onSubmit={this.addRow}>
            <TextField
              onChange={this.handleChange}
              value={currentText}
              type="text"
            />
            <Button type="submit">Add</Button>
          </form>
        </div>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>List:</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{rows.map(renderRow)}</TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

TestTable.propTypes = {
  rows: PropTypes.array.isRequired,
  currentText: PropTypes.string.isRequired
};
