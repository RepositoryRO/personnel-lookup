// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDhJyt2XmM3muuKaqEfvnJwREJmI4Sx4vM",
   authDomain: "fro-repository.firebaseapp.com",
   projectId: "fro-repository",
   storageBucket: "fro-repository.firebasestorage.app",
   messagingSenderId: "510196181148",
   appId: "1:510196181148:web:3b78fc796c293fe91ea559",
   measurementId: "G-LBVVG4RV2J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.onload = () => {
  // Load dropdowns from Firebase
  db.ref("circles").once("value", snapshot => {
    const circles = snapshot.val();
    const circleSelect = document.getElementById("circle");

    for (let c in circles) {
      let opt = document.createElement("option");
      opt.value = c;
      opt.text = c;
      circleSelect.appendChild(opt);
    }

    circleSelect.onchange = () => {
      document.getElementById("division").innerHTML = `<option value="">Select Division</option>`;
      document.getElementById("range").innerHTML = `<option value="">Select Range</option>`;
      const divisions = circles[circleSelect.value]?.divisions || {};
      for (let d in divisions) {
        let opt = document.createElement("option");
        opt.value = d;
        opt.text = d;
        document.getElementById("division").appendChild(opt);
      }

      document.getElementById("division").onchange = () => {
        document.getElementById("range").innerHTML = `<option value="">Select Range</option>`;
        const ranges = divisions[document.getElementById("division").value]?.ranges || {};
        for (let r in ranges) {
          let opt = document.createElement("option");
          opt.value = r;
          opt.text = r;
          document.getElementById("range").appendChild(opt);
        }
      };
    };
  });
};

function searchPerson() {
  const circle = document.getElementById("circle").value;
  const division = document.getElementById("division").value;
  const range = document.getElementById("range").value;

  if (!circle || !division || !range) {
    alert("Please select all fields");
    return;
  }

  const refPath = `personnel/${circle}/${division}/${range}`;
  db.ref(refPath).once("value", snapshot => {
    const data = snapshot.val();
    if (!data) {
      document.getElementById("result").innerHTML = `<p>No data found</p>`;
      return;
    }

    document.getElementById("result").innerHTML = `
      <img src="${data.photo}" alt="Person Photo" />
      <table>
        <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Contact:</strong></td><td>${data.contact}</td></tr>
        <tr><td><strong>Current Posting:</strong></td><td>${data.posting}</td></tr>
      </table>
    `;
  });
}
