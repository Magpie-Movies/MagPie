function runRoute() {
  fetch(`http://localhost:3000/api/movies/search/id/1`)
  .then(response => response.json())
    .then(data => {
      console.log(data)
    document.getElementById("output").innerHTML = JSON.stringify(data, null, 4);

    //resize textarea height
    var txtArea = document.getElementById('output').scrollHeight;
    document.getElementById('output').setAttribute('style','height:'+txtArea+'px');  
    })
  };