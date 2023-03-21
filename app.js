
let data = {};
fetch("https://raw.githubusercontent.com/yeonwoo22/chemistry/main/data.json")
    .then(response => response.json())
    .then(json => {
        data = json
})

function enter(){
    if(window.event.keyCode == 13){
        document.querySelector('.check').click();
    }
}



let mode = "Symbol"
function activateNumberMode() {
    document.querySelector('.answerBox').type = "number";
    // 원소번호 모드 버튼에 active 클래스 추가
    const numberBtn = document.querySelector('.number-btn');
    numberBtn.classList.add('active');
  
    // 원소기호 모드 버튼에서 active 클래스 제거
    const symbolBtn = document.querySelector('.symbol-btn');
    symbolBtn.classList.remove('active');

    mode = "Number";
    shake();
}

function activateSymbolMode() {
    document.querySelector('.answerBox').type = "text";
    // 원소번호 모드 버튼에 active 클래스 추가
    const numberBtn = document.querySelector('.symbol-btn');
    numberBtn.classList.add('active');
  
    // 원소기호 모드 버튼에서 active 클래스 제거
    const symbolBtn = document.querySelector('.number-btn');
    symbolBtn.classList.remove('active');

    mode = "Symbol";
    shake();
}

function shake(){
    const keys = Object.keys(data);
    const max = Number(document.querySelector('.max').value)
    const min = Number(document.querySelector('.min').value)
    const randomIdx = Math.floor(Math.random() * (Math.min(keys.length, max) - min) + min) - 1;
    const display = document.querySelector('.element-name');
    const fullname = document.querySelector('.element-fullname');


    if (mode == "Number"){
        display.textContent = randomIdx;
        fullname.textContent = "Atomic";
    } else {
        display.textContent = keys[randomIdx];
        fullname.textContent = data[keys[randomIdx]]['fullName'];
        
    }

}

function submit(){
    const correctBox = document.querySelector('.correct');
    const wrongBox = document.querySelector('.wrong');
    const fullNameBox = document.querySelector('.element-fullname');
    if (mode == "Number"){
        const answerBox = document.querySelector('.answerBox');
        const answer = answerBox.value;
        const numberBox = document.querySelector('.element-name');
        const number = numberBox.textContent;
        if(data[answer] != undefined) {
            if(number == data[answer]['atomicNumber']){
                correctBox.textContent++;
                answerBox.value = "";
                numberBox.style.color = "blue";
                const submitBtn = document.querySelector('.check');
                submitBtn.disabled = true;
                fullNameBox.style.color = "blue";
                fullNameBox.textContent = answer;
                setTimeout(function(){
                    numberBox.style.color = "black";
                    submitBtn.disabled = false;
                    fullNameBox.style.color = "black";
                    shake();
                }, 500);            
            } else {
                wrongBox.textContent++;
                answerBox.value = "";
                numberBox.style.color = "red";
                const submitBtn = document.querySelector('.check');
                submitBtn.disabled = true;
                fullNameBox.style.color = "red";
                const keys = Object.keys(data);
                fullNameBox.textContent = keys[number - 1];
                setTimeout(function() {
                    numberBox.style.color = "black";
                    submitBtn.disabled = false;
                    fullNameBox.style.color = "black";
                    shake();
                }, 1000);    
            }
        } else {
            wrongBox.textContent++;
            answerBox.value = "";
            numberBox.style.color = "red";
            const submitBtn = document.querySelector('.check');
            submitBtn.disabled = true;
            fullNameBox.style.color = "red";
            const keys = Object.keys(data);
            fullNameBox.textContent = keys[number - 1];
            setTimeout(function() {
                numberBox.style.color = "black";
                submitBtn.disabled = false;
                fullNameBox.style.color = "black";
                shake();
            }, 1000);      
        }
    } else {
        const answerBox = document.querySelector('.answerBox');
        const symbolBox = document.querySelector('.element-name');
        const symbol = symbolBox.textContent;
        if(data[symbol]['atomicNumber'] == answerBox.value) {
            correctBox.textContent++;
            answerBox.value = "";
            symbolBox.style.color = "blue";
            const submitBtn = document.querySelector('.check');
            submitBtn.disabled = true;
            fullNameBox.style.color = "blue";
            setTimeout(function(){
                symbolBox.style.color = "black";
                submitBtn.disabled = false;
                fullNameBox.style.color = "black";
                shake();
            }, 500);
        } else {
            wrongBox.textContent++;
            answerBox.value = "";
            symbolBox.style.color = "red";
            fullNameBox.style.color = "red";
            fullNameBox.textContent = data[symbol]['atomicNumber'];
            const submitBtn = document.querySelector('.check');
            submitBtn.disabled = true;
            setTimeout(function(){
                symbolBox.style.color = "black";
                fullNameBox.style.color = "black";
                submitBtn.disabled = false;
                shake();
            }, 1000);
        }
    }
}

function addValue(value) {
    document.querySelector('.answerBox').value += value;
}

function remove(){
    document.querySelector('.answerBox').value = "";
}