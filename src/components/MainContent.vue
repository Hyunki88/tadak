<template>
  <div class="container">
    <h1>타닥</h1>
    <div class="text-container">
      <p id="text-to-type" v-html="getFormattedText()"></p>
      <input ref="typingInput" class="typing-input" type="text" spellcheck="false" style="border: none; outline: none;" size="80" placeholder="Start typing..." @input="handleInput" @keydown.enter="handleEnter">
      <div class="underline"></div>
    </div>
    <div id="feedback">
      <p id="cpm">CPM: {{cpm}} Average CPM: {{Math.round(totalCpm/finished)}}</p>
      <p id="wpm">WPM: {{wpm}} Average WPM: {{Math.round(totalWpm/finished)}}</p>
    </div>
  </div>
</template>

<script>
import Hangul from 'hangul-js'; 
export default {
  name: 'MainContent',
  props: {
    msg: String
  },
  data() {
    return {
      text: "지금은 테스트중입니다.",
      inputText: '',
      wordCount: 0,
      charCount: 0,
      elapsedTime: 0,
      wpm: 0,
      cpm: 0,
      totalCpm: 0,
      totalWpm: 0,
      finished: 0,
      start: false
    };
  },
  methods: {
    async fetchRandomSentence() {
      try {
        const response = await fetch('http://localhost:3000/random-sentence');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.text = data.sentence;
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    },
    handleInput(event) {
    this.start = true;
    this.inputText = event.target.value;
    
    const disassembled = Hangul.disassemble(this.inputText);

    this.charCount = disassembled.length;
    
    // 단어 수 계산
    this.wordCount = this.inputText.trim().split(/\s+/).length;
      },
    calculateSpeed() {
      this.wpm = Math.round(this.wordCount / (this.elapsedTime / 60));
      this.cpm = Math.round(this.charCount / (this.elapsedTime / 60));
    },
    getFormattedText() {
      let displayText = '';
      for (let i = 0; i < this.inputText.length; i++) {
        if (this.inputText[i] === this.text[i]) {
          displayText += `<span class="correct">${this.inputText[i]}</span>`;
        } else {
          displayText += `<span class="incorrect">${this.inputText[i]}</span>`;
        }
      }
      if (this.inputText.length < this.text.length) {
        displayText += this.text.slice(this.inputText.length);
      }
      return displayText;
    },
    handleEnter() {
      if (this.inputText.length < this.text.length) {
        return;
      } else {
        this.start = false;
        let tempCpm = this.cpm;
        let tempWpm = this.wpm;
        this.finished++;
        this.totalCpm += tempCpm;
        this.totalWpm += tempWpm;
        this.elapsedTime = 0;
        this.cpm = 0;
        this.wpm = 0;
        this.inputText = ''; // 현재 입력한 내용을 모두 지움
        this.$refs.typingInput.value = ''; // 입력 필드를 지움
        this.fetchRandomSentence(); // 새로운 문장 가져오기
      }
    }
  },
  async mounted() {
    await this.fetchRandomSentence();
    setInterval(() => {
      if (this.inputText === '') {
        this.elapsedTime = 0;
        this.wpm = 0;
        this.cpm = 0;
      } else if (!this.start && this.elapsedTime <= 0) {
        this.elapsedTime = 0;
        this.wpm = 0;
        this.cpm = 0;
      } else {
        this.elapsedTime += 0.1;
        this.calculateSpeed();
      }
    }, 100);  // 주기를 100ms로 변경
    }
};
</script>

<style>
.correct { color: black; }
.incorrect { color: red; }

.container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 60%;
  text-align: center;
}

.text-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
  width: 100%;
}

.underline {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background-color: #007bff;
  pointer-events: none;
}

.text-container input {
  border: none;
  resize: none;
  padding-bottom: 3px;
  font-size: 1em;
  width: 100%;
}

#text-to-type {
  color: #a3a3a3;
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: left;
}

#cpm, #wpm {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.typing-input {
  width: 100%;
  font-size: 1em;
}

#feedback {
  margin-top: 20px;
  font-size: 1em;
}
</style>
