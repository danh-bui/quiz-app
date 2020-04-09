import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (() => {
  // cache the DOM
  const welcomePageEl = document.querySelector(".welcome-page");
  const welcomeBtnEl = document.querySelector(".welcome-btn");
  const quizEl = document.querySelector(".quiz");
  const quizQuestionEl = document.querySelector(".quiz__question");
  const trackerEl = document.querySelector(".quiz__tracker");
  const tagLineEl = document.querySelector(".quiz__tagline");
  const choicesEl = document.querySelector(".quiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const previousBtnEl = document.querySelector(".previous");
  const restartBtnEl = document.querySelector(".restart");
  const nextBtnEl = document.querySelector(".next");

  const q1 = new Question(
    "What is my name at home?",
    ["Bi", "Bom", "Bo", "Barack Obama 🤥"],
    1,
  );
  const q2 = new Question(
    "What is my favorite shirt color?",
    ["Red", "Blue", "Green", "White"],
    3
  )
  const q3 = new Question(
    "Among the following countries, where do I want to visit the most?",
    ["Germany", "Maldives", "Iceland", "France"],
    2,
  );
  const q4 = new Question(
    "What is my favorite room scent?",
    ["Lemon Grass", "Lavender", "Aloe vera", "Orange"],
    0,
  );
  const q5 = new Question(
    "What would I do if I was going to die tomorrow?",
    [
      "Call my family and tell them whatever I was thinking 👨‍👩‍👧‍👦",
      "Convince China to stop making biological weapons 🌏",
      "Panic, panic and only panic 🤯",
      "Go donate my organs 🤘",
    ],
    0,
  )

  const quiz = new Quiz([q1, q2, q3, q4, q5]);

/* ========================================================================== */
/*                                  LISTENERS                                 */
/* ========================================================================== */

  const listeners = function() {
    welcomeBtnEl.addEventListener("click", function() {
      welcomePageEl.classList.toggle("welcome-page__shift");
    })
    previousBtnEl.addEventListener("click", function() {
      // const previouslySelectedRadioEl = document.querySelector('input[name="choice"]:checked');
      // console.log(previouslySelectedRadioEl);
      // const previouslySelectedRadioEl = document.querySelector('input[name="choice"]:checked');
      console.log(quiz.getPreviousQuestion().choices);
      quiz.previousIndex();

      // renderAll();

    })
    restartBtnEl.addEventListener("click", function() {
      // 1. Reset the quiz
      quiz.resetQuiz();
      // 2. Reset the progress
      progressInnerEl.style.width = 0;
      // 3. Render the quiz all again
      renderAll();
      // 4. Restore the next and previous buttons
      previousBtnEl.style.display = "block";
      nextBtnEl.style.display = "block";
    })
    nextBtnEl.addEventListener("click", function() {
      const selectedRadioEl = document.querySelector('input[name="choice"]:checked');
      // Do something when the user doesn't check anything and click "Next"
      if (selectedRadioEl) {
        const key = Number(selectedRadioEl.getAttribute("data-order"));
        quiz.guess(key);
        renderAll();
      }
    })
  }


  const setValue = (elem, value) => {
    elem.innerHTML = value;
  }

  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);
  };

  const renderChoices = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
        <li class="quiz__choice">
          <input type="radio" class="quiz__input" data-order="${index}" id="choice${index}" name="choice">
          <label class="quiz__label" for="choice${index}">
            <span>${elem}</span>
          </label>
        </li>
      `
    })
    choicesEl.innerHTML = markup;
  }

  const renderTracker = _ => {
    const index = quiz.currentIndex;
    setValue(trackerEl, `🙃 ${index + 1} of ${quiz.questions.length} 🙃`)
  }

  const renderTagline = _ => {
    setValue(tagLineEl, `Pick an option below`);
  }

  const getPercentage = (num1, num2) => {
    return Math.round((num1/num2) * 100)
  }
  
  const launch = (width, maxPercentage) => {
    let loadingbar = setInterval(function() {
      if (width >= maxPercentage) { clearInterval(loadingbar) }
      else {
        width++;
        progressInnerEl.style.width = width + "%";
      }
    }, 10)
  }
  const renderProgress = _ => {
    // 1. width
    const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
    // 2. launch(0, width)
    launch(0, currentWidth);
  }

  const renderEndScreen = _ => {
    let finalScore = getPercentage(quiz.score, quiz.questions.length);
    setValue(trackerEl, `Your score: ${finalScore}%`);
    if (finalScore >= 80) {
      let cheers = new Audio("./../audio/cheers.mp3");
      cheers.play();
      setValue(quizQuestionEl, "👏👏👏 Excellent!!! 👏👏👏");
    } else {
      setValue(quizQuestionEl, "Good job! 😁")
    }
    setValue(tagLineEl, "Complete!");
    previousBtnEl.style.display = "none";
    nextBtnEl.style.display = "none";

    renderProgress();
  }

  const renderAll = function() {
    if (quiz.hasEnded()) {
      // render End screen
      renderEndScreen();
    } else {
      // 1. Render the question
      renderQuestion();
      // 2. Render the choices elements (li tags)
      renderChoices();
      // 3. Render the tracker
      renderTracker();
      // 4. Render the tagline
      renderTagline();
      // 5. Render the progress
      renderProgress();
    }
  }

  return {
    renderAll: renderAll,
    listeners: listeners
  }
})();
App.renderAll();
App.listeners();