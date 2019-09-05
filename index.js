months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  mon = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  window.addEventListener("load", () =>{
      loadJSON();
      registerSW();
  });

  function loadJSON(){
    //var xmlhttp = new XMLHttpRequest();
    var url = "https://is87.github.io/congschedule/json.txt";
  
    /*xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            console.log("Data fetched. Initializing...");
            init();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();*/

    fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    data = myJson;
    console.log("Data fetched. Initializing...");
    init();
  });
  }

async function registerSW(){
    if("serviceWorker" in navigator){
        try{
            await navigator.serviceWorker.register("sw.js");
        }catch(e){
            console.log("SW registration failed");
        }
    }
}

function about(){
  if(document.getElementById("aboutBox").style.display == "none"){
    document.getElementById("aboutBox").style.display = "block";
  }else{
    document.getElementById("aboutBox").style.display = "none";
  }
}

function saveSettings(){
  myName = document.getElementById("settingsName").value;
  setCookie("myName", encodeURIComponent(myName), 365);
  //myGroup = document.getElementById("settingsGroup").value;
  if(document.getElementById("settingsGroup1").checked){
    myGroup = "Group 1";
    setCookie("myGroup", encodeURIComponent("Group 1"), 365);
  }
  if(document.getElementById("settingsGroup2").checked){
    myGroup = "Group 2";
    setCookie("myGroup", encodeURIComponent("Group 2"), 365);
  }
  hideSettings();
}

function showSettings(){
  document.getElementById("modal").style.display = "block";
  document.getElementById("settingsName").value = myName;
  if(myGroup == "Group 1")document.getElementById("settingsGroup1").checked=true;
  if(myGroup == "Group 2")document.getElementById("settingsGroup2").checked=true;
}

function hideSettings(){
  document.getElementById("modal").style.display = "none";
}

  function growBox(){
    dayBox.style.position = "absolute";
    dayBox.style.left = (parseInt(dayBox.style.left) + dX) + "px";
    dayBox.style.top = (parseInt(dayBox.style.top) + dY) + "px";
    dayBox.style.width = (parseInt(dayBox.style.width) + dW) + "px";
    dayBox.style.height = (parseInt(dayBox.style.height) + dH) + "px";
    if((parseInt(dayBox.style.width))>=stopW){
      clearInterval(myGrowAni);
      dayBox.style.left = stopX+"px";
      dayBox.style.top = stopY+"px";
      dayBox.style.width = stopW+"px";
      dayBox.style.height = stopH+"px";
      loadDay(thisYear, thisMonth, thisDay);
    }
  }

  function backToMonth(){
    loadMonth(thisYear, thisMonth, thisDay);
  }

  function seeToday(){
    loadDay(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function seeThisMonth(){
    loadMonth(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function clickDay(evt) {
    if(evt.target.myParam == undefined){
      pressedDiv = evt.target.parentElement;
    }else{
      pressedDiv = evt.target;
    }

    thisDay = pressedDiv.myParam;


    loadDay(thisYear, thisMonth, thisDay);


  }

  function addZero(a){
    if(a<10)a="0"+a;
    return a;
  }

  function subtractZero(a){
    if(a.length > 1 && a.substr(0, 1) == "0")a=a.substr(1);
    return a;
  }

  function numberth(number){
    if(number%10==1 && (number < 10 || number > 20) ) return number + "st";
    if(number%10==2 && (number < 10 || number > 20) )return number + "nd";
    if(number%10==3 && (number < 10 || number > 20) )return number + "rd";
    return number + "th";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}



  function init(){
    //xml = xmlDatabase;
    //data = JSON.parse(jsonDatabase);
    //alert(xmlDatabase.substring(0, 100));
    today = new Date();
    thisYear = today.getFullYear();
    thisMonth = today.getMonth();
    thisDay = today.getDate();
    w = window.innerWidth;
    h = window.innerHeight;
    if(h<w)w=h;
    navBox = document.getElementById("navBox");
    monthBox = document.getElementById("monthBox");
    dayBox = document.getElementById("dayBox");
    scheduleBox = document.getElementById("scheduleBox");

var mc = new Hammer(monthBox);
var mc2 = new Hammer(dayBox);
var mc3 = new Hammer(scheduleBox);

//mc.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 10 }) );

mc.on("swipeleft", function(ev) {
    loadMonth(nextYear, nextMonth, 1);
});

mc.on("swiperight", function(ev) {
    loadMonth(prevYear, prevMonth, 1);
});

mc2.on("swipeleft", function(ev) {
    var datum = new Date(thisYear, thisMonth, thisDay+1);
    loadDay(datum.getFullYear(), datum.getMonth(), datum.getDate());
});

mc2.on("swiperight", function(ev) {
    var datum = new Date(thisYear, thisMonth, thisDay-1);
    loadDay(datum.getFullYear(), datum.getMonth(), datum.getDate());
});

mc3.on("swipeleft", function(ev) {
    if(scheduleMode=="full")loadMySchedule(false);
});

mc3.on("swiperight", function(ev) {
    if(scheduleMode=="my")loadMySchedule(true);
});

    //alert(decodeURIComponent(location.search));
    searchString = decodeURIComponent(location.search);
    if(getCookie("myName") != ""){
      myName = decodeURIComponent(getCookie("myName"));
    }else{
      myName = "";
    }

    if(getCookie("myGroup") != ""){
      myGroup = decodeURIComponent(getCookie("myGroup"));
    }else{
      myGroup = "";
    }

    loadMonth(thisYear, thisMonth, thisDay);

  }

  function loadMySchedule(full){
    if(full){
      scheduleMode = "full";
    }else{
      scheduleMode = "my";
    }
    monthBox.style.display = "none";
    dayBox.style.display = "none";
    scheduleBox.style.display = "block";
    scheduleBox.innerHTML = "";

    if(full==true)navBox.innerHTML = "<span style='color:#fff;''>Full Schedule</span> / <span onClick='loadMySchedule(false)' style='color:#FDa4a1;'>My Schedule</span>";
    if(full==false)navBox.innerHTML = "<span onClick='loadMySchedule(true)' style='color:#FDa4a1;''>Full Schedule</span> / <span style='color:#fff;'>My Schedule</span>";

    /*var parser = new DOMParser();
    var doc = parser.parseFromString(xml, "text/xml");
    var x = doc.getElementsByTagName("event");*/
    var x = data.events;

    sd = new Date(2015, 1, 1);
    scrollDate = sd.getFullYear()+"-"+addZero(sd.getMonth())+"-"+addZero(sd.getDate());
    scrollFound = false;

    for(i = 0; i < x.length; i++){
      if(full == true || (full==false && JSON.stringify(x[i]).indexOf(myName) != -1 && myName != "")){

      if(x[i].date != scrollDate){
        dd = x[i].date;
        m1 = dd.substr(5, 2);
        m1 = subtractZero(m1)-1;
        d1 = dd.substr(8, 2);
        d1 = subtractZero(d1);
        scheduleBox.innerHTML += "<div id='ddiv"+i+"' style='width:"+window.innerWidth+"px; height: 20px; position:relative; left:-10px; margin-bottom: 10px; background-color: #FFA1A1; color: #fff; box-sizing: border-box; font-weight: bold; line-height:20px; font-size: 16px; overflow:hidden; text-align:center;'>The "+numberth(d1) + " of "+months[m1]+ "</div>";
        scrollDate = x[i].date;
      }
      todayText = today.getFullYear()+"-"+addZero(today.getMonth()+1)+"-"+addZero(today.getDate());
      if(todayText <= scrollDate && scrollFound == false){
        scrollFound = true;
        scrollNumber = i;
      }
      scheduleBox.innerHTML += buildDayBox(x[i]);
    }
    }
    scheduleBox.scrollTop = document.getElementById("ddiv"+scrollNumber).offsetTop-10;
  }


  function loadDay(year, month, day){

    monthBox.style.display = "none";
    scheduleBox.style.display = "none";
    thisYear = year;
    thisMonth = month;
    thisDay = day;
    dayBox.style.display = "block";
    dayBox.innerHTML = "";


    w = window.innerWidth;
    h = window.innerHeight;

    var d = new Date(year, month, day);
    wday = weekdays[d.getDay()];

    var dateString = year+"-"+addZero(month+1)+"-"+addZero(day);
    //navBox.innerHTML = "<span onClick='backToMonth();'>&lt;&lt;&nbsp;&nbsp;&nbsp;&nbsp;</span><b>The "+numberth(day) + " of " + months[month] + "</b>";
    navBox.innerHTML = "<span onClick='backToMonth();'>&lt;&lt;&nbsp;&nbsp;&nbsp;&nbsp;</span><b>"+wday + ", " + months[month] + " " + day + "</b>";
    //alert(dateString);
    //bb.innerHTML = months[thisMonth] + " " +  a;
    /*var parser = new DOMParser();
    var doc = parser.parseFromString(xml, "text/xml");
    var x = doc.getElementsByTagName("event");*/
    var x = data.events;
    //alert(x.length);
    dayBox.innerHTML = "";
    hits = 0;
    for(i = 0; i < x.length; i++){
      if(x[i].date == dateString){
        hits++;
        dayBox.innerHTML += buildDayBox(x[i]);
      }

    }
    if(hits==0){
      dayBox.innerHTML = "<div style='width:"+(window.innerWidth-20)+"px; margin-bottom: 10px; background-color: #ffffff; box-shadow: 2px 2px 1px #ccc;'><div style='width:100%; height: 40px; margin-bottom: 5px; padding: 5px; background-color: #FFA1A1; color: #fff; box-sizing: border-box; font-weight: bold; line-height:30px; font-size: 16px; overflow:hidden; text-align:center;'>NO EVENTS THIS DAY</div><div style='padding: 5px; text-align:center; color:#ccc;'>NOTHING SPECIAL HAPPENING</div>";
    }

  }

  function buildDayBox(eventTag){
    var htmlString = "";
    htmlString += "<div style='width:"+(window.innerWidth-20)+"px; margin-bottom: 10px; background-color: #ffffff; box-shadow: 2px 2px 1px #ccc;'><div style='width:100%; height: 40px; margin-bottom: 5px; padding: 5px; ";
    if(eventTag.type == "Weekend Meeting" || eventTag.type == "Midweek Meeting"){
      htmlString += "background-color: #ec2c2c;"
    }else if(eventTag.type == "Meeting for Field Service"){
      htmlString += "background-color: #eca02c;"
    }else{
      htmlString += "background-color: #881f9b;"
    }
    htmlString += "color: #fff; box-sizing: border-box; font-weight: bold; line-height:30px; font-size: 16px; overflow:hidden; text-align:center;'><span style='font-weight:lighter;'>" + eventTag.time + "</span> <span style='font-weight:bold;'>" + eventTag.type.toUpperCase() + "</span></div><div style='padding: 5px;'>";
    var items = eventTag.items;
    if(typeof eventTag.group !== 'undefined' && typeof eventTag.location !== 'undefined') htmlString += "<div style='font-size: 12px; color:#333; text-align:center; padding-bottom:10px;'>"+eventTag.group+" - Location: "+eventTag.location+"</div>";
    htmlString += "<table style='font-size: 12px; width:100%;'><tr><td style='font-weight:bold; color: #000; width: 50%;'>ASSIGNMENT</td><td style='font-weight:bold;color: #000; width: 50%;'>PUBLISHER</td></tr>";
    for(j = 0; j < items.length; j++){
      if(items[j].type=="Sound")htmlString += "<tr><td></td><td></td></tr><tr><td colspan='2' style='border-top:1px solid #ccc;'></td></tr>";
      /*if(items[j].getAttribute("type").indexOf("(Householder)") == -1){*/
        if(items[j].type.length < 35)htmlString += "<tr><td style='color: #555; width: 50%;'>" + items[j].type + ":</td> ";
        if(items[j].type.length >= 35)htmlString += "<tr><td style='color: #555; width: 50%;'>" + items[j].type.substring(0,35) + "...:</td> ";
      /*}else{
        htmlString += "<tr><td style='color: #777; width: 50%;'>(Householder)</td> ";
      }*/
      if(items[j].name == myName || (items[j].name == myGroup && items[j].type=="Cleaning")){
        htmlString += "<td style='color: #f00;'>";
      }else {
        htmlString += "<td style='color: #000;'>";
      }
      htmlString += items[j].name +"</td><tr>";

      if(typeof items[j].name2 !== 'undefined'){
        if(items[j].name2 == myName){
          htmlString += "<tr><td style='color: #555; width: 50%;'></td><td style='color: #f00;'>("+items[j].name2+")</td><tr>";
        }else{
          htmlString += "<tr><td style='color: #000; width: 50%;'></td><td style='color: #000;'>("+items[j].name2+")</td><tr>";
        }
      }

    }
    htmlString += "</table></div></div>";
    return htmlString;
  }

  function loadMonth(year, month, day){
    w = window.innerWidth;
    h = window.innerHeight;
    if(h<w)w=h;
    dayBox.style.display = "none";
    scheduleBox.style.display = "none";
    monthBox.style.display = "block";
    monthBox.innerHTML = "";
    var d = new Date(year, month, day);
    var first = new Date(d.getFullYear(), d.getMonth(), 1);
    var da = new Date(d.getFullYear(), d.getMonth()+1, 0);
    var dagar = da.getDate();
    thisMonth = month;

    prevYear = d.getFullYear();
    prevMonth = d.getMonth()-1;
    if(prevMonth==-1){
      prevMonth = 11;
      prevYear -= 1;
    }
    nextYear = d.getFullYear();
    nextMonth = d.getMonth()+1;
    if(nextMonth==12){
      nextMonth = 0;
      nextYear += 1;
    }
    navButtonSize = (window.innerWidth-50)/3;


    navBox.innerHTML = "<span onClick='loadMonth("+prevYear+", "+prevMonth+", 1);'>&lt;&lt;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style='font-weight:bold;'>" +  months[d.getMonth()].toUpperCase() + "</span> <span style='font-weight:lighter;'>" + d.getFullYear()+"</span><span onClick='loadMonth("+nextYear+", "+nextMonth+", 1);'>&nbsp;&nbsp;&nbsp;&nbsp;&gt;&gt;</span>";

    boxWidth = (w-50)/7;
    boxCC = boxWidth+5;

    monthBox.innerHTML = "<table style='table-layout: fixed; border-spacing:0; margin:0; padding:0; font-size:10px; color: #555; text-align: center; position: absolute; left: 5px; top: 10px; width:"+(w-10)+"px;'><tr><td>MON</td><td>TUE</td><td>WED</td><td>THU</td><td>FRI</td><td>SAT</td><td>SUN</td></tr></table>";
    var start = first.getDay();
    //monthBox.innerHTML = months[d.getMonth()];
    var week = 0;
    var dag = start;
    if(dag==0)dag=7;
    var div = document.createElement('div');

    /*var parser = new DOMParser();
    var doc = parser.parseFromString(xml, "text/xml");
    var x = doc.getElementsByTagName("event");*/
    var x = data.events;

    for (i = 1; i <= dagar; i++) {
      var thisDiv = document.createElement('div');
      var dateString = year+"-"+addZero(month+1)+"-"+addZero(i);
      //thisDiv.style.border = "1px solid #cccccc";
      thisDiv.style.width = boxWidth+"px";
      thisDiv.style.height = boxWidth*1.2+"px";
      thisDiv.style.position = "absolute";
      thisDiv.style.left = (dag-1)*boxCC+10+"px";
      thisDiv.style.top = week*boxCC*1.2+30+"px";
      thisDiv.style.backgroundColor = "#ffffff";
      thisDiv.style.fontSize = boxWidth/5+"px";
      thisDiv.style.boxShadow = "2px 2px 1px #ccc";
      if(i==today.getDate() && d.getMonth() == today.getMonth() && d.getFullYear() == today.getFullYear()){
        //thisDiv.style.backgroundColor = "#bbb";
        thisDiv.style.fontWeight = "bold";
        thisDiv.style.backgroundColor = "#eef";
      }

      thisDiv.myParam = i;
      thisDiv.aWidth = boxWidth;
      thisDiv.aHeight = boxWidth*1.2;
      thisDiv.aLeft = (dag-1)*boxCC+10;
      thisDiv.aTop = week*boxCC+50;
      thisDiv.addEventListener("click", clickDay);
      thisDiv.innerHTML = "<div style='width:"+boxWidth+"px; height:"+boxWidth/2.5+"px; line-height:"+boxWidth/2.5+"px; text-align:center; border-bottom: thin dotted #ccc;'>"+i+"</div>";

      for(j = 0; j < x.length; j++){
        if(x[j].date == dateString){
          if(myName != "" && JSON.stringify(x[j]).indexOf(myName) != -1){
            thisDiv.style.color = "#FF3824";
            //thisDiv.style.backgroundColor = "#ffeeee";
            thisDiv.firstChild.innerHTML = "- "+i+" -";
          }
          if(x[j].type == "Weekend Meeting" || x[j].type == "Midweek Meeting"){
            thisDiv.innerHTML += "<div style='margin-bottom: 5%; width:"+boxWidth+"px; height:"+boxWidth/10+"px; background-color:#ec2c2c;'></div>";
          }else if(x[j].type == "Meeting for Field Service"){
            thisDiv.innerHTML += "<div style='margin-bottom: 5%; width:"+boxWidth+"px; height:"+boxWidth/10+"px; background-color:#eca02c;'></div>";
          }else{
            thisDiv.innerHTML += "<div style='margin-bottom: 5%; width:"+boxWidth+"px; height:"+boxWidth/10+"px; background-color:#881f9b;'></div>";
          }
        }
      }

      div.appendChild(thisDiv);

      dag++;
      if(dag==8){
        dag=1;
        week++;
      }
    }
    monthBox.appendChild(div);
  }