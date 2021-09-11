import React, { useState, useEffect } from "react";
import moment from 'moment';
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { Button} from 'react-bootstrap'
//import { Trash } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import One from './One'
const Dankmemes = () => {
  const [chartData, setChartData] = useState({});
  const [datearry, setDatarry]=useState([])
  const { urlid } = useParams();
   
  let ob=[]
  let cout=[]
  let days=[]
  let hours=[]
    let coutof=[]
   let  weekd=[]
   let  weekdcount=[]
    const weekhit=[]
  const hitCountByDate = {};
  const dayhit={}
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
         setDatarry(res.data)
         console.log( datearry)
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
for (const row of timearry) {  
  
  const dayString =  new Date(row).toLocaleDateString();  
  //dayString.toLocaleDateString(row.TimeStamp ) 
   
  if (dayString in hitCountByDate) {  
      hitCountByDate[dayString]++;
  } else { // first time we've seen this day in the data
      hitCountByDate[dayString] = 1;
  }
}
ob=Object.keys(hitCountByDate)
cout=Object.values(hitCountByDate)
        setChartData({
             
            
          labels: ob ,

          datasets: [
            {
              label: "all usage",
              data:  cout,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
        someFunction()
        const underonarrys=checkonday(timearry)
        for(var i = 0; i < underonarrys.length; i++){  
          let day=underonarrys[i] 
          //let stday=day.format(' h:mm:ss a'); 
          var roundDown = day.startOf('hour');
          const dayString =  roundDown.format('h:mm A')  
          //dayString.toLocaleDateString(row.TimeStamp ) 
           
          if (dayString in dayhit) {  
              dayhit[dayString]++;
          } else {  
              dayhit[dayString] = 1;
          }
      }
      days=Object.keys(dayhit)
    coutof=Object.values(dayhit)
     const updateHandler = () => {
          setChartData({
            labels: days ,

          datasets: [
            {
              label: "all usage",
              data:  coutof,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]

          })
            
        };
        
      })
      .catch(err => {
        console.log(err);
      });
   // console.log(urltime);
  };
  let min=datearry[0]
  let max=datearry[0]
  
  for (let i = 0; i < datearry.length; i++) {
      const element = datearry[i];
      if (element>max){
          max=element
      }
      if (element<min){
          min=element
      }
      
  }
    
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
console.log(getDates(min, max))      
for (const row of  datearry) {  
  
  const dayString =  new Date(row).toLocaleDateString();  
  //dayString.toLocaleDateString(row.TimeStamp ) 
   
  if (dayString in hitCountByDate) {  
      hitCountByDate[dayString]++;
  } else { // first time we've seen this day in the data
      hitCountByDate[dayString] = 1;
  }
}
ob=Object.keys(hitCountByDate)
cout=Object.values(hitCountByDate)
const all = () => {
        setChartData({
             
            
          labels: ob ,

          datasets: [
            {
              label: "all usage",
              data:  cout,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
      }
const someFunction = () => {
  //var items = []
  let currentDate = moment();
  var roundDowns = currentDate.startOf('hour');
  new Array(24).fill().map((acc, index) => {
    dayhit[(roundDowns.format('h:mm A'))]=0
    roundDowns = roundDowns.subtract(60, 'minutes');
  })
  return dayhit
}
someFunction()
console.log(dayhit)
const checkonday=(array)=>{
  var twoharry=[]
  for(var i = 0; i < array.length; i++){
      let days = moment().diff(moment(array[i]), 'days'); 
      if (days==0) {
          var day = moment.unix(array[i]/1000);
          twoharry.push(day)
      }
}
 return twoharry  

}
const underonarrys=checkonday(datearry)
console.log(underonarrys)
for(var i = 0; i < underonarrys.length; i++){  
  let day=underonarrys[i] 
  //let stday=day.format(' h:mm:ss a'); 
  var roundDown = day.startOf('hour');
  const dayString =  roundDown.format('h:mm A')  
  //dayString.toLocaleDateString(row.TimeStamp ) 
   
  if (dayString in dayhit) {  
      dayhit[dayString]++;
  } else {  
      dayhit[dayString] = 1;
  }
}
hours=Object.keys(dayhit)
const reversedhours = hours.reverse();
coutof=Object.values(dayhit)
const revercount=coutof.reverse();
const updateHandler = () => {
  setChartData({
    labels: reversedhours ,

  datasets: [
    {
      label: "last 24hour",
      data:  coutof,
      backgroundColor: ["rgba(75, 192, 192, 0.6)"],
      borderWidth: 4
    }
  ]
   

  })
    
};
var REFERENCE = moment();
  var A_WEEK_OLD = REFERENCE.clone().subtract(6, 'days').startOf('day');   
  const isWithinAWeek=(arrydatas) =>{
    let isinweek=[]
    //return momentDate.isAfter(A_WEEK_OLD);
    for(var i = 0; i < arrydatas.length; i++){
      let data=moment.unix( arrydatas[i]/1000)
      let inaweek= data.isAfter(A_WEEK_OLD)
    if (inaweek==true){
      isinweek.push(moment.unix( data/1000))
    }
     
  } 
  return isinweek
}  
const current = moment()
      let resultDates=[]
      let n=8
      while(n>0){
          console.log(n)
          weekhit[(current.format("dddd"))]=0
          current.subtract(1,"day")
          n--;
          
      }
      console.log(isWithinAWeek( datearry))
    const oneweekday=isWithinAWeek(datearry)
    for(var i = 0; i < oneweekday.length; i++){  
      let day=oneweekday[i] 
      //let stday=day.format(' h:mm:ss a'); 
      //var roundDown = day.startOf('hour');
      const dayString =  day.format('dddd')  
      if (dayString in weekhit) {  
        weekhit[dayString]++;
    } else {  
        weekhit[dayString] = 1;
    }
  }
       
  weekd=Object.keys(weekhit)
  const reversedweekd = weekd.reverse();
  weekdcount=Object.values(weekhit)
  const reversedweekcount = weekdcount.reverse();
  const pastweek = () => {
    setChartData({
      labels: reversedweekd ,
  
    datasets: [
      {
        label: "past week",
        data:  reversedweekcount,
        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
        borderWidth: 3
      }
    ]
    
  
    })
      
  };
  //number=Object.values(hitCountByDate)
  Object.values(hitCountByDate).forEach(val => {
    let cout=0
     cout=cout+val
  });
  console.log(cout)
  const number=cout
  let realc;
  for (var x=0;x<number.labels;x++ ){
    let realc=0
      realc=realc+number[x]
  }
  console.log(realc)
  let objary=Object.values(hitCountByDate)
  console.log(objary)
  let realm=0
  for(var i = 0; i < objary.length; i++){
     //realm=0
      realm=realm+objary[i]
  }
  console.log(realm)
/*const someFunction = () => {
  //var items = []
  let currentDate = moment('12');
  new Array(24).fill().map((acc, index) => {
    dayhit[(currentDate.format('h:mm A'))]=0
    currentDate = currentDate.add(60, 'minutes');
  })
  return dayhit
}
const checkonday=(array)=>{
  var twoharry=[]
  for(var i = 0; i < array.length; i++){
      let days = moment().diff(moment(array[i]), 'days'); 
      if (days==0) {
          var day = moment.unix(array[i]/1000);
          twoharry.push(day)
      }
}
 return twoharry  

}*/

  useEffect(() => {
    chart();
     
  }, []);

   
  return (
    <div className="col-md-7">
      <h1>Url usage</h1>
      <div  class=" d-flex justify-content-center"style={{padding:'10px', marginLeft:'55px'}}>
        <Bar
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
      <div class=" d-flex justify-content-center"> 
      <Button onClick={ all}>
          all
        </Button>
      <Button onClick={() => updateHandler()}>
          Past 24 hours
        </Button>

        <Button onClick={() => pastweek()}>
          Past week
        </Button>
        </div>
        <br></br>
        <div class="card text-center bg-success text-white">
          <br></br>
  <div class="card-header">
    Number of time used 
  </div>
  <div class="card-body">
     
    <p class="card-text">{realm}</p>
     
  </div>
   
</div>
    </div>
  );
};

export default Dankmemes;