function query(ele, all = true) {
    return all ? document.querySelectorAll(ele) : document.querySelector(ele); 
}

function innerHtml(output, set = true){
    if(set) return output.innerHTML
    else return (digit, clear = false) => {
        !clear ? output.innerHTML += digit : output.innerHTML = digit
    }
}

function getMemory(value){
    if(value){
        localStorage.setItem('value', value);
    }else{
        return localStorage.getItem('value');
    }
}

function addItemMemory(digit, value){

    if(digit === ','){
        if(!value.includes('.')) getMemory(value + '.');

    }else if(value == '+0'){
        if(digit != '+0') getMemory('+' + digit);

    }else if(digit === '+/-'){
        const signal = value[0] === '+' ? '-' : '+';
        getMemory(value.replace(value[0], signal))

    }else{
        getMemory(value + digit);
    }  

    console.log(value)
}

function formatNumberFinal(){
    const valors = getMemory().split('.');
    const integer = Intl.NumberFormat().format(valors[0]);
    const float = (valors.length > 1 ? ',' + valors[1] : '');

    return integer + float;
}

function insertNumber(btns){
    const output = query('.output', false);
    
    btns.addEventListener('click', (event) => {
        const value = getMemory();
        const digit = innerHtml(event.target);

        addItemMemory(digit, value);
        
        const setOutput = innerHtml(output, false);
        const formatedNumber = formatNumberFinal();
        setOutput(formatedNumber, true);
    })
    
}

localStorage.clear('value');
getMemory('+0');
insertNumber(query('.btn-number', false));

