const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let ideas = [];
let nextId = 1;

// 목록 확인
app.get('/api/ideas', (req, res) => {
  res.json(ideas);
});

// 새 뉴스 소재 등록
app.post('/api/ideas', (req, res) => {
  const { title, fact } = req.body;

  if (!title || !fact) {
    return res.status(400).json({ error: '제목과 핵심 사실을 입력하세요.' });
  }

  const idea = { id: nextId++, title, fact };
  ideas.push(idea);

  res.status(201).json(idea);
});

// 기존 소재 전체 수정
app.put('/api/ideas/:id', (req, res) => {
  const id = Number(req.params.id);
  const idea = ideas.find(item => item.id === id);
  const { title, fact } = req.body;

  if (!idea) {
    return res.status(404).json({ error: '해당 소재가 없습니다.' });
  }
  if (!title || !fact) {
    return res.status(400).json({ error: '제목과 핵심 사실을 모두 입력하세요.' });
  }

  idea.title = title;
  idea.fact = fact;
  res.json(idea);
});

// 소재 삭제
app.delete('/api/ideas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = ideas.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: '해당 소재가 없습니다.' });
  }

  const [deleted] = ideas.splice(index, 1);
  res.json({ message: '삭제 완료', deleted });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});