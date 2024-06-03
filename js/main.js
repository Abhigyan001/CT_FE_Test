function getElement(id) {
  return document.getElementById(id);
}

// Fetch Data

let username = "coalition";
let password = "skills-test";
let auth = btoa(`${username}:${password}`);
let ctx = getElement("bpChart");

fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
  headers: {
    Authorization: `Basic ${auth}`,
  },
})
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw response;
  })
  .then(function (data) {
    console.log(data);
    displayData(data);
    createChart(data);
  })
  .catch(function (error) {
    console.warn(error);
  });

function displayData(data) {
  getElement("name").innerHTML = data[3].name;
  getElement("date_of_birth").innerHTML = moment(
    data[3].date_of_birth,
    "MM/DD/YYYY"
  ).format("MMMM D, Y");
  getElement("gender").innerHTML = data[3].gender;
  getElement("phone_number").innerHTML = data[3].phone_number;
  getElement("emergency_contact").innerHTML = data[3].emergency_contact;
  getElement("insurance_type").innerHTML = data[3].insurance_type;
  getElement("respiratory_rate").innerHTML =
    data[3].diagnosis_history[0].respiratory_rate.value;
  getElement("respiratory_rate_level").innerHTML =
    data[3].diagnosis_history[0].respiratory_rate.levels;
  getElement("temp_value").innerHTML =
    data[3].diagnosis_history[0].temperature.value;
  getElement("temp_level").innerHTML =
    data[3].diagnosis_history[0].temperature.levels;
  getElement("heart_rate").innerHTML =
    data[3].diagnosis_history[0].heart_rate.value;
  getElement("heart_rate_level").innerHTML =
    data[3].diagnosis_history[0].heart_rate.levels;
  getElement("systolic_value").innerHTML =
    data[3].diagnosis_history[0].blood_pressure.systolic.value;
  getElement("systolic_level").innerHTML =
    data[3].diagnosis_history[0].blood_pressure.systolic.levels;
  getElement("diastolic_value").innerHTML =
    data[3].diagnosis_history[0].blood_pressure.diastolic.value;
  getElement("diastolic_level").innerHTML =
    data[3].diagnosis_history[0].blood_pressure.diastolic.levels;

  let diag_list = "";
  for (let i = 0; i < data[3].diagnostic_list.length; i++) {
    diag_list += `
        <tr>
          <td style="width: 35%">${data[3].diagnostic_list[i].name}</td>
          <td style="width: 50%">${data[3].diagnostic_list[i].description}</td>
          <td>${data[3].diagnostic_list[i].status}</td>
        </tr>
    `;
  }
  getElement("diagnosis_history").innerHTML = diag_list;

  let lab_list = "";
  for (let i = 0; i < data[3].lab_results.length; i++) {
    lab_list += `
        <li>
          <p>${data[3].lab_results[i]}</p>
          <img src="img/download.svg" alt="download" />
        </li>
    `;
  }
  getElement("lab-results").innerHTML = lab_list;

  let patient_list = "";
  for (let i = 0; i < data.length; i++) {
    patient_list += `
         <li>
            <img src="${data[i].profile_picture}" alt="profile-pic" style="width: 48px" />
            <div>
              <div>
                <p class="name">${data[i].name}</p>
                <p class="designation">${data[i].gender}, ${data[i].age}</p>
              </div>
              <img src="img/more_horiz.svg" alt="horizontal dropdown" />
            </div>
          </li>
    `;
  }
  getElement("patient-list").innerHTML = patient_list;
}

// Line Chart

function createChart(data) {
  const labels = data[3].diagnosis_history
    .slice(0, 6)
    .map((item) => {
      return `${item.month.substring(0, 3)}, ${item.year}`;
    })
    .reverse();

  const systolic_data = data[3].diagnosis_history
    .slice(0, 6)
    .map((item) => item.blood_pressure.systolic.value)
    .reverse();

  const diastolic_data = data[3].diagnosis_history
    .slice(0, 6)
    .map((item) => item.blood_pressure.diastolic.value)
    .reverse();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: systolic_data,
          borderWidth: 1,
          backgroundColor: "#e66fd2",
          borderColor: "#e66fd2",
          borderWidth: 2,
          pointBorderWidth: 6,
        },
        {
          data: diastolic_data,
          borderWidth: 1,
          backgroundColor: "#8c6fe6",
          borderColor: "#8c6fe6",
          borderWidth: 2,
          pointBorderWidth: 6,
        },
      ],
    },
    options: {
      tension: 0.5,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "black",
          },
        },
        y: {
          grid: {
            color: "lightgrey",
          },
          max: 180,
          min: 60,
          ticks: {
            stepSize: 20,
            color: "black",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  Chart.defaults.font.family = "Manrope";
}
