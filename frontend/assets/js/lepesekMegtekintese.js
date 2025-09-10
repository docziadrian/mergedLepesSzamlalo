let stepsChart = null;
let currentChartType = "line";
let sampleData = {
  dates: [
    "2024-01-08",
    "2024-01-09",
    "2024-01-10",
    "2024-01-11",
    "2024-01-12",
    "2024-01-13",
    "2024-01-14",
  ],
  steps: [8500, 9200, 7800, 10500, 12300, 6800, 12300],
  average: [8200, 8300, 8100, 8500, 8900, 8100, 8500],
};

document.addEventListener("DOMContentLoaded", function () {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  document.getElementById("startDate").valueAsDate = startDate;
  document.getElementById("endDate").valueAsDate = endDate;
  initializeChart();
  loadData();
});

function showTableView() {
  document.getElementById("tableView").style.display = "block";
  document.getElementById("chartView").style.display = "none";
  document.getElementById("tableViewBtn").classList.add("active");
  document.getElementById("chartViewBtn").classList.remove("active");
}

function showChartView() {
  document.getElementById("tableView").style.display = "none";
  document.getElementById("chartView").style.display = "block";
  document.getElementById("tableViewBtn").classList.remove("active");
  document.getElementById("chartViewBtn").classList.add("active");

  const xValues = sampleData.dates;

  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          data: sampleData.steps,
          borderColor: "green",
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
}

function setDateRange(range) {
  const endDate = new Date();
  const startDate = new Date();

  switch (range) {
    case "today":
      startDate.setDate(endDate.getDate());
      break;
    case "week":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "all":
      startDate.setFullYear(2024, 0, 1);
      break;
  }

  document.getElementById("startDate").valueAsDate = startDate;
  document.getElementById("endDate").valueAsDate = endDate;

  filterData();
}

function filterData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  loadData();
}

function loadData() {
  updateStatistics();
  updateTable();
  updateChart();
}

function updateStatistics(sampleData) {
  const totalSteps = sampleData.steps.reduce((sum, steps) => sum + steps, 0);
  const activeDays = sampleData.steps.filter((steps) => steps > 0).length;
  const averageSteps = Math.round(totalSteps / activeDays);
  const bestDay = Math.max(...sampleData.steps);

  document.getElementById("totalSteps").textContent =
    totalSteps.toLocaleString();
  document.getElementById("activeDays").textContent = activeDays;
  document.getElementById("averageSteps").textContent =
    averageSteps.toLocaleString();
  document.getElementById("bestDay").textContent = bestDay.toLocaleString();
}

function updateTable(sampleData) {
  const tbody = document.getElementById("stepsTableBody");
  tbody.innerHTML = "";

  sampleData.dates.forEach((date, index) => {
    const steps = sampleData.steps[index];
    const avg = sampleData.average[index];

    const row = `
            <tr>
                <td>${date}</td>
                <td><span class="badge bg-primary fs-6">${steps.toLocaleString()}</span></td>
                <td>${avg.toLocaleString()}</td>
              
                
            </tr>
        `;
    tbody.innerHTML += row;
  });
}

function initializeChart() {
  const ctx = document.getElementById("stepsChart").getContext("2d");

  stepsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: sampleData.dates.map((date) =>
        new Date(date).toLocaleDateString("hu-HU")
      ),
      datasets: [
        {
          label: "Lépések",
          data: sampleData.steps,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Átlag",
          data: sampleData.average,
          borderColor: "#f093fb",
          backgroundColor: "rgba(240, 147, 251, 0.1)",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          borderDash: [5, 5],
          pointBackgroundColor: "#f093fb",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#667eea",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return (
                context.dataset.label +
                ": " +
                context.parsed.y.toLocaleString() +
                " lépés"
              );
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return value.toLocaleString();
            },
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
}

function updateChart() {
  if (stepsChart) {
    stepsChart.data.labels = sampleData.dates.map((date) =>
      new Date(date).toLocaleDateString("hu-HU")
    );
    stepsChart.data.datasets[0].data = sampleData.steps;
    stepsChart.data.datasets[1].data = sampleData.average;
    stepsChart.update();
  }
}

function changeChartType(type) {
  currentChartType = type;

  if (stepsChart) {
    let chartConfig = {
      type: type,
      data: stepsChart.data,
      options: stepsChart.options,
    };

    if (type === "area") {
      chartConfig.data.datasets[0].fill = true;
      chartConfig.data.datasets[0].backgroundColor = "rgba(102, 126, 234, 0.3)";
      chartConfig.data.datasets[1].fill = true;
      chartConfig.data.datasets[1].backgroundColor = "rgba(240, 147, 251, 0.3)";
    } else {
      chartConfig.data.datasets[0].fill = false;
      chartConfig.data.datasets[1].fill = false;
    }

    stepsChart.destroy();
    stepsChart = new Chart(
      document.getElementById("stepsChart").getContext("2d")
      //chartConfig
    );
  }
}

function exportData(format) {
  alert(`${format.toUpperCase()} export funkció hamarosan elérhető!`);
}

async function getDatas() {
  const userID = 7;
  const response = await fetch(
    `http://127.0.0.1:3000/user/getSteps/${userID}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    console.error("Fetch failed");
    return;
  }

  const Predata = await response.json();
  const data = Predata.message;

  let datesData = [];
  let stepsData = [];
  let averageData = [];

  const userStepsSplitted = data.userStepInfos.split(";");

  for (const element of userStepsSplitted) {
    try {
      const datums = element.split(",")[0].split(",");
      const steps = element.split(",")[1].split(",");

      datesData.push(...datums);
      stepsData.push(...steps);
      averageData.push(...steps.map((s) => Math.round(parseInt(s) * 0.9)));
    } catch {
      console.log("Hiba");
    }
  }

  sampleData = {
    dates: datesData,
    steps: stepsData,
    average: averageData,
  };

  updateTable(sampleData);
}
