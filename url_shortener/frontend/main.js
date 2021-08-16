const urllist=document.getElementById('urllist') 
let output="";
 
    fetch('http://localhost:8080/list', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (response.ok) {
          console.log(response.json);
          return response.json();
        }
        return Promise.reject(response);
      })

      .then(function (responseJSON) {
        console.log(responseJSON);
        //let urllist=document.getElementById('urlist') 
        //let output='';
        responseJSON.forEach(element => {
          console.log(element)
          output+=`<div>
      <br></br>
      <Table class="table table-striped">
        <thead>
          <tr>
             
            <th scope="col">Long url</th>
            <th scope="col">Short url</th>
          </tr>
        </thead>
        <tbody>
                <tr>
                 
                  <td>${element.longUrl}</td>
                  <td>${element.shortUrl}
                    
                  </td>
                </tr>
              
            
        </tbody>
      </Table>
      </div>`;

        });
         
        urllist.innerHTML=output;
      })
      .catch(error => {
        console.log(error)
      })
  