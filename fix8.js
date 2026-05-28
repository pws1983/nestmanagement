const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Helper to replace precisely
function replaceExact(search, replacement) {
  if (html.includes(search)) {
    html = html.replace(search, replacement);
  } else {
    console.error("COULD NOT FIND:", search);
  }
}

// 1. Add Instructor UI
replaceExact(
  '<div class="form-row"><label>입사 날짜</label><input id="new-instructor-entered" type="date"></div>',
  '<div class="form-row"><label>입사 날짜</label><input id="new-instructor-entered" type="date"></div>\n          <div class="form-row"><label>뱃지 고정 색상 지정</label>\n            <div id="new-instructor-color-picker" style="display:flex; flex-wrap:wrap; gap:8px;"></div>\n            <input type="hidden" id="new-instructor-color-index" value="">\n          </div>'
);

// 2. Edit Instructor UI
replaceExact(
  '<div class="form-row"><label>입사 날짜</label><input id="inst-edit-entered" type="date"></div>',
  '<div class="form-row"><label>입사 날짜</label><input id="inst-edit-entered" type="date"></div>\n      <div class="form-row"><label>뱃지 고정 색상 지정</label>\n        <div id="inst-edit-color-picker" style="display:flex; flex-wrap:wrap; gap:8px;"></div>\n        <input type="hidden" id="inst-edit-color-index" value="">\n      </div>'
);

// 3. addInstructor
replaceExact(
  'const studentIds = Array.from(studentChecks).map(c=>c.value);\n  if(!name){showToast(\'강사 이름을 입력해주세요.\');return;}',
  'const studentIds = Array.from(studentChecks).map(c=>c.value);\n  const colorIndex = document.getElementById(\'new-instructor-color-index\').value;\n  if(!name){showToast(\'강사 이름을 입력해주세요.\');return;}'
);
replaceExact(
  'const newInstructor = {id:\'inst-\'+Date.now(), name, loginId:finalId, password:finalPw, hp, enteredAt, subjects, schools, studentIds, status:\'재직\', paidMonths:[]};',
  'const newInstructor = {id:\'inst-\'+Date.now(), name, loginId:finalId, password:finalPw, hp, enteredAt, subjects, schools, studentIds, status:\'재직\', paidMonths:[], colorIndex};'
);
replaceExact(
  'document.getElementById(\'new-instructor-entered\').value=\'\';\n  document.querySelectorAll(\'#new-instructor-subject-wrap input\').forEach',
  'document.getElementById(\'new-instructor-entered\').value=\'\';\n  document.getElementById(\'new-instructor-color-index\').value=\'\';\n  renderColorPicker(\'new-instructor-color-picker\', \'new-instructor-color-index\', \'\', \'instructor\');\n  document.querySelectorAll(\'#new-instructor-subject-wrap input\').forEach'
);

// 4. updateInstructor
replaceExact(
  'const studentIds=Array.from(document.querySelectorAll(\'#new-instructor-student-wrap input[name="instructor-student"]:checked\')).map(c=>c.value);\n  if(!name){showToast',
  'const studentIds=Array.from(document.querySelectorAll(\'#new-instructor-student-wrap input[name="instructor-student"]:checked\')).map(c=>c.value);\n  const colorIndex = document.getElementById(\'new-instructor-color-index\').value;\n  if(!name){showToast'
);
replaceExact(
  'instructors[idx]={...instructors[idx],name,loginId:finalId,hp,enteredAt,subjects,schools,studentIds};',
  'instructors[idx]={...instructors[idx],name,loginId:finalId,hp,enteredAt,subjects,schools,studentIds,colorIndex};'
);
replaceExact(
  'document.querySelectorAll(\'#new-instructor-subject-wrap input\').forEach(c=>{c.checked=false;c.parentElement.classList.remove(\'active\');});',
  'document.getElementById(\'new-instructor-color-index\').value=\'\';\n  renderColorPicker(\'new-instructor-color-picker\', \'new-instructor-color-index\', \'\', \'instructor\');\n  document.querySelectorAll(\'#new-instructor-subject-wrap input\').forEach(c=>{c.checked=false;c.parentElement.classList.remove(\'active\');});'
);

// 5. openInstructorEditModal
replaceExact(
  'document.getElementById(\'inst-edit-entered\').value = inst.enteredAt||\'\';\n  // 과목',
  'document.getElementById(\'inst-edit-entered\').value = inst.enteredAt||\'\';\n  document.getElementById(\'inst-edit-color-index\').value = inst.colorIndex||\'\';\n  renderColorPicker(\'inst-edit-color-picker\', \'inst-edit-color-index\', inst.colorIndex||\'\', \'instructor\');\n  // 과목'
);

// 6. submitInstructorEdit
replaceExact(
  'const studentIds=Array.from(document.querySelectorAll(\'#inst-edit-student-wrap input[name="inst-edit-student"]:checked\')).map(c=>c.value);\n  if(!name)',
  'const studentIds=Array.from(document.querySelectorAll(\'#inst-edit-student-wrap input[name="inst-edit-student"]:checked\')).map(c=>c.value);\n  const colorIndex = document.getElementById(\'inst-edit-color-index\').value;\n  if(!name)'
);
replaceExact(
  'instructors[idx]={...instructors[idx],name,hp,enteredAt,subjects,schools,studentIds};',
  'instructors[idx]={...instructors[idx],name,hp,enteredAt,subjects,schools,studentIds,colorIndex};'
);

// 7. getInstructorColor
replaceExact(
  'function getInstructorColor(instructorId) {\n  if (!instructorId) return {bg:\'#e0e7ff\', text:\'#4f46e5\'};\n  let hash = 0;',
  'function getInstructorColor(instructorId, overrideColorIndex = null) {\n  if (overrideColorIndex !== undefined && overrideColorIndex !== null && overrideColorIndex !== \'\') {\n    return INSTRUCTOR_COLORS[parseInt(overrideColorIndex) % INSTRUCTOR_COLORS.length];\n  }\n  if (!instructorId) return {bg:\'#e0e7ff\', text:\'#4f46e5\'};\n  const inst = getInstructors().find(i => i.id === instructorId);\n  if (inst && inst.colorIndex !== undefined && inst.colorIndex !== null && inst.colorIndex !== \'\') {\n    return INSTRUCTOR_COLORS[parseInt(inst.colorIndex) % INSTRUCTOR_COLORS.length];\n  }\n  let hash = 0;'
);

// 8. renderColorPicker
replaceExact(
  'function renderColorPicker(containerId, inputId, selectedIdx = null) {\n  const container = document.getElementById(containerId);\n  if (!container) return;\n  const input = document.getElementById(inputId);\n  if (input && selectedIdx === null) selectedIdx = input.value;\n  \n  let html = GROUP_COLORS.map((c, i) => {\n    const isActive = selectedIdx !== null && selectedIdx !== \'\' && parseInt(selectedIdx) === i;\n    return `<div class="color-chip${isActive ? \' active\' : \'\'}" \n      style="background:${c.bg}; border-color:${c.color}" \n      onclick="selectColorChip(\'${containerId}\', \'${inputId}\', ${i})"\n      title="색상 ${i + 1}"></div>`;\n  }).join(\'\');\n  \n  html += `<button type="button" class="btn-del" style="padding:2px 8px; font-size:10px; margin-left:8px; border:1px solid var(--border); background:#fff; color:var(--text-muted)" onclick="selectColorChip(\'${containerId}\', \'${inputId}\', null)">초기화</button>`;\n  \n  container.innerHTML = html;\n}\n\nfunction selectColorChip(containerId, inputId, idx) {\n  const input = document.getElementById(inputId);\n  if (input) input.value = (idx === null || idx === undefined) ? \'\' : idx;\n  renderColorPicker(containerId, inputId, idx);\n}',
  'function renderColorPicker(containerId, inputId, selectedIdx = null, type = \'group\') {\n  const container = document.getElementById(containerId);\n  if (!container) return;\n  const input = document.getElementById(inputId);\n  if (input && selectedIdx === null) selectedIdx = input.value;\n  const palette = type === \'instructor\' ? INSTRUCTOR_COLORS : GROUP_COLORS;\n  let html = palette.map((c, i) => {\n    const isActive = selectedIdx !== null && selectedIdx !== \'\' && parseInt(selectedIdx) === i;\n    const borderColor = c.color || c.text;\n    return `<div class="color-chip${isActive ? \' active\' : \'\'}" \n      style="background:${c.bg}; border-color:${borderColor}" \n      onclick="selectColorChip(\'${containerId}\', \'${inputId}\', ${i}, \'${type}\')"\n      title="색상 ${i + 1}"></div>`;\n  }).join(\'\');\n  html += `<button type="button" class="btn-del" style="padding:2px 8px; font-size:10px; margin-left:8px; border:1px solid var(--border); background:#fff; color:var(--text-muted)" onclick="selectColorChip(\'${containerId}\', \'${inputId}\', null, \'${type}\')">초기화</button>`;\n  container.innerHTML = html;\n}\n\nfunction selectColorChip(containerId, inputId, idx, type = \'group\') {\n  const input = document.getElementById(inputId);\n  if (input) input.value = (idx === null || idx === undefined) ? \'\' : idx;\n  renderColorPicker(containerId, inputId, idx, type);\n}'
);

// 9. Add Class UI (override color)
replaceExact(
  '<div class="form-row" id="cls-instructor-row" style="display:none">\n            <label>담당 강사 (관리자 전용)</label>\n            <select id="cls-instructor">\n              <option value="">-- 전체 공통 / 지정 없음 --</option>\n            </select>\n          </div>',
  '<div class="form-row" id="cls-instructor-row" style="display:none">\n            <label>담당 강사 (관리자 전용)</label>\n            <select id="cls-instructor">\n              <option value="">-- 전체 공통 / 지정 없음 --</option>\n            </select>\n          </div>\n          <div class="form-row" id="cls-instructor-color-row" style="display:none; margin-top:-8px;">\n            <label style="font-size:11px; color:var(--text-muted)">↳ 강사 뱃지 색상 (선택 시 해당 수업에만 우선 적용)</label>\n            <div id="cls-instructor-color-picker" class="color-picker" style="display:flex; flex-wrap:wrap; gap:8px;"></div>\n            <input type="hidden" id="cls-instructor-color-index" value="">\n          </div>'
);

replaceExact(
  '<div class="modal-form-row" id="modal-cls-instructor-row" style="display:none">\n          <label>담당 강사 (관리자 전용)</label>\n          <select id="modal-cls-instructor">\n            <option value="">-- 전체 공통 / 지정 없음 --</option>\n          </select>\n        </div>',
  '<div class="modal-form-row" id="modal-cls-instructor-row" style="display:none">\n          <label>담당 강사 (관리자 전용)</label>\n          <select id="modal-cls-instructor">\n            <option value="">-- 전체 공통 / 지정 없음 --</option>\n          </select>\n        </div>\n        <div class="modal-form-row" id="modal-cls-instructor-color-row" style="display:none; margin-top:-8px;">\n          <label style="font-size:11px; color:var(--text-muted)">↳ 강사 뱃지 색상 (선택 시 해당 수업에만 우선 적용)</label>\n          <div id="modal-cls-instructor-color-picker" class="color-picker" style="display:flex; flex-wrap:wrap; gap:8px;"></div>\n          <input type="hidden" id="modal-cls-instructor-color-index" value="">\n        </div>'
);

// 10. Display Logic
replaceExact(
  'if(instRow) instRow.style.display = \'block\';\n    if(instSel) {',
  'if(instRow) instRow.style.display = \'block\';\n    const instColorRow1 = document.getElementById("cls-instructor-color-row");\n    if(instColorRow1) instColorRow1.style.display = \'block\';\n    if(instSel) {'
);
replaceExact(
  'if(instRow) instRow.style.display = \'none\';\n  }',
  'if(instRow) instRow.style.display = \'none\';\n    const instColorRow2 = document.getElementById("cls-instructor-color-row");\n    if(instColorRow2) instColorRow2.style.display = \'none\';\n  }'
);

replaceExact(
  'if(instRow) instRow.style.display = \'block\';\n  } else {',
  'if(instRow) instRow.style.display = \'block\';\n    const instColorRow3 = document.getElementById("modal-cls-instructor-color-row");\n    if(instColorRow3) instColorRow3.style.display = \'block\';\n  } else {'
);
// Careful, there might be another match for the above. We will handle the else block:
replaceExact(
  'if(instRow) instRow.style.display = \'none\';\n  }\n  \n  document.getElementById(\'modal-cls-date\').value = c.date || \'\';',
  'if(instRow) instRow.style.display = \'none\';\n    const instColorRow4 = document.getElementById("modal-cls-instructor-color-row");\n    if(instColorRow4) instColorRow4.style.display = \'none\';\n  }\n  \n  document.getElementById(\'modal-cls-date\').value = c.date || \'\';'
);

// 11. init in setupClassForm
replaceExact(
  'renderColorPicker(\'cls-color-picker\', \'cls-color-index\', \'\');\n  \n  document.getElementById(\'cls-date-1\').value',
  'renderColorPicker(\'cls-color-picker\', \'cls-color-index\', \'\');\n  document.getElementById(\'cls-instructor-color-index\').value=\'\';\n  renderColorPicker(\'cls-instructor-color-picker\', \'cls-instructor-color-index\', \'\', \'instructor\');\n  \n  document.getElementById(\'cls-date-1\').value'
);

// 12. openClassEditModal (Edit single class) UI init
replaceExact(
  'document.getElementById(\'modal-cls-instructor\').value = c.instructorId || \'\';\n  document.getElementById(\'modal-cls-subject\').value',
  'document.getElementById(\'modal-cls-instructor\').value = c.instructorId || \'\';\n  document.getElementById(\'modal-cls-instructor-color-index\').value = c.instructorColorIndex || \'\';\n  renderColorPicker(\'modal-cls-instructor-color-picker\', \'modal-cls-instructor-color-index\', c.instructorColorIndex || \'\', \'instructor\');\n  document.getElementById(\'modal-cls-subject\').value'
);

// 13. openClassSeriesEditModal UI init
replaceExact(
  'document.getElementById(\'cls-instructor\').value = c.instructorId || \'\';\n  \n  document.getElementById(\'cls-color-index\').value',
  'document.getElementById(\'cls-instructor\').value = c.instructorId || \'\';\n  \n  document.getElementById(\'cls-color-index\').value' // Actually, let's inject after renderColorPicker
);
replaceExact(
  'renderColorPicker(\'cls-color-picker\', \'cls-color-index\', c.colorIndex);\n  \n  // Only Slot 1 for editing',
  'renderColorPicker(\'cls-color-picker\', \'cls-color-index\', c.colorIndex);\n  document.getElementById(\'cls-instructor-color-index\').value = c.instructorColorIndex || \'\';\n  renderColorPicker(\'cls-instructor-color-picker\', \'cls-instructor-color-index\', c.instructorColorIndex || \'\', \'instructor\');\n  \n  // Only Slot 1 for editing'
);


// 14. Update saving logic - submitClassForm
replaceExact(
  'colorIndex,\n        instructorId,\n        instructorName\n      });',
  'colorIndex,\n        instructorId,\n        instructorName,\n        instructorColorIndex: document.getElementById(\'cls-instructor-color-index\') ? document.getElementById(\'cls-instructor-color-index\').value : \'\'\n      });'
);
replaceExact(
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName\n    } : c);',
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName,\n      instructorColorIndex: document.getElementById(\'cls-instructor-color-index\') ? document.getElementById(\'cls-instructor-color-index\').value : \'\'\n    } : c);'
);
replaceExact(
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName\n            });',
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName,\n              instructorColorIndex: document.getElementById(\'cls-instructor-color-index\') ? document.getElementById(\'cls-instructor-color-index\').value : \'\'\n            });'
);
replaceExact(
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName\n        });',
  'subject: selectedSubject, assignedTo, colorIndex, instructorId, instructorName,\n          instructorColorIndex: document.getElementById(\'cls-instructor-color-index\') ? document.getElementById(\'cls-instructor-color-index\').value : \'\'\n        });'
);

// 15. submitModalClassEdit
replaceExact(
  'subject: document.getElementById(\'modal-cls-subject\').value,\n        colorIndex: document.getElementById(\'modal-cls-color-index\').value,\n        instructorId: instId,\n        instructorName: instName\n      });',
  'subject: document.getElementById(\'modal-cls-subject\').value,\n        colorIndex: document.getElementById(\'modal-cls-color-index\').value,\n        instructorId: instId,\n        instructorName: instName,\n        instructorColorIndex: document.getElementById(\'modal-cls-instructor-color-index\') ? document.getElementById(\'modal-cls-instructor-color-index\').value : \'\'\n      });'
);
replaceExact(
  'subject: document.getElementById(\'modal-cls-subject\').value,\n        colorIndex: document.getElementById(\'modal-cls-color-index\').value,\n        instructorId: instId,\n        instructorName: instName\n      } : c);',
  'subject: document.getElementById(\'modal-cls-subject\').value,\n        colorIndex: document.getElementById(\'modal-cls-color-index\').value,\n        instructorId: instId,\n        instructorName: instName,\n        instructorColorIndex: document.getElementById(\'modal-cls-instructor-color-index\') ? document.getElementById(\'modal-cls-instructor-color-index\').value : \'\'\n      } : c);'
);

// 16. Replace usages of getInstructorColor
html = html.replace(/getInstructorColor\(c\.instructorId\)/g, 'getInstructorColor(c.instructorId, c.instructorColorIndex)');
html = html.replace(/getInstructorColor\(targetInstructorId\)/g, 'getInstructorColor(targetInstructorId, cInst ? cInst.instructorColorIndex : cSeries.instructorColorIndex)');

// 17. switchTab Instructors init
replaceExact(
  'if (grid) grid.style.gridTemplateColumns = \'320px 1fr\';\n    }\n    renderSubjectCheckboxes(\'new-instructor-subject-wrap\', \'instructor-subj\', [], true);',
  'if (grid) grid.style.gridTemplateColumns = \'320px 1fr\';\n    }\n    renderColorPicker(\'new-instructor-color-picker\', \'new-instructor-color-index\', \'\', \'instructor\');\n    renderSubjectCheckboxes(\'new-instructor-subject-wrap\', \'instructor-subj\', [], true);'
);

fs.writeFileSync('index.html', html);
console.log("Done successfully.");
