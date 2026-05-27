const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// ── PATCH 1: 헤더 색상 원래대로 되돌리기 ──────────────────────
const wrongCard =
  '        <div class="prog-group-card" style="border-left:4px solid #3b82f6; margin-bottom:12px">\r\n' +
  '          <div class="prog-group-header" style="background:#eff6ff; padding:12px 14px; border-radius:12px 12px 0 0">\r\n' +
  '            <div class="prog-group-title" style="color:#2563eb; font-size:16px">${label}${subjectBadge}\r\n' +
  '              ${headerDateStr}\r\n' +
  '            </div>\r\n' +
  '          </div>';

const origCard =
  '        <div class="prog-group-card" style="border-left:4px solid ${gc.color}; margin-bottom:12px">\r\n' +
  '          <div class="prog-group-header" style="background:${gc.bg}; padding:12px 14px; border-radius:12px 12px 0 0">\r\n' +
  '            <div class="prog-group-title" style="color:${gc.color}; font-size:16px">${label}${subjectBadge}\r\n' +
  '              ${headerDateStr}\r\n' +
  '            </div>\r\n' +
  '          </div>';

if (content.includes(wrongCard)) {
  content = content.replace(wrongCard, origCard);
  console.log('PATCH 1 SUCCESS: 헤더 색상 원복 완료');
} else {
  console.log('PATCH 1 SKIP: 이미 원복되어 있거나 다른 상태');
}

// ── PATCH 2: 체크된(isDone) 진도 항목을 연한 파란색으로 ──────────
// 기존: background:var(--success-bg); border-color:var(--success);
// 변경: background:#eff6ff; border-color:#3b82f6;
const oldIsDone = "${isDone?'background:var(--success-bg); border-color:var(--success);':''}\" onclick=\"toggleStudentProgress";
const newIsDone = "${isDone?'background:#eff6ff; border-color:#3b82f6;':''}\" onclick=\"toggleStudentProgress";

if (content.includes(oldIsDone)) {
  content = content.replace(oldIsDone, newIsDone);
  console.log('PATCH 2 SUCCESS: 체크된 항목 배경색 → 연한 파란색');
} else {
  console.log('PATCH 2 FAILED: 대상 문자열을 찾지 못했습니다');
  process.exit(1);
}

// ── PATCH 3: 체크박스 checked 색상도 파란색으로 ────────────────
// hw-checkbox checked 클래스는 CSS에서 green으로 정의되어 있음
// 학생 진도 체크박스만 파란색으로: inline style 추가
const oldCheckbox = '              <div class="hw-checkbox ${isDone ? \'checked\' : \'\'}" style="width:20px; height:20px; flex-shrink:0; margin-top:2px"></div>';
const newCheckbox = '              <div class="hw-checkbox ${isDone ? \'checked\' : \'\'}" style="width:20px; height:20px; flex-shrink:0; margin-top:2px; ${isDone ? \'background:#3b82f6; border-color:#3b82f6;\' : \'\'}"></div>';

if (content.includes(oldCheckbox)) {
  content = content.replace(oldCheckbox, newCheckbox);
  console.log('PATCH 3 SUCCESS: 체크박스 파란색 적용');
} else {
  console.log('PATCH 3 FAILED: 체크박스 문자열 못찾음');
  // 진행은 계속 (없어도 기능상 무방)
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('\n완료!');
