// On window load fetch data and insert table in the page
window.onload = function initStatistics() {
  getUsersStatisticsFromServer();
  getBurnRateFromServer();
};

// fetching data for the table from the server
const getUsersStatisticsFromServer = () => {
  let userStatisticsReq = new XMLHttpRequest();
  let userData;
  userStatisticsReq.onload = () => {
    userData = JSON.parse(userStatisticsReq.responseText);
    tab(userData);
  };
  userStatisticsReq.open("GET", "http://localhost:9772/getUsersStatistics");
  userStatisticsReq.send();
};

const getBurnRateFromServer = () => {
  let burnRateReq = new XMLHttpRequest();
  let data;
  burnRateReq.onload = () => {
    data = JSON.parse(burnRateReq.responseText);
    console.log(data);
    chart(data);
  };
  burnRateReq.open("GET", "http://localhost:9772/getBurnRate");
  burnRateReq.send();
};

// creating the table and placing it on the page
const tab = (data) => {
  console.log(data);
  new gridjs.Grid({
    columns: [
      "User",
      "Open tickets",
      "Closed tickets",
      "Percentage of tickets open",
      "Avg. time of tickets open",
    ],
    data: data,
    pagination: { limit: 5 },
    sort: true,
    search: true,
  }).render(document.getElementById("table"));
};

const chart = (data) => {
  var ctx = document.getElementById("myChart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Days",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Number of tickets",
            },
          },
        ],
      },
    },
    data: {
      labels: data[0][0],
      xAxisID: "days",
      yAxisID: "tickets",
      datasets: [
        {
          data: data[0][1],
          backgroundColor: "red",
          borderWidth: 4,
          fill: "1",
          label: "Created tickets",
          lineTension: 0,
        },
        {
          data: data[1][1],
          //   backgroundColor: "grey",
          borderColor: "green",
          borderWidth: 4,
          fill: "origin",
          label: "Closed tickets",
          lineTension: 0,
        },
      ],
    },
  });
};
