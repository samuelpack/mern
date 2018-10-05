import IssueAdd from './IssueAdd.jsx';
const contentNode = document.getElementById('contents');

class IssueFilter extends React.Component {
  render() {
    return React.createElement("div", null, "This is a placeholder for the Issue Filter.");
  }

}

const IssueRow = props => React.createElement("tr", null, React.createElement("td", null, props.issue._id), React.createElement("td", null, props.issue.status), React.createElement("td", null, props.issue.owner), React.createElement("td", null, props.issue.created.toDateString()), React.createElement("td", null, props.issue.effort), React.createElement("td", null, props.issue.completionDate ? props.issue.completionDate.toDateString() : ''), React.createElement("td", null, props.issue.title));

function IssueTable(props) {
  const issueRows = props.issues.map(issue => React.createElement(IssueRow, {
    key: issue._id,
    issue: issue
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Id"), React.createElement("th", null, "Status"), React.createElement("th", null, "Owner"), React.createElement("th", null, "Created"), React.createElement("th", null, "Effort"), React.createElement("th", null, "Completion Date"), React.createElement("th", null, "Title"))), React.createElement("tbody", null, issueRows));
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/issues').then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('Total count of records:', data._metadata.total_count);
          data.records.forEach(issue => {
            issue.created = new Date(issue.created);
            if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
          });
          this.setState({
            issues: data.records
          });
        });
      } else {
        response.json().then(error => {
          alert('Failed to fetch issues:' + error.message);
        });
      }
    }).catch(err => {
      alert('Error in fetching data from server:', err);
    });
  }

  createIssue(newIssue) {
    fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newIssue)
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedIssue => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          const newIssues = this.state.issues.concat(updatedIssue);
          this.setState({
            issues: newIssues
          });
        });
      } else {
        response.json().then(error => {
          alert('Failed to add issue: ' + error.message);
        });
      }
    }).catch(err => {
      alert('Error in sending data to server: ' + err.message);
    });
  }

  render() {
    return React.createElement("div", null, React.createElement("h1", null, "Issue Tracker"), React.createElement(IssueFilter, null), React.createElement("hr", null), React.createElement(IssueTable, {
      issues: this.state.issues
    }), React.createElement("hr", null), React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }

}

ReactDOM.render(React.createElement(IssueList, null), contentNode); // Render the component inside the content Node