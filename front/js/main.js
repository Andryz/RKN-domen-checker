// Initialize Firebase
var config = {
    apiKey: "AIzaSyDf_cn6zD-tNcshqJKI7rZ_AxOtZidCtoQ",
    authDomain: "checkdomainsrkn.firebaseapp.com",
    databaseURL: "https://checkdomainsrkn.firebaseio.com",
    projectId: "checkdomainsrkn",
    storageBucket: "checkdomainsrkn.appspot.com",
    messagingSenderId: "965506607828"
};
firebase.initializeApp(config);
let db = firebase.database().ref('domains');
// ========================== FIREBASE ============================



// Текущие домены в базе
let currentDomains = [];
let promiseArr = [];

// Получение доменов
db.on("value", (snapshot) => {
    currentDomains = snapshot.val();
    // console.log(currentDomains);
    promiseArr = checkDomain(currentDomains);
    Promise.all(promiseArr)
        .then(response => {
            compileDomains(response)
        })
        .catch(error => console.log(error))
        .finally(() => console.log('готово'))

}, (errorObject) => {
    console.log("The read failed: " + errorObject.code);
});

function checkDomain(domains) {
    let domainCheck = [];
    for (let domain of domains || []) {
        domainCheck.push(ApiFunction(domain.name));
    }
    return domainCheck
}


// Добавление, удаление доменов
let addDomain = document.getElementById('addDomain');
let addInput = document.getElementById('addInput');
let inputError = document.getElementById('input-error');
let cloneDomen = document.getElementById('cloneDomen');
let content = document.getElementById('content');
let ul = document.createElement('ul');
let preloader = document.getElementById('preloader');

// preloader
    preloader.style.display = 'block';
// Добавить домен по клику на кнопку
addDomain.addEventListener('click', () => {
    const regex = /(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/g;
    let today = new Date()
        , dd = String(today.getDate()).padStart(2, '0')
        , mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        , yyyy = today.getFullYear()
        , nowDay = dd + '/' + mm + '/' + yyyy;

    if (regex.test(addInput.value)) {
        currentDomains.push({ 'name': addInput.value.toLowerCase(), 'dateAdd': nowDay});
        db.set(currentDomains);
        checkDomain();
        addInput.value = '';
        inputError.style.display = 'none';
    }else{
        inputError.style.display = 'block';
    }
})
// Добавить домен по нажатию на Enter
addInput.addEventListener('keyup', (event) =>{
    if (event.keyCode === 13) {
        checkDomain();
        addDomain.click();
    }
    // Проверяем нет ли уже такого домена
    function checkDomain(){ 
        currentDomains.filter((currentDomain)=>{
            if(currentDomain.name === addInput.value.toLowerCase()){ 
                addDomain.disabled= true;
                cloneDomen.style.display = 'block';
                console.log('такой уже есть');
                return false
            }else{
                addDomain.disabled= false;
                cloneDomen.style.display = 'none';
            }
        })
    }
    checkDomain();
})

// Создание дом дерева
function compileDomains(domains) {

    ul.innerHTML = '';
    // console.log(domains);
    
    for (let domain of domains) {
        let li = document.createElement('li');
        let button = document.createElement('button');
        let domainName = document.createElement('div');
        let domainDate = document.createElement('div');
        let domainBan = document.createElement('div');
        let domainSearch = document.createElement('div');

        currentDomains.filter((currentDomain)=>{
            if(currentDomain.name === domain.domain || currentDomain.name === domain.domainName){
                domainDate.innerHTML = currentDomain.dateAdd;
            }
        })

        domainName.innerHTML = domain.domain;
        domainSearch.innerHTML = domain.domainName;
        domainBan.innerHTML = domain.includeTime
        button.innerText = "Удалить"

        button.classList.add("domain__delete");
        domainName.classList.add("domain__name");
        domainDate.classList.add("domain__date");
        domainBan.classList.add("domain__ban");
        domainSearch.classList.add("domain__search");
        ul.classList.add("main__list");

        if(domain.includeTime === "В базе нет"){
            domainBan.classList.add("domain__ban-good");
        }else{
            domainBan.classList.add("domain__ban-bad");
        }

        li.appendChild(domainSearch);
        li.appendChild(domainName);
        li.appendChild(domainDate);
        li.appendChild(domainBan);
        li.appendChild(button);

        // Не удаляем этот элемент чтобы в firebase не пропадал массив обьектов
        if(li.childNodes[1].innerText === 'not-delete.com'){
            li.style.display = 'none';
        }

        li.classList.add("domain__item");
        ul.appendChild(li);
    }
    content.appendChild(ul);
    preloader.style.display = 'none';
    
}
// Удалить домен
ul.addEventListener('click', (e) => {
    
    if(e.target.nodeName ==="BUTTON"){
        const nameDomain = e.target.parentNode.children[0].innerText;
        let nameDomainRkn = e.target.parentNode.children[1].innerText;
        console.log(nameDomainRkn);
        let domainsTempArr = [];
        Promise.all(
            currentDomains.filter((domain)=>{
                if(domain.name != nameDomain && domain.name != nameDomainRkn){
                    domainsTempArr.push(domain);
                }
            })
        )
        .then(()=>{currentDomains = domainsTempArr})
        .then(()=> {db.set(currentDomains)})
        .catch((error)=>{
            console.log('что-то не так', error);
        })
    }
})

// Обращение к базе данных РКН
function ApiFunction(domain) {
    return fetch("http://api.antizapret.info/get.php?item="+domain+"&type=json", { method: 'GET' })
        .then((response) => response.json())
        .then((responseValue) => {
            if (responseValue.register == null) {
                return { 'domain': domain, 'includeTime': 'В базе нет' }
            } else {
                let objResponseValue = responseValue.register[0];
                objResponseValue['domainName'] = domain;
                return objResponseValue
            }
        })
}