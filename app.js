function query(ele, all = true) {
    return all ? document.querySelectorAll(ele) : document.querySelector(ele); 
}

let numbers = [];

function responsiveDisplay(display){
    if(numbers.length > 13){
        console.log(display.style.fontSize)
    }
}

function addNumber(value){
    if(numbers.length <= 15){
        numbers.push(value);
    }

    if(numbers[0] === "0"){
        numbers.pop(); 
    }
}

function inputDisplay(list){
    const output = query('.output', false),
    valHtml = list.join("");

    responsiveDisplay(output);
    query('.output', false).innerHTML = '';
    if(list.length === 0){
        output.innerHTML = 0;
    }else{
        const valueFormated = Intl.NumberFormat({style: 'decimal'}).format(valHtml);
        output.innerHTML = valueFormated;
    }
}

function insertNumber(btns){
    let inputEvt = 0;
    btns.addEventListener('click', (evt) => {
        addNumber(listnerNumber(evt));
        inputDisplay(numbers);
    })

    function listnerNumber(e) {
        if (btns !== e.target) {
            const num = e.target.innerHTML
            return inputEvt = num;
        }
    }
}

insertNumber(query('.btn-number', false));
