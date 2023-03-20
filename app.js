
let data = {};
fetch("https://raw.githubusercontent.com/yeonwoo22/chemistry/main/data.json")
    .then(response => response.json())
    .then(json => {
        data = json
    })


let mode = "Symbol"
function activateNumberMode() {
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
        fullname.textContent = " ";
    } else {
        display.textContent = keys[randomIdx];
        fullname.textContent = data[keys[randomIdx]]['fullName'];
    }

}

function submit(){
    const correctBox = document.querySelector('.correct');
    const wrongBox = document.querySelector('.wrong');
    if (mode == "Number"){
        const answerBox = document.querySelector('.answerBox');
        const answer = answerBox.value;
        if(data[answer] != undefined) {
            const number = document.querySelector('.element-name').textContent;
            if(number == data[answer]['atomicNumber']){
                correctBox.textContent++;
                answerBox.value = "";                
            } else {
                wrongBox.textContent++;
                answerBox.value = "";
            }
        } else {
           wrongBox.textContent++;
           answerBox.value = "";     
        }
    } else {
        const answerBox = document.querySelector('.answerBox');
        const symbol = document.querySelector('.element-name').textContent;
        if(data[symbol]['atomicNumber'] == answerBox.value) {
            correctBox.textContent++;
            answerBox.value = "";
        } else {
            wrongBox.textContent++;
            answerBox.value = "";
        }
    }
    shake();
}