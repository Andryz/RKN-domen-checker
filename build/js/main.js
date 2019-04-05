"use strict";var config={apiKey:"AIzaSyDf_cn6zD-tNcshqJKI7rZ_AxOtZidCtoQ",authDomain:"checkdomainsrkn.firebaseapp.com",databaseURL:"https://checkdomainsrkn.firebaseio.com",projectId:"checkdomainsrkn",storageBucket:"checkdomainsrkn.appspot.com",messagingSenderId:"965506607828"};firebase.initializeApp(config);var db=firebase.database().ref("domains"),currentDomains=[],promiseArr=[];function checkDomain(e){var n=[],t=!0,a=!1,i=void 0;try{for(var o,d=(e||[])[Symbol.iterator]();!(t=(o=d.next()).done);t=!0){var r=o.value;n.push(ApiFunction(r.name))}}catch(e){a=!0,i=e}finally{try{t||null==d.return||d.return()}finally{if(a)throw i}}return n}db.on("value",function(e){currentDomains=e.val(),promiseArr=checkDomain(currentDomains),Promise.all(promiseArr).then(function(e){compileDomains(e)}).catch(function(e){return console.log(e)}).finally(function(){return console.log("готово")})},function(e){console.log("The read failed: "+e.code)});var addDomain=document.getElementById("addDomain"),addInput=document.getElementById("addInput"),inputError=document.getElementById("input-error"),cloneDomen=document.getElementById("cloneDomen"),content=document.getElementById("content"),ul=document.createElement("ul"),preloader=document.getElementById("preloader");function compileDomains(e){var n=!(ul.innerHTML=""),t=!1,a=void 0;try{for(var r,i=function(){var n=r.value,e=document.createElement("li"),t=document.createElement("button"),a=document.createElement("div"),i=document.createElement("div"),o=document.createElement("div"),d=document.createElement("div");currentDomains.filter(function(e){e.name!==n.domain&&e.name!==n.domainName||(i.innerHTML=e.dateAdd)}),a.innerHTML=n.domain,d.innerHTML=n.domainName,o.innerHTML=n.includeTime,t.innerText="Удалить",t.classList.add("domain__delete"),a.classList.add("domain__name"),i.classList.add("domain__date"),o.classList.add("domain__ban"),d.classList.add("domain__search"),ul.classList.add("main__list"),"В базе нет"===n.includeTime?o.classList.add("domain__ban-good"):o.classList.add("domain__ban-bad"),e.appendChild(d),e.appendChild(a),e.appendChild(i),e.appendChild(o),e.appendChild(t),"not-delete.com"===e.childNodes[1].innerText&&(e.style.display="none"),e.classList.add("domain__item"),ul.appendChild(e)},o=e[Symbol.iterator]();!(n=(r=o.next()).done);n=!0)i()}catch(e){t=!0,a=e}finally{try{n||null==o.return||o.return()}finally{if(t)throw a}}content.appendChild(ul),preloader.style.display="none"}function ApiFunction(t){return fetch("http://api.antizapret.info/get.php?item="+t+"&type=json",{method:"GET"}).then(function(e){return e.json()}).then(function(e){if(null==e.register)return{domain:t,includeTime:"В базе нет"};var n=e.register[0];return n.domainName=t,n})}preloader.style.display="block",addDomain.addEventListener("click",function(){var e=new Date,n=String(e.getDate()).padStart(2,"0")+"/"+String(e.getMonth()+1).padStart(2,"0")+"/"+e.getFullYear();/(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/g.test(addInput.value)?(currentDomains.push({name:addInput.value.toLowerCase(),dateAdd:n}),db.set(currentDomains),checkDomain(),addInput.value="",inputError.style.display="none"):inputError.style.display="block"}),addInput.addEventListener("keyup",function(e){function n(){currentDomains.filter(function(e){if(e.name===addInput.value.toLowerCase())return addDomain.disabled=!0,cloneDomen.style.display="block",console.log("такой уже есть"),!1;addDomain.disabled=!1,cloneDomen.style.display="none"})}13===e.keyCode&&(n(),addDomain.click()),n()}),ul.addEventListener("click",function(e){if("BUTTON"===e.target.nodeName){var n=e.target.parentNode.children[0].innerText,t=e.target.parentNode.children[1].innerText;console.log(t);var a=[];Promise.all(currentDomains.filter(function(e){e.name!=n&&e.name!=t&&a.push(e)})).then(function(){currentDomains=a}).then(function(){db.set(currentDomains)}).catch(function(e){console.log("что-то не так",e)})}});