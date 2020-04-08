export default function Quiz(questions) {
  this.questions = questions;
  this.score = 0;
  this.currentIndex = 0; // The index of the current question
}

Quiz.prototype.getCurrentQuestion = function() { return this.questions[this.currentIndex]; }
Quiz.prototype.nextIndex = function() { this.currentIndex++; }
Quiz.prototype.previousIndex = function() { this.currentIndex--; }
Quiz.prototype.getPreviousQuestion = function() { return this.questions[this.currentIndex - 1]; }
Quiz.prototype.hasEnded = function() { return this.currentIndex === this.questions.length; };
Quiz.prototype.guess = function(userGuess) {
  const currentQuestion = this.questions[this.currentIndex];
  if (currentQuestion.isCorrect(userGuess)) {
    this.score++;
  }
  this.nextIndex();
}
Quiz.prototype.previousQuestion = function() { this.previousIndex(); }
Quiz.prototype.resetQuiz = function() {
  this.score = 0;
  this.currentIndex = 0;
}