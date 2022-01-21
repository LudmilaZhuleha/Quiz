'use strict';

const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main_title');


const getData = () => {
    const dataBase = [
        {
            id: '01',
            theme: 'Theme01',
            result: [
                [40, "The last but not the least"],
                [80, "Good result, but you can do better"],
                [100, "Excellent result"]
            ],
            list: [
                {
                    type: 'checkbox',
                    question: 'Question10',
                    answers: ['correct 1', 'correct2', 'not-correct', 'not-correct'],
                    correct: 2,
                },
                {
                    type: 'radio',
                    question: 'Question11',
                    answers: ['correct 1', 'not-correct', 'not-correct', 'not-correct'],
                },
                {
                    type: 'checkbox',
                    question: 'Question12',
                    answers: ['correct 1', 'correct2', 'correct3', 'not-correct'],
                    correct: 3,
                },
                {
                    type: 'radio',
                    question: 'Question13',
                    answers: ['not-correct', 'correct2', 'not-correct', 'not-correct'],
                    
                },
                {
                    type: 'checkbox',
                    question: 'Question14',
                    answers: ['correct 1', 'correct2', 'not-correct', 'not-correct'],
                    correct: 2,
                },
                {
                    type: 'checkbox',
                    question: 'Question15',
                    answers: ['correct 1', 'correct2', 'correct3', 'correct4'],
                    correct: 4,
                }
            ]
        },
        {
            id: '02',
            theme: 'Theme02',
            result: [
                [30, "The last but not the least"],
                [60, "Good result, but you can do better"],
                [100, "Excellent result"]
            ],
            list: [
                {
                    type: 'radio',
                    question: 'Question1',
                    answers: ['correct 1', 'not-correct', 'not-correct', 'not-correct'],
                },
                {
                    type: 'radio',
                    question: 'Question2',
                    answers: ['correct 1', 'not-correct', 'not-correct', 'not-correct'],
                },
                {
                    type: 'checkbox',
                    question: 'Question3',
                    answers: ['correct 1', 'correct2', 'correct3', 'not-correct'],
                    correct: 3,
                },
                {
                    type: 'radio',
                    question: 'Question4',
                    answers: ['not-correct', 'correct2', 'not-correct', 'not-correct'],
                    
                },
                {
                    type: 'checkbox',
                    question: 'Question5',
                    answers: ['correct 1', 'correct2', 'not-correct', 'not-correct'],
                    correct: 2,
                },
            ]
        }
    ];
    return dataBase;
}

const hideElem = elem => {
    let opacity = getComputedStyle(elem).getPropertyValue('opacity');
    const animation = () => {
        opacity -= 0.05;
        elem.style.opacity = opacity;

        if (opacity > 0){
            requestAnimationFrame(animation);
        } else {
            elem.style.display = 'none';
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

        list.append(li);
        li.append(button);
        
        buttons.push(button);
   }
   return buttons;
}

const createAnswer = data => {
    const type = data.type;
    return data.answers.map(item => {
        const label = document.createElement('label');
        label.className = 'answer';
        const input = document.createElement('input');
        input.type = type;
        input.name = 'answer';
        input.className = `answer_${type}`;
        const text = document.createTextNode(item);
        label.append(input, text);

        return label;
    })
}

const renderQuiz = quiz => {
    hideElem(title);
    hideElem(selection);

    const questionBox = document.createElement('div');
    questionBox.className = 'main_box main_box_question';
    main.append(questionBox);

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

        const answers = createAnswer(data);

        const button = document.createElement('button');
        button.className = 'main_btn question_next';
        button.type = 'submit';
        button.textContent = 'Submit';

        fieldset.append(legend, ...answers);
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
                console.log(answer);
            } else {
                console.error('Please, choose the answer');
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

const initQuiz = () => {

    const data = getData();
    const buttons = renderTheme(data);

    addClick(buttons, data);
}
initQuiz();
