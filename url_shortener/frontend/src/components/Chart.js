import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useParams } from "react-router-dom";
const Dankmemes = () => {
  const [chartData, setChartData] = useState({});
  const { urlid } = useParams();
  

  const chart = () => {
    let urltime = [];
    //let urldata = [];
    const values = [1, 2, 3, 4,5,6,7];
    let ob=[]
    let cout=[]
    axios
      .get(`http://localhost:8080/stats/${urlid}`)
      .then(res => {
        console.log(res.data);
         
         // urltime.push(dataObj.TimeStamp);
          //urldata.push(parseInt(dataObj.employee_age));
         // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        //d.setUTCSeconds(urltime);
        ob=Object.keys(res.data)
        cout=Object.values(res.data)
        
        
        /*const map1=urltime.map(function(arr){
               
            var timestamp =  (new Date(parseInt(arr ))).toISOString();
            
            console.log(timestamp)
            return timestamp
          })
            console.log(map1)*/
            console.log(ob)
        setChartData({
             
            
          labels: ob ,

          datasets: [
            {
              label: "url usage",
              data:  cout,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log(urltime);
  };

  useEffect(() => {
    chart();
  }, []);

   
  return (
    <div className="col-md-7">
      <h1>Url usage</h1>
      <div  class=" d-flex justify-content-center">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            title: { text: "THICCNESS SCALE", display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 6,
                    beginAtZero: true
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                     
                  gridLines: {
                    display: false
                    
                  },
                  type: 'time',
                    time: {
                        unit: 'Day',
                        format: 'timeFormat'
                    }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dankmemes;