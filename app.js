function query(ele, all = true) {
    return all ? document.querySelectorAll(ele) : document.querySelector(ele); 
}

function innerHtml(output, set = true){
    if(set) return output.innerHTML
    else return (digit, clear = false) => {
        !clear ? output.innerHTML += digit : output.innerHTML = digit
    }
}

function localMemory(key){
    return (value) => {
        if(value){ 
            localStorage.setItem(key, value);
        }else{
            return localStorage.getItem(key);
        }
    }
}

function addItemMemory(digit, value){
    if(value.length < 17){
        if(digit === ','){
            if(!value.includes('.')) return (value + '.');
    
        }else if(value == '+0'){
            if(digit != '+0') return ('+' + digit);
    
        }else if(digit === '+/-'){
            const signal = value[0] === '+' ? '-' : '+';
            return (value.replace(value[0], signal))
    
        }else{
            return (value + digit);
        }  
    }

    return '';
}

function formatNumberFinal(value, output){
    const valors = value.split('.');
    const integer = Intl.NumberFormat().format(valors[0]);
    const float = (valors.length > 1 ? ',' + valors[1] : '');

    output.style.fontSize = reponsiveOutput(valors.join('').length);

    return integer + float;
}

function reponsiveOutput(length){
    switch(length){
        case 14: return '2.7rem';
        case 15: return '2.6rem';
        case 16: return '2.5rem';
        case 17: return '2.2rem';
        default: return '3rem'
    }
}

function setSysOperation(str1, str2, opertation){
    const val2 = Number(str1);
    const val1 = Number(str2);
    switch(opertation){
        case 'x':
            return val1 * val2 ;
        case '÷':
            return val1 / val2;
        case '-': 
            return val1 - val2;
        case '+' :
            return val1 + val2;
        default:
            return 'Error'
    }
}

function insertNumber(btn, output){
    const getMemory = localMemory('value');    
    const value = getMemory();

    getMemory(addItemMemory(btn, value));

    const updateVal = getMemory();
    const formatedNumber = formatNumberFinal(updateVal, output);

    const setOutput = innerHtml(output, false);
    setOutput(formatedNumber, true);
}

function setOperationMethods(btn, miniInfo, output){
    const firstValue = localMemory('value');
    const secondValue = localMemory('value2');
    const method = localMemory('method');

    
    if( method() === '0' ){
        secondValue(firstValue());
        firstValue('+0');

        method(btn);

        const miniValue = Number(secondValue()) + ' ' + btn
        innerHtml(miniInfo, false)(miniValue, true);
    }else{
        const result = setSysOperation(firstValue(), secondValue(), method())
        console.log(result)

        firstValue(result);
        innerHtml(query('.output', false), false)(result, true);
        clearMemory('value2', true)
        clearMemory('method', true)
    }
}

function listenClickButton(elements, action, display){
    const buttons = query(elements, false);
    const output = query(display, false);

    buttons.addEventListener('click', (event) =>{
        const innerButtons = innerHtml(event.target);
        action(innerButtons, output);
    })
}

// clean localStorage 
function clearMemory(memory, index){
    localMemory(memory)(!index ? '+0': '0');
}

// when starting clean the localStorage
['value', 'value2', 'method'].map(clearMemory);

// listen the clicks on buttons 
['.btn-number', '.btn-options'].map((className, index) => {
    switch(index){
        case 0:
            listenClickButton(
                className, insertNumber, 
                '.output'
            );
        break;
        case 1:
            listenClickButton(
                className, setOperationMethods, 
                '.info-display'
            );
        break;
    }
})
