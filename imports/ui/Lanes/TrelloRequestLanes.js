import React from 'react';
import { Meteor } from 'meteor/meteor';
import Select from 'react-select';

export default class TrelloRequestLanes extends React.Component {
  
  componentDidMount() {
    Meteor.call('getAllBoards', (err, boards) => {
      if(err){
        this.setState({ boardOptions: [], showError: true })
        throw err;
      }
      let boardOptions = [];
      boards.forEach(board => boardOptions.push({
        value: board.id,
        label: board.name
      }));
      this.setState({ boardOptions });
    })
  }

  getBoardLanes(selected) {
    this.setState({ selectedBoard: selected, showLoading: true, typeSelections: [], orderSelections: {} });
    Meteor.call('getBoardLanes', selected.value, (err, lanes) => {
      if (err) {
        this.setState({ showLoading: false, showError: true, lanes: [], selectedBoard: '' });
        throw err;
      }
      const orderOptions = lanes.map((lane, index) => ({ value: index+1, label: index+1, disabled: false }));
      this.setState({ lanes, showLoading: false, orderOptions })
    })
  }

  clearOrders() {
    const orderOptions = this.state.orderOptions.map(selection => {
      selection.disabled = false;
      return selection;
    });

    this.setState({ orderOptions, orderSelections: {}, done: false })
  }

  clearTypes() {
    this.setState({ typeSelections: [], done: false })
  }

  submitLanes() {
    const laneUpdates = this.state.lanes.map((lane, index) => ({
      lane,
      type: this.state.typeSelections[index].value,
      order: this.state.orderSelections[index].value
    }));
    console.log('LANE UPDATES:', laneUpdates);
  }

  validateDone = () => {
    const typesAreCorrect = this.state.typeSelections.length === this.state.lanes.length && this.state.typeSelections.every(selection => !!selection);
    const orderKeys = Object.keys(this.state.orderSelections);
    const ordersAreCorrect = orderKeys.length === this.state.lanes.length;
    this.setState({ done: typesAreCorrect && ordersAreCorrect });
  }

  state = {
    boardOptions: [],
    selectedBoard: '',
    lanes: [],
    typeSelections: [],
    orderSelections: {},
    orderOptions: [],
    showLoading: false,
    showError: false,
    done: false
  }

  typeOptions = [
    {
      value: 'Not Started', label: 'Not Started'
    },
    {
      value: 'Backlog', label: 'Backlog'
    },
    {
      value: 'WIP', label: 'WIP'
    },
    {
      value: 'Done', label: 'Done'
    }
  ];

  render() {
    const { showLoading, showError, lanes, selectedBoard, boardOptions } = this.state;
    
    return (
      <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 text-center" id="lanes-input">
          <div className="dropdown">
            <Select
              value={selectedBoard}
              className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2"
              placeholder="Select Board..."
              options={boardOptions}
              onChange={this.getBoardLanes.bind(this)}
              isDisabled={!boardOptions.length}
            />
          </div>
          {showLoading && <div className="col-lg-12 text-center">Loading lanes...</div>}
          {showError && <div className="col-lg-12 text-center">An error occured while fetching board/lanes</div>}
          {!showLoading && !showError && !!lanes.length && (
            <>
            <table className="col-lg-12 lanes-table table table-striped">
              <thead className="table-headers">
                <tr>
                  <th className="col-lg-4 text-center">Name</th>
                  <th className="col-lg-3 col-lg-offset-1 text-center">Type</th>
                  <th className="col-lg-3 col-lg-offset-1 text-center">Order</th>
                </tr>
              </thead>
              <tbody>
                {lanes.map((lane, index) => (
                  <tr className="spacing-top" key={lane.id}>
                    <td className="col-lg-4 text-center lane-name">{lane.name}</td>
                    <td className="col-lg-3 col-lg-offset-1 text-center">
                      <Select
                        value={this.state.typeSelections[index] || ''}
                        placeholder="Select type"
                        options={this.typeOptions}
                        onChange={selected => {
                          const newTypeSelections = this.state.typeSelections;
                          newTypeSelections[index] = selected;
                          this.setState({ typeSelections: newTypeSelections });
                          this.validateDone();
                        }}
                      />
                    </td>
                    <td className="col-lg-3 col-lg-offset-1 text-center">
                      <Select
                        value={this.state.orderSelections[index] || ''}
                        placeholder="Select order"
                        options={this.state.orderOptions}
                        onChange={selected => {
                            const newOrderSelections = this.state.orderSelections;
                            newOrderSelections[index] = selected;
                            const orderOptions = this.state.orderOptions.map(option => {
                              option.disabled = Object.keys(newOrderSelections).some(
                                key => newOrderSelections[key] && newOrderSelections[key].value === option.value
                              )
                              return option;
                            });
                            this.setState({ orderSelections: { ...newOrderSelections }, orderOptions });
                            this.validateDone();
                          }
                        }
                        isOptionDisabled={option => option.disabled}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-lg-12 spacing-top spacing-bot">
              <div className="col-lg-3 col-lg-offset-5"><button onClick={this.clearTypes.bind(this)} className="btn btn-warning">Clear Type Selections</button></div>
              <div className="col-lg-3 col-lg-offset-1"><button onClick={this.clearOrders.bind(this)} className="btn btn-warning">Clear Order Selections</button></div>
            </div>
            <div className="col-lg-12 spacing-top spacing-bot">
              <div>
                <button
                  className="col-lg-3 col-lg-offset-5 btn btn-primary"
                  disabled={!this.state.done}
                  onClick={this.submitLanes.bind(this)}
                >
                  Update Lanes
                </button>
              </div>
            </div>
            </>
          )}
      </div>
    );
  };
};
