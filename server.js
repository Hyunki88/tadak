const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/random-sentence', (req, res) => {
  const sentences = [
    "행복은 우리가 가진 것을 소중히 여길 때 찾아옵니다.",
    "실패는 성공의 어머니이다.",
    "어제의 실패는 오늘의 성공의 디딤돌이다.",
    "자신을 믿어라, 그러면 어떤 일도 가능하다.",
    "작은 변화가 큰 차이를 만든다.",
    "행동은 모든 성공의 기초다.",
    "목표가 있어야 꿈을 이룰 수 있다.",
    "인내는 쓰지만 그 열매는 달다.",
    "도전 없는 삶은 무의미하다.",
    "삶은 우리가 만드는 것이다."
  ];
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
  res.json({ sentence: randomSentence });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
