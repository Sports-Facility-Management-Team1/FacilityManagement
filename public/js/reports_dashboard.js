import {loadActiveUsers} from './active_users.js';
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getPieChartData } from './piechart_issues.js';
import { getBookingsData } from './linegraph_bookings.js';
import { totalUsers,getTotalUsers } from './tot_users.js';
import { totalReports,no } from './issuesreport.js';
import { getMonthlyIssueData} from './issuesBargraph.js';

document.addEventListener("DOMContentLoaded",async function () {
  await getTotalUsers()
  var options = {
    chart: {
      type: 'radialBar',
      height: 250
    },
    series: [100],
    labels: ['Users'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
          },
          value: {
            fontSize: '25px',
          },
          total: {
            show: true,
            label: 'Total Users ',
            formatter: function () {
              return totalUsers.toString(); 
            }
          }
        }
      }
    }
  };

  var chart = new ApexCharts(document.querySelector("#tot_users"), options);
  chart.render();
});

document.addEventListener("DOMContentLoaded",async function () {
  // document.querySelector("#main-heading")
  await totalReports();
  document.getElementById("main-heading").textContent = no;
})
 document.addEventListener("DOMContentLoaded", async function () {
      const stats=await loadActiveUsers();
      const weekly=(stats.lastWeek/stats.totalUsers)*100;
      const monthly=(stats.lastMonth/stats.totalUsers)*100;
      const activeCard=document.querySelector("#median-ratio");
     
      document.getElementById("week-count").textContent = `Last week: ${stats.lastWeek}`;
      document.getElementById("month-count").textContent = `Last month: ${stats.lastMonth}`;
       var options = {
          series: [weekly],
          chart: {
          color:"red",
          height: 250,
          type: 'radialBar',
          offsetY: -30
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            color:"blue",
            dataLabels: {
              name: {
                fontSize: '16px',
                color: "blue",
                offsetY: 120
              },
              value: {
                offsetY: 76,
                fontSize: '22px',
                color: "blue",
                formatter: function (val) {
                  return val + "%";
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
              shade: 'dark',
              shadeIntensity: 0.9,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 0.7,
              stops: [0, 50, 30, 9]
          },
        },
        stroke: {
          dashArray: 4
        },
        labels: ['Active users'],
        };

        var chart = new ApexCharts(activeCard, options);
        chart.render();
});


//------------------------MY_FRONTEND-------------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
  const monthSelect = document.getElementById("monthSelect");
  var options = {
    chart: {
      height: 300,
      type: 'bar',
    },
    series: [{name: 'Bookings', data: []}],
    annotations: {
      points: [{
        x: 'Bananas',
        seriesIndex: 0,
        label: {
          borderColor: '#775DD0',
          offsetY: 0,
          style: {
            color: '#fff',
            background: '#775DD0',
          },
          text: 'Bananas are good',
        }
      }]
    },
    // chart: {
    //   height: 350,
    //   type: 'bar',
    // },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '50%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 0
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: ['Soccer Field', 'Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall'],
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Bookings',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    }
  };

  //var chart = new ApexCharts(document.querySelector(".facility-bargraph"), options);
  var chart = new ApexCharts(document.querySelector("#bookingsChart"), options);
  chart.render();

   async function updateChart(month) {
    try {
      const response = await fetch(`https://sports-management.azurewebsites.net/api/bookings-per-facility?month=${month}`);
      const data = await response.json();
      const categories =  ['Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall', 'Soccer Field'];
      const counts = Object.values(data);
      

      chart.updateOptions({
        xaxis: { categories },
        series: [{ name: 'Bookings', data: counts }]
      });
    } catch (error) {
      console.error("Error loading chart data:", error);
    }
  }


  // Load default on page load
  updateChart(monthSelect);

  // Update when month changes
  monthSelect.addEventListener('change', () => {
    updateChart(monthSelect.value);
  });


});



//--------------------------------------------------------------------------------//

// document.addEventListener("DOMContentLoaded", () => {
//   const monthSelect = document.getElementById("monthSelect");  
//  //#bookingsChart
//  //.facility-bargraph
//   const chart = new ApexCharts(document.querySelector("#bookingsChart"), {
//   //const options = {
//     chart: {
//       height: 300,
//       type: 'bar',
//     },
//     series: [{name: 'Bookings', data: []}],
//     annotations: {
//       points: [{
//         x: 'Bananas',
//         seriesIndex: 0,
//         label: {
//           borderColor: '#775DD0',
//           offsetY: 0,
//           style: {
//             color: '#fff',
//             background: '#775DD0',
//           },
//           text: 'Bananas are good',
//         }
//       }]
//     },
//     // chart: {
//     //   height: 350,
//     //   type: 'bar',
//     // },
//     plotOptions: {
//       bar: {
//         borderRadius: 10,
//         columnWidth: '50%',
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       width: 0
//     },
//     grid: {
//       row: {
//         colors: ['#fff', '#f2f2f2']
//       }
//     },
//     xaxis: {
//       labels: {
//         rotate: -45
//       },
//       categories: ['Soccer Field', 'Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall'],
//       tickPlacement: 'on'
//     },
//     yaxis: {
//       title: {
//         text: 'Bookings',
//       },
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shade: 'light',
//         type: "horizontal",
//         shadeIntensity: 0.25,
//         gradientToColors: undefined,
//         inverseColors: true,
//         opacityFrom: 0.85,
//         opacityTo: 0.85,
//         stops: [50, 0, 100]
//       },
//     }
//   });

//   //const chart = new ApexCharts(document.querySelector("#bookingsChart"), options);
//   chart.render();



//   async function updateChart(month) {
//     try {
//       const response = await fetch(`https://sports-management.azurewebsites.net/api/bookings-per-facility?month=${month}`);
//       const data = await response.json();

//       const categories =  ['Soccer Field', 'Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall'];
//       const counts = Object.values(data);

//       chart.updateOptions({
//         xaxis: { categories },
//         series: [{ name: 'Bookings', data: counts }]
//       });
//     } catch (error) {
//       console.error("Error loading chart data:", error);
//     }
//   }


//   // Load default on page load
//   updateChart(monthSelect.value);

//   // Update when month changes
//   monthSelect.addEventListener('change', () => {
//     updateChart(monthSelect.value);
//   });



// //End of DOMContentLoaded 
// });



document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const pieData = await getPieChartData();

        const options = {
          chart: {
            type: 'pie',
            height: 350,
          },
          series: pieData.series,
          labels: pieData.labels,
          colors: ['#00E396', '#FF4560']
        };

        new ApexCharts(document.querySelector(".piechart"), options).render();
      } catch (error) {
        console.error("Pie chart failed:", error);
        document.querySelector(".piechart").textContent = "Could not load data";
      }
    } else {
      console.warn("User not logged in yet");
      document.querySelector(".piechart").textContent = "Please log in to view data";
    }
  });
});



document.addEventListener("DOMContentLoaded", async function () {
  try {
    const monthlyData = await getBookingsData();

    const options = {
      series: [{
        name: "Bookings",
        data: monthlyData
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      title: {
        text: 'Overall Bookings per Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    };

    const chart = new ApexCharts(document.querySelector(".line-graph"), options);
    chart.render();

  } catch (err) {
    console.error("Error rendering chart:", err);
  }
});


document.addEventListener("DOMContentLoaded", async function () {
  
  const { solvedIssues, unsolvedIssues } = await getMonthlyIssueData();

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [
      {
        name: 'Solved',
        data: solvedIssues
      },
      {
        name: 'Unsolved',
        data: unsolvedIssues
      }
    ],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',  
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: val => val + " issues"
      }
    }
  };

  var chart = new ApexCharts(document.querySelector("#months_bar"), options);
  chart.render();
});