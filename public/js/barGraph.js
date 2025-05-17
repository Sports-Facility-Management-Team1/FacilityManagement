document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("monthSelect");  

  const chart = new ApexCharts(document.querySelector(".facility-bargraph"), {
  //const options = {
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
  });

  //const chart = new ApexCharts(document.querySelector("#bookingsChart"), options);
  chart.render();



  async function updateChart(month) {
    try {
      const response = await fetch(`https://sports-management.azurewebsites.net/api/bookings-per-facility?month=${month}`);
      const data = await response.json();

      const categories =  ['Soccer Field', 'Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall'];
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
  updateChart(monthSelect.value);

  // Update when month changes
  monthSelect.addEventListener('change', () => {
    updateChart(monthSelect.value);
  });



//End of DOMContentLoaded 
});