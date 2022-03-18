import "./form.css";
import React from "react";
import moment from "moment";
import axios from "axios";
import { orderBy } from "lodash";
import qs from "qs";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: "",
      isShowBulkAction: false,
      id: "",
      titleTask: "",
      description: "",
      dueDate: "",
      priority: "",
      changePriority: "normal",
      changeUpdatePriority: "normal",
      showElement: "",
    };
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  loadTasks() {
    axios.get("http://localhost:9000/api/tasks").then((response) => {
      let newDataSource = response.data;
      if (response.data && response.data.length > 0) {
        response.data.map((element) => {
          let dueDate = element.dueDate;
          element.dueDate = moment(dueDate).format("YYYYMMDD");
        });
        newDataSource = orderBy(response.data, ["dueDate"], ["asc"]);
      }
      this.setState({ dataSource: newDataSource });
    });
  }

  componentDidMount() {
    setTimeout(this.loadTasks(), 2000);
  }

  handleAddNew(event) {
    event.preventDefault();
    const data = event.target.elements;
    if (data && data.titleTask && data.titleTask.value.trim().length > 0) {
      const today = moment(new Date()).format("YYYY-MM-DD");
      const inputData = qs.stringify({
        taskTitle: data.titleTask.value.trim(),
        description: data.description.value
          ? data.description.value.trim()
          : "",
        dueDate: data.dueDate.value ? data.dueDate.value : today,
        priority: this.state.changePriority,
      });
      console.log("them: ", inputData);
      const config = {
        method: "post",
        url: "http://localhost:9000/api/tasks/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: inputData,
      };

      axios(config)
        .then((response) => {
          //console.log("handleAddNew ", response.data);
          setTimeout(this.loadTasks(), 2000);
        })
        .catch((error) => console.log(error));
    } else {
      alert("Please add a task title field.");
    }
  }

  handleRemove = (id) => {
    var config = {
      method: "delete",
      url: "http://localhost:9000/api/tasks/" + id,
      headers: {},
    };

    axios(config)
      .then((response) => {
        console.log("response", response);
        alert("Deleted successfully.");
        setTimeout(this.loadTasks(), 2000);
      })
      .catch(function (error) {
        console.log("Error in handleRemove: ", error);
      });
  };

  handleUpdate(event) {
    event.preventDefault();
    const data = event.target.elements;

    if (data && data.titleTask && data.titleTask.value.trim().length > 0) {
      const today = moment(new Date()).format("YYYY-MM-DD");
      const dueDate = data.dueDate.value ? data.dueDate.value : today;
      const description = data.description.value
        ? data.description.value.trim()
        : "";
      const inputData = qs.stringify({
        taskTitle: data.titleTask.value.trim(),
        description,
        dueDate,
        priority: this.state.changeUpdatePriority,
      });
      const config = {
        method: "put",
        url:
          "http://localhost:9000/api/tasks/" +
          this.state.id +
          "?description=" +
          description +
          "&taskTitle=" +
          data.titleTask.value.trim() +
          "&dueDate=" +
          dueDate +
          "&priority=" +
          this.state.changeUpdatePriority,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: inputData,
      };
      axios(config)
        .then((response) => {
          alert("Updated successfully.");
          setTimeout(this.loadTasks(), 2000);
        })
        .catch((error) => console.log(error));
    } else {
      alert("Please add a task title field.");
    }
  }

  hanldeSearch = (event) => {
    const keyWord = event.target.value;
    if (keyWord && keyWord.trim().length > 0) {
      var config = {
        method: "get",
        url:
          "http://localhost:9000/api/tasks/searchTasks/" +
          keyWord.trim() +
          "\r",
        headers: {},
      };

      axios(config)
        .then((response) => {
          this.setState({ dataSource: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else this.loadTasks();
    this.setState({ isShowBulkAction: false });
  };

  handleDetail = (id) => {
    var config = {
      method: "get",
      url: "http://localhost:9000/api/tasks/" + id,
      headers: {},
    };

    axios(config)
      .then((response) => {
        if (response.data)
          this.setState({
            id: response.data._id,
            titleTask: response.data.taskTitle,
            description: response.data.description,
            dueDate: response.data.dueDate,
            priority: response.data.priority,
            changeUpdatePriority: response.data.priority,
            showElement: response.data._id,
          });
        else
          this.setState({
            id: "",
            titleTask: "",
            description: "",
            dueDate: "",
            priority: "",
            changeUpdatePriority: "normal",
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleChange = () => {
    var checkboxes = document.getElementsByName("checkBox");
    let count = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) count = count + 1;
    }
    if (count > 0) this.setState({ isShowBulkAction: true });
    else this.setState({ isShowBulkAction: false });
  };

  handleCheckedCheckBox = () => {
    var checkboxes = document.getElementsByName("checkBox");
    let idArray = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) idArray.push(checkboxes[i].value);
    }
    this.handleRemove(idArray.toString());
  };

  handleChangeSelection = (event) => {
    this.setState({ changePriority: event.target.value });
  };

  handleChangeUpdateSelection = (event) => {
    this.setState({ changeUpdatePriority: event.target.value });
  };

  render() {
    const today = moment(new Date()).format("YYYY-MM-DD");
    return (
      <div className="App">
        <section>
          <nav>
            <ul>
              <li>
                <a href="#">London</a>
              </li>
              <li>
                <a href="#">Paris</a>
              </li>
              <li>
                <a href="#">Tokyo</a>
              </li>
            </ul>
          </nav>

          <article>
            <form onSubmit={this.handleAddNew}>
              <div className="leftSide">
                <table>
                  <tr>
                    <th colSpan="2" text-align="center">
                      New Task
                    </th>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <input
                        type="text"
                        id="titleTask"
                        className="titleTask"
                        name="titleTask"
                        placeholder="Add new task"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <p>
                        <b>Description</b>
                      </p>
                      <textarea
                        id="description"
                        name="description"
                        rows="7"
                        cols="40"
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <b>Due date</b>
                      </p>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        min={today}
                        defaultValue={today}
                        className="prioritySelect"
                      />
                    </td>
                    <td>
                      <p>
                        <b>Priority</b>
                      </p>
                      <select
                        name="priority"
                        id="priority"
                        defaultValue="normal"
                        onChange={this.handleChangeSelection}
                        className="prioritySelect"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <input type="submit" className="btnAdd" value="Add" />
                    </td>
                  </tr>
                </table>
              </div>
            </form>

            <div className="rightSide">
              <p className="titleUpdate"> To Do List</p>
              <p>
                <input
                  type="text"
                  id="search"
                  className="titleTaskRight"
                  name="fname"
                  placeholder="Search..."
                  onChange={this.hanldeSearch}
                />
              </p>
              <form onSubmit={this.handleUpdate}>
                <table className="displayDetailItem">
                  <tr className="subItemRow">
                    <td className="displaySubItem">
                      {this.state.id ? (
                        <>
                          <input
                            type="checkbox"
                            onChange={this.handleChange}
                            className="checkBox"
                            name="checkBox"
                            value={this.state.id}
                          />
                          <label className="titleName">
                            {this.state.titleTask}
                          </label>
                        </>
                      ) : null}
                    </td>
                    <td className="displaySubItem">
                      {this.state.id ? (
                        <div className="actionBtn">
                          <button
                            className="btnDetail"
                            onClick={this.handleDetail.bind(
                              this,
                              this.state.id
                            )}
                          >
                            Detail
                          </button>
                          <button
                            className="btnRemove"
                            onClick={this.handleRemove.bind(
                              this,
                              this.state.id
                            )}
                          >
                            Remove
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <input
                        type="text"
                        id="titleTask"
                        className="titleTask"
                        name="fname"
                        defaultValue={this.state.titleTask}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <p>
                        <b>Description</b>
                      </p>
                      <textarea
                        name="description"
                        defaultValue={this.state.description}
                        rows="7"
                        cols="40"
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <b>Due date</b>
                      </p>
                      <input
                        type="date"
                        id="start"
                        name="trip-start"
                        name="dueDate"
                        className="prioritySelect"
                        min={today}
                        defaultValue={this.state.dueDate}
                      />
                    </td>
                    <td>
                      <p>
                        <b>Priority</b>
                      </p>
                      <select
                        name="priority"
                        id="priority"
                        value={this.state.changeUpdatePriority}
                        onChange={this.handleChangeUpdateSelection}
                        className="prioritySelect"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <input
                        type="submit"
                        className="btnUpdate"
                        value="Update"
                      />
                    </td>
                  </tr>
                </table>
              </form>
              {this.state.dataSource && this.state.dataSource.length > 0
                ? this.state.dataSource.map((element, index) => {
                    return (
                      <>
                        {this.state.showElement !== element._id ? (
                          <table className="displayItem">
                            <tr>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={this.handleChange}
                                  className="checkBox"
                                  name="checkBox"
                                  value={element._id}
                                />
                                <label className="titleName">
                                  {element.taskTitle}
                                </label>
                              </td>
                              <td>
                                <div className="actionBtn">
                                  <button
                                    className="btnDetail"
                                    onClick={this.handleDetail.bind(
                                      this,
                                      element._id
                                    )}
                                  >
                                    Detail
                                  </button>
                                  <button
                                    className="btnRemove"
                                    onClick={this.handleRemove.bind(
                                      this,
                                      element._id
                                    )}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </table>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })
                : null}
              {this.state.isShowBulkAction === true ? (
              <div className="bulkAction">
                <p>
                  <label className="titleName">Bulk Action:</label>
                  <button className="btnDone" onClick={this.handleDetail}>
                    Done
                  </button>
                  <button
                    className="btnRemove"
                    onClick={this.handleCheckedCheckBox}
                  >
                    Remove
                  </button>
                </p>
              </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    );
  }
}

export default App;
