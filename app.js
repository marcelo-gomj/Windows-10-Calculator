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

// add points in numbers
function formatNumberFinal(value, output){
    const valors = value.split('.');
    const integer = Intl.NumberFormat().format(valors[0]);
    const float = (valors.length > 1 ? ',' + valors[1] : '');

    output.style.fontSize = reponsiveOutput(valors.join('').length);

    return integer + float;
}

// flexiblity the numbers in main display
function reponsiveOutput(length){
    switch(length){
        case 14: return '2.7rem';
        case 15: return '2.6rem';
        case 16: return '2.5rem';
        case 17: return '2.2rem';
        default: return '3rem'
    }
}

// return the results of operations mathematics
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

// insert numbers 
function insertNumber(btn, output){
    const getMemory = localMemory('value');    
    const value = getMemory();

    getMemory(addItemMemory(btn, value));

    const updateVal = getMemory();
    const formatedNumber = formatNumberFinal(updateVal, output);

    const setOutput = innerHtml(output, false);
    setOutput(formatedNumber, true);
}

// make operations mathematics
function setOperationMethods(btn, miniInfo){
    const firstValue = localMemory('value');
    const secondValue = localMemory('value2');
    const method = localMemory('method');

    const oldFirstValue = firstValue();

    if( btn.length > 3 ){
        firstValue(oldFirstValue.slice(0, (oldFirstValue.length -1)))
        console.log(firstValue())

    }else{
        const operation = method();
        const setMiniInfo = innerHtml(miniInfo, false);

        if( operation === '0' ){
            secondValue(firstValue());
            firstValue('+0');
    
            method(btn);
    
            const miniValue = Number(secondValue()) + ' ' + btn
            setMiniInfo(miniValue, true);
    
        }else{
            const result = setSysOperation(firstValue(), secondValue(), method())
            firstValue(result);
            clearMemory('value2', true)
            clearMemory('method', true)
            
            if(btn === '=') setMiniInfo(` ${Number(oldFirstValue)} ${btn}`);
        }
    }

    const output = query('.output', false);
    innerHtml(output, false)(formatNumberFinal(firstValue().toString(), output), true);     
}

function setExtraOptions(option, output, miniInfo){
    const cleanResult = innerHtml(output, false);
    const cleanMiniInfo = innerHtml(miniInfo, false);

    switch(option){
        case 'C':
            clearMemoryAll('value', 'value2', 'method'); 
            cleanResult('0', true);
            cleanMiniInfo('', true);
        break;
        case 'CE':
            clearMemoryAll('value');
            cleanResult('0', true);
        break;

    }
}

// Listen cliks on buttons
function listenClickButton(buttonsHtml, action, ...rest){
    const buttons = [...buttonsHtml]

    buttons.map((btn) =>{
        btn.addEventListener('click', (event) => {
            const innerButtons = innerHtml(event.target);
            action(innerButtons, ...rest);
        })
    })
}

// clean localStorage 
function clearMemory(memory, index){
    localMemory(memory)(!index ? '+0': '0');
}

function clearMemoryAll(...local){
    local.map(clearMemory);
}

// when starting clean the localStorage
clearMemoryAll('value', 'value2', 'method');

// Clicks on buttons 
(function (){
    const output = query('.output', false);
    const miniInfo = query('.info-display', false);

    ['.btn-number', '.btn-options', '.btn-extra', '.memory']
    .map((btn, index) => {
        const buttons = query(btn);
        
        switch(index){
            case 0:
                listenClickButton(buttons, insertNumber, output);
                break
            case 1:
                listenClickButton(buttons, setOperationMethods, miniInfo);
                break;
            case 2: 
                listenClickButton(buttons, setExtraOptions, output, miniInfo);
                break;
            case 3:
                listenClickButton(buttons, insertNumber);
            break;
        }
    })
})()

