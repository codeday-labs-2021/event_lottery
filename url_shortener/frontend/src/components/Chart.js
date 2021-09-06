import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useParams } from "react-router-dom";

const Dankmemes = () => {
  const [chartData, setChartData] = useState({});
  const { urlid } = useParams();
  
  const hitCountByDate = {};
  const chart = () => {
    let timearry = [];
    //let urldata = [];
    const values = [1, 2, 3, 4,5,6,7];
    let ob=[]
    let cout=[]
    axios
      .get(`http://localhost:8080/stats/${urlid}`)
      .then(res => {
        console.log(res.data);
         timearry=(res.data)
         console.log(timearry)
         // urltime.push(dataObj.TimeStamp);
          //urldata.push(parseInt(dataObj.employee_age));
         // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        //d.setUTCSeconds(urltime);
        //ob=Object.keys(res.data)
        //cout=Object.values(res.data)
        let min=timearry[0]
let max=timearry[0]

for (let i = 0; i < timearry.length; i++) {
    const element = timearry[i];
    if (element>max){
        max=element
    }
    if (element<min){
        min=element
    }
    
}
console.log("min" +min)        
        
console.log(getDates(min, max))      
for (const row of timearry) { // Taking each row from the database.

  // Convert the timestamp into some standard format for the day (rather than the exact time)
  const dayString =  new Date(row).toLocaleDateString(); // The 0 there is the key, which sets the date to the epoch
  //dayString.toLocaleDateString(row.TimeStamp ) 
  // Count it in the hitCountByDate object
  if (dayString in hitCountByDate) { // We've already seen this day, so this is yet another click on this date to be recorded.
      hitCountByDate[dayString]++;
  } else { // This is the first time we've seen this day in the data, so this is the first click on the date to be recorded.
      hitCountByDate[dayString] = 1;
  }
}
ob=Object.keys(hitCountByDate)
cout=Object.values(hitCountByDate)
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
   // console.log(urltime);
  };
  const getDates = (from, to) => {
    const cFrom = new Date(from);
    const cTo = new Date(to);

    //let daysArr = new Date(cFrom).toLocaleDateString();
    let tempDate = cFrom;
    //const tru= hitCountByDate[new Date(tempDate).toLocaleDateString()]
    while (tempDate <= cTo    ) {
        //hitCountByDate[new Date(tempDate).toLocaleDateString()] = 0
      // tempDate.setUTCDate(tempDate.getUTCDate() + 1);
      if (   new Date(tempDate).toLocaleDateString() in hitCountByDate){
         
          tempDate.setUTCDate(tempDate.getUTCDate() + 1);
      }else{
      
       hitCountByDate[new Date(tempDate).toLocaleDateString()] = 0
      }
        // tempDate.setUTCDate(tempDate.getUTCDate() + 1);
        //tempDate.setUTCDate(tempDate.getUTCDate() + 1);
      
        //daysArr.push(new Date(tempDate).toLocaleDateString());
         
       
    }
    

    return hitCountByDate;
}
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