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
    value === undefined ? localStorage.setItem('value' , value) :
    localStorage.getItem('value')
}

function displayItem(digit, value, setValue){
    const strValue = String(value)
    if(digit === ','){
        if(!strValue.includes('.')) getMemory(value + '.')
        console.log(getMemory());
    }else if(value == '0'){
        if(digit != '0') setValue('.', true);
    }else{
        localStorage.setItem('value', digit)
    }  
}

function formatNumberFinal(valFinal){
    if(valFinal.includes(',')){
        return valFinal.split(',')
    }

    return valFinal
}

function insertNumber(btns){
    const output = query('.output', false);
    
    btns.addEventListener('click', (event) => {
        const value = getMemory();
        const setValue = innerHtml(output, false);
        const digit = innerHtml(event.target)

        displayItem(digit, value, setValue);

        const formated = formatNumberFinal(value);
        setValue(formated, true);
    })
    
}

getMemory(0);
insertNumber(query('.btn-number', false));
