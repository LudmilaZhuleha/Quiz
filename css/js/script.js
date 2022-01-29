'use strict';

const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main_title');


const getData = () => {
    return fetch('css/js/quiz_db.json').then(data => data.json())
    
};

const showElem = (elem) => {
    let opacity = 0;
    elem.opacity = opacity;
    elem.style.display ='';

    const animation = () => {
        opacity += 0.05;
        if (opacity < 1){
            requestAnimationFrame(animation);
        } 
    };

    requestAnimationFrame(animation);
}

const hideElem = (elem, cb) => {
    let opacity = getComputedStyle(elem).getPropertyValue('opacity');
    const animation = () => {
        opacity -= 0.05;
        elem.style.opacity = opacity;

        if (opacity > 0){
            requestAnimationFrame(animation);
        } else {
            elem.style.display = 'none';
            if(cb) cb();
        }
    };

    requestAnimationFrame(animation);
};

const renderTheme = (themes) => {
   const list = document.querySelector('.selection_list')
   list.textContent = '';

   /*Первый вариант for(let i=0; i<themes.length; i += 1){
       list.innerHTML += `
       <li class="selection_item">
            <button class="selection_theme">${themes[i].theme}</button>
       </li>
       `
   }*/
   const buttons = [];
   for(let i=0; i<themes.length; i += 1){
        const li = document.createElement('li');
        li.className = 'selection_item';
        
        const button = document.createElement('button');
        button.className = 'selection_theme';
        button.dataset.id = themes[i].id;
        button.textContent = themes[i].theme;
        li.append(button);

        const result = loadResult(themes[i].id);

        if(result) {
            const p = document.createElement('p');
            p.className = 'selection_result';
            p.innerHTML = `
            <span class="selection_result_ratio">${result}/${themes[i].list.length}</span>
            <span class="selection_result_text">Last result</span>
        `;
        li.append(p);
        }
        
        list.append(li);
                
        buttons.push(button);
   }
   return buttons;
}

const shuffle = array => {
    const newArray = [...array];
    for(let i = newArray.length - 1; i>0; i -=1){
        let j = Math.floor(Math.random()*(i+1));
        [newArray[i], newArray[j] ] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const saveResult = (result, id) => {
    localStorage.setItem(id, result);
}
const loadResult = id => localStorage.getItem(id);


const createKeyAnswers = data => {
    const keys =[];
    for(let i = 0; i < data.answers.length; i++){
        if(data.type === 'radio'){
            keys.push([data.answers[i], !i])
        } else {
            keys.push([data.answers[i], i < data.correct])
        }
    }

    return shuffle(keys);
}

const createAnswer = data => {
    const type = data.type;

    const answers = createKeyAnswers(data);
    const labels = answers.map((item, i) => {
        const label = document.createElement('label');
        label.className = 'answer';
        const input = document.createElement('input');
        input.type = type;
        input.name = 'answer';
        input.className = `answer_${type}`;
        input.value = i;
        const text = document.createTextNode(item[0]);
        label.append(input, text);

        return label;
    });
    const keys = answers.map(answer => answer[1]);
    return {
        labels,
        keys
    }
}

const showResult = (result, quiz) => {
    const block = document.createElement('div');
    block.className = 'main_box main_box_result result';

    let percent = result / quiz.list.length *100;
    let ratio = 0;

    for(let i = 0; i < quiz.result.length; i++){
        if(percent >= quiz.result[i][0]){
            ratio = i;
        }
    }

    block.innerHTML = `
            <h2 class="main_subtitle main_subtitle_result">Your result</h2>
            <div class="result_box">
                <p class="result_ratio result_ratio-${ratio + 1}">${result}/${quiz.list.length}</p>
                <p class="result_text">${quiz.result[ratio][1]}</p>
            </div>
    `;
    const button = document.createElement('button');
    button. className = 'main_btn main_result';
    button.textContent = 'Back to Quiz List';
    block.append(button);
    main.append(block);

    button.addEventListener('click', () =>{
        hideElem(block, () => {
            showElem(title);
            showElem(selection);
        })
    })
};

const renderQuiz = quiz => {
    hideElem(title);
    hideElem(selection);

    const questionBox = document.createElement('div');
    questionBox.className = 'main_box main_box_question';
    main.append(questionBox);

    let result = 0;
    let questionCount = 0;

    const showQuestion = () => {
        const data = quiz.list[questionCount];
        questionCount +=1;
        
        questionBox.textContent = '';

        const form = document.createElement('form');
        form.className = 'main_form_question';
        form.dataset.count = ` ${questionCount}/${quiz.list.length} `;
        

        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.className = 'main_subtitle';
        legend.textContent = data.question;

        const answersData = createAnswer(data);

        const button = document.createElement('button');
        button.className = 'main_btn question_next';
        button.type = 'submit';
        button.textContent = 'Submit';

        fieldset.append(legend, ...answersData.labels);
        form.append(fieldset, button);
        questionBox.append(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let ok = false;
            const answer = [...form.answer].map((input) => {
                if(input.checked) ok = true;
                return input.checked ? input.value : false;
            });

            if(ok) {
                if(answer.every((result, i) => {
                    return !!result === answersData.keys[i]
                 })){
                    result +=1;
                }

                if(questionCount < quiz.list.length){
                    showQuestion();
                } else {
                    hideElem(questionBox);
                    showResult(result, quiz);
                    saveResult(result, quiz.id);
                }
                
            } else {
                form.classList.add('main_form_question_error');
                setTimeout(() => {
                    form.classList.remove('main_form_question_error');
                }, 1000)
            }
        });
    }
    showQuestion();

};

const addClick = (buttons, data) => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const quiz = data.find(item => item.id === btn.dataset.id);
            renderQuiz(quiz);
        });   
    })
};

const initQuiz = async() => {

    const data = await getData();
    const buttons = renderTheme(data);

    addClick(buttons, data);
};
initQuiz();
