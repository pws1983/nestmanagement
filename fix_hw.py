import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact old block using a pattern
old_pattern = r"      const badgeClass = \(diff !== null && diff <= 2\) \? 'badge-danger' : 'badge-pending';\s+return `\s+<div class=\"admin-hw-item\".*?`;\s+}\)\.join\(''\);"

new_block = """      const badgeClass = (diff !== null && diff <= 2 && !chk) ? 'badge-danger' : 'badge-pending';
      const badgeText = chk ? '완료' : (d ? '취소 예정' : (diff !== null ? 'D-' + diff : '미완료'));
      const dateStr = h.createdAt || '';
      let monthStr = '미정';
      let monthColor = '#cbd5e1';
      if (dateStr.length >= 7) {
        const yyyyMm = dateStr.slice(0, 7);
        const yyyy = yyyyMm.slice(0, 4);
        const mm = parseInt(yyyyMm.slice(5, 7), 10);
        monthStr = yyyy + '년<br>' + mm + '월';
        let hash = 0;
        for (let i = 0; i < yyyyMm.length; i++) hash = yyyyMm.charCodeAt(i) + ((hash << 5) - hash);
        monthColor = 'hsl(' + (Math.abs(hash * 137) % 360) + ', 65%, 55%)';
      }
      return `
        <div class="detail-hw-item" style="padding:0; overflow:hidden; align-items:stretch; cursor:pointer; margin-bottom:8px; ${chk ? 'border-color:var(--success);' : ''}" onclick="toggleCheck('${h.id}',${d})">
          <div style="flex:0 0 70px; background:${monthColor}; color:white; display:flex; align-items:center; justify-content:center; text-align:center; font-size:11px; font-weight:700; line-height:1.4;">${monthStr}</div>
          <div style="flex:1; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; ${chk ? 'background:var(--success-bg);' : ''}">
            <div class="detail-hw-info">
              <div class="detail-hw-title" style="${chk ? 'color:var(--text-muted)' : ''}">${h.title}</div>
              <div class="detail-hw-meta">${h.subject ? '<span class="cat-tag' + (h.subject.startsWith('수학') ? ' math' : '') + '" style="margin:0 6px 0 0; padding:2px 6px; font-size:10px">' + h.subject + '</span>' : ''}출제일: ${h.createdAt || '알수없음'} · <span style="color:var(--danger); font-weight:700">마감: ${h.dueDate || '미정'}</span></div>
            </div>
            <div class="detail-pct-wrap">
              <span class="detail-status hw-badge ${chk ? 'badge-done' : badgeClass}">${badgeText}</span>
              <div class="hw-checkbox ${chk ? 'checked' : ''}" style="width:22px; height:22px; margin-top:6px;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');"""

match = re.search(old_pattern, content, re.DOTALL)
if match:
    print(f"Found match at {match.start()}-{match.end()}")
    content = content[:match.start()] + new_block + content[match.end():]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated!")
else:
    print("Pattern NOT found. Trying simpler search...")
    # Try line-by-line approach
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if "const badgeClass = (diff !== null && diff <= 2) ? 'badge-danger' : 'badge-pending';" in line:
            print(f"Found at line {i+1}: {repr(line[:80])}")
            break
    else:
        print("Line not found either.")
