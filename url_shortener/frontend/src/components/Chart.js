import React, { useState, useEffect } from "react";
import moment from 'moment';
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { Button, ButtonToolbar,Row,Container,Col,Dropdown,DropdownButton} from 'react-bootstrap'
//import { Trash } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
//import One from './One'
const Dankmemes = () => {
  var now =moment().format('M')
  var years=moment().format('YYYY')
  const [value,setValue]=useState(now);
  const [year, setYear]=useState(years)
   
  const yearndat=year+"/"+value;
  
  const handleYear=(e)=>{
    console.log(e);
    setYear(e)
  }
  const handleSelect=(e)=>{
    console.log(e);
    setValue(e)
  }
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
//get data for bast week
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
//create days in days format 
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
//get dates based on month and year selected
let objec={}
  function getAllDatesOfMonth(date) {
    const mDate = moment(date, "YYYY-MM");
     
    const daysCount = mDate.daysInMonth();
    return Array(daysCount).fill(null).map((v,index)=>{
        const addDays = index === 0 ? 0 : 1;
        return objec[mDate.add(addDays, 'days').format('M/D/YYYY')]=0;
    });
}
console.log(getAllDatesOfMonth(yearndat ))
 //let montharry=getAllDatesOfMonth(yearndat )

 var inmonth=[]
for(var i = 0; i < datearry.length; i++){
  let formatdata=moment.unix(datearry[i]/1000).format('M/D/YYYY') 
   
let check=moment(formatdata).isSame(yearndat, 'month')
console.log(check)
if(check==true){
  inmonth.push(formatdata)
}else{
  continue
}

}
for (const row of  inmonth) {  
  
  const dayString =  new Date(row).toLocaleDateString();  
  //dayString.toLocaleDateString(row.TimeStamp ) 
   console.log(dayString)
  if (dayString in objec) {  
      objec[dayString]++;
  } else { // first time we've seen this day in the data
      objec[dayString] = 1;
  }
}
console.log(objec)
const monthday=Object.keys(objec)
 
 const dmcount=Object.values(objec)
 let currentDates = moment(value).format('MMMM');
 console.log(currentDates)
const byMonth = () => {
  setChartData({
    labels: monthday ,

  datasets: [
    {
      label: "Month of "+currentDates,
      data:  dmcount,
      backgroundColor: ["rgba(75, 192, 192, 0.6)"],
      borderWidth: 3
    }
  ]
  

  })
    
};

  useEffect(() => {
    chart();
     
  }, []);

   
  return (
    <div className="app">
      <h1>Url usage</h1>
      <Container >
        <Row>
          <Col xs={10}> 
        
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
        
        </Col> 
        <Col xs={1}>
        <DropdownButton
        alignRight
        title=" Select Year"
        size="sm"
        id="dropdown-menu-align-right"
         onSelect={handleYear}
          >
                <Dropdown.Item eventKey="2021">2021 </Dropdown.Item>
                <Dropdown.Item eventKey="2022">2022</Dropdown.Item>
                 
                 
        </DropdownButton>
        </Col>
        <Col xs={1}>
        <DropdownButton
        alignRight
        title="Select Month"
        id="dropdown-menu-align-right"
        size="sm"
        onSelect={handleSelect}
          >
                <Dropdown.Item eventKey="1">1</Dropdown.Item>
                <Dropdown.Item eventKey="2">2</Dropdown.Item>
                <Dropdown.Item eventKey="3">3</Dropdown.Item>
                <Dropdown.Item eventKey="4">4</Dropdown.Item>
                <Dropdown.Item eventKey="5">5</Dropdown.Item>
                <Dropdown.Item eventKey="6">6</Dropdown.Item>
                <Dropdown.Item eventKey="7">7</Dropdown.Item>
                <Dropdown.Item eventKey="8">8</Dropdown.Item>
                <Dropdown.Item eventKey="9">9</Dropdown.Item>
                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                <Dropdown.Item eventKey="11">11</Dropdown.Item>
                <Dropdown.Item eventKey="12">12</Dropdown.Item>
        </DropdownButton>
        </Col>
        </Row>
      </Container>
      <div class="d-flex justify-content-center">
       <div> 
       
          <Button
            variant="primary"
             
            onClick={ all}
          >
            All Data
          </Button>{'   '}
           
            <Button variant="primary"   onClick={ updateHandler}>
               Last 24Hour
            </Button>{" "}
             
            <Button variant="primary"  onClick={pastweek}>
               Past Week
            </Button>
            <Button variant="primary"   onClick={ byMonth}>
               By Month
            </Button>{" "}
            </div>  
        </div>
        <br></br>
         <div class=" d-flex justify-content-center">
        <div class="card text-center bg-light text-black">
           
  <div class="card-header">
    <h4> Number of time used </h4>
    </div>
    <div class="card-body">
     
    <p class="card-text">{realm}</p>
     
  </div>
   </div>
</div>
 <br></br>
    </div>
  );
};

export default Dankmemes;


//style={{width:'70%',padding:'10px', marginLeft:'55px'}}