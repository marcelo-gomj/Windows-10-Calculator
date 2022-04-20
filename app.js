function query(ele, all = true) {
    return all ? document.querySelectorAll(ele) : document.querySelector(ele); 
}

function innerHtml(output, get = true){
    if(get) return output.innerHTML;
    else return (digit, clear = false) => {
        !clear ? output.innerHTML += digit : output.innerHTML = digit;
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

const firstValue = localMemory('value');

const secondValue = localMemory('value2');

const operation = localMemory('method');

// get inputs number
function addItemMemory(digit, value){
    if(value.length < 17){
        if(digit === ','){
            if(!value.includes('.')) return (value + '.');
    
        }else if(value == '+0'){
            if(digit != '+0') return ('+' + digit);
    
        }else if(digit === '+/-'){
            const signal = value[0] === '+' ? '-' : '+';
            return (value.replace(value[0], signal));
    
        }else{
            return (value + digit);
        }  
    }

    return '';
}

// add points in numbers
function updateDisplayOutput(value){
    const output = query('.output', false);
    const valors = value.split('.');
    const integer = Intl.NumberFormat().format(valors[0]);
    const float = (valors.length > 1 ? ',' + valors[1] : '');

    output.style.fontSize = reponsiveOutput(valors.join('').length);

    const result = (integer + float);
    innerHtml(output, false)(result, true);
}

function updateMiniInfo(infos, clean){
    const miniInfo = query('.info-display', false)
    innerHtml(miniInfo, false)(infos, clean);
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
function calcOperation(){
    const val2 = Number(firstValue());
    const val1 = Number(secondValue());

    switch(operation()){
        case 'x':
            return val1 * val2 ;
        case '÷':
            return val1 / val2;
        case '-': 
            return val1 - val2;
        case '+' :
            return val1 + val2;
        default:
            return 'Error';
    }
}

// insert numbers 
function insertNumber(btn, output, miniInfo){
    if(operation() === '='){
        clearMemoryAll('value', 'value2', 'method')
        innerHtml(miniInfo, false)('', true)
    }

    const value = firstValue();
    firstValue(addItemMemory(btn, value));

    const updateVal = firstValue();
    updateDisplayOutput(updateVal, output);
}

function buttonDeleteDigit(setValue){    
    const value = setValue();
    setValue(value.slice(0, (value.length - 1) ));

    const updatedVal = setValue()
    if(updatedVal.length === 1) setValue(updatedVal + '0');
}

function updateHistoryList(histories, container){
    container.innerHTML = '';

    histories.reverse().map(item => {
        const { path, result } = item;
        const li = document.createElement('li');

        li.innerHTML = `${path}<div>${result}</div>`;
        
        li.addEventListener('click', () =>{ 
            firstValue(result);
            updateMiniInfo(path, true);
            updateDisplayOutput(String(result));
        });

        container.appendChild(li);
    })
}

// function for sava data in memory
function saveResultsMemory(path, result){
    const setHistory = localMemory('history');
    const local = { memory : [] };
    let datas = JSON.parse(setHistory()).memory || local.memory;
    
    const pushItems = () => datas.push({path, result});

    if(result && path){
        if(datas.length < 20){
            pushItems()
        }else{
            datas = datas.slice(1);
            pushItems()
        }

        local.memory = datas;
        setHistory(JSON.stringify(local));
        updateHistoryList(local.memory, query('.history', false))
    }
}

// make operations mathematics
function setOperationMethods(btn){
    if(btn.length > 3){
        buttonDeleteDigit(firstValue);
        updateDisplayOutput(firstValue());
    }else{
        const method = operation();
        const value = firstValue();
        
        if( method === '0' || method === '=' ){
            secondValue(value);
            firstValue('+0');
            operation(btn);

            updateMiniInfo(`${Number(value)} ${btn}`, true);
        } else {
            let result, path;
            
            if(btn !== '=' && value !== '+'){
                result = calcOperation();
                path = `${value} ${btn} ${Number(secondValue())} = `

                firstValue(result);

                firstValue('+');
                secondValue(result);
            }

            updateMiniInfo(`${Number(secondValue())} ${btn}`, true);
            
            if(btn === '='){
                result = calcOperation();
                path = `${Number(secondValue())} ${operation()} ${Number(firstValue())} = `;
                
                updateMiniInfo(path, true); 
                firstValue(result);
            }

            if(result && path){
                saveResultsMemory(path, result);
                updateDisplayOutput(String(result));
            }

            operation(btn);
        }

    }

}

function setExtraOptions(option, output, miniInfo){
    const cleanResult = innerHtml(output, false);
    const clearMiniInfo = innerHtml(miniInfo, false);

    switch(option){
        case 'C':
            clearMemoryAll('value', 'value2', 'method'); 
            cleanResult('0', true);
            clearMiniInfo('', true);
        break;
        case 'CE':
            clearMemoryAll('value');

            if(operation() === '0'){
                clearMiniInfo('', true);
            }

            cleanResult('0', true);
        break;
    }
}

// Listen cliks on buttons
function listenClickButton(buttonsHtml, action, ...rest){
    const buttons = [...buttonsHtml];

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
clearMemoryAll('value', 'value2', 'method', 'history');

// Clicks on buttons 
(function (){
    const output = query('.output', false);
    const miniInfo = query('.info-display', false);

    ['.btn-number', '.btn-options', '.btn-extra', '.memory']
    .map((btn, index) => {
        const buttons = query(btn + ' li');
        
        switch(index){
            case 0:
                listenClickButton(buttons, insertNumber, output, miniInfo);
                break
            case 1:
                listenClickButton(buttons, setOperationMethods, output, miniInfo);
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


// show and hide history
!function handleCloseMemory(){
    const container = query('.history', false);
    const btnHistory = query('.t-history', false);
    
    btnHistory.addEventListener('click', () => 
    container.classList.toggle('history-active'))
}()