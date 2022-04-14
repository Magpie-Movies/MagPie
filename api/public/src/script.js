function runRoute() {
  const route = document.getElementById("routes").value;
  fetch(`http://localhost:3000/${route}/`)
  .then(response => response.json())
    .then(data => {
      console.log(data)
    document.getElementById("output").innerHTML = JSON.stringify(data);
    })
  };