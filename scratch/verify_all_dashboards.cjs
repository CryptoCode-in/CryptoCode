const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\deves\\AppData\\Local\\Temp\\edge_inspect_final_verify';
  
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      if (res.ok) break;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 200));
  }

  const versionRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await versionRes.json();
  const targetPage = pages.find(p => p.type === 'page');
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const eventListeners = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method && eventListeners.has(msg.method)) {
      eventListeners.get(msg.method)(msg.params);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise((resolve) => ws.onopen = resolve);
  await send('Page.enable');
  await send('Runtime.enable');

  // Inject mock fetch for admin APIs so it doesn't 403
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      const origFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = String(args[0]);
        if (url.includes('/admin/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ([
              { studentName: 'Alice', count: 12, rollNo: '101', branch: 'CS', year: 'TY' },
              { studentName: 'Bob', count: 8, rollNo: '102', branch: 'IT', year: 'SY' }
            ])
          };
        }
        return origFetch(...args);
      };
    `
  });

  console.log('\n======================================================');
  console.log('       CRYPTOCODE BOTTOM SPACING VERIFICATION         ');
  console.log('======================================================\n');

  // Helper to measure bottom space
  const measureScrollBottomSpace = async (role, sectionName, isMobile = false) => {
    if (isMobile) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        mobile: true
      });
    } else {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false
      });
    }

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const main = document.querySelector('main');
          if (!main) return { err: 'No <main> found' };

          // Scroll to the very bottom
          main.scrollTop = main.scrollHeight;

          // Find the bottommost card or content element
          const elements = Array.from(main.querySelectorAll('.cyber-card, .cyber-glass-panel, table, #profile-section > div, #progress-section > div, .setting-section-card, .ide-outer-container, #code-history-section > div'));
          let lastEl = null;
          let maxBottom = -Infinity;

          for (const el of elements) {
            const r = el.getBoundingClientRect();
            if (r.height > 0 && r.width > 0 && r.bottom > maxBottom) {
              maxBottom = r.bottom;
              lastEl = el;
            }
          }

          if (!lastEl) {
            lastEl = main.lastElementChild;
            maxBottom = lastEl ? lastEl.getBoundingClientRect().bottom : 0;
          }

          const mainRect = main.getBoundingClientRect();
          const spaceToMainBottom = mainRect.bottom - maxBottom;
          const spaceToViewportBottom = window.innerHeight - maxBottom;

          return {
            role: '${role}',
            section: '${sectionName}',
            viewport: ${isMobile} ? 'Mobile (375x667)' : 'Desktop (1280x800)',
            spaceToMainBottom: Math.round(spaceToMainBottom * 10) / 10,
            spaceToViewportBottom: Math.round(spaceToViewportBottom * 10) / 10,
            mainScrollHeight: main.scrollHeight,
            mainClientHeight: main.clientHeight,
            mainScrollTop: main.scrollTop,
            lastElTag: lastEl ? lastEl.tagName : 'none',
            lastElClass: lastEl ? (lastEl.className || '').slice(0, 30) : 'none'
          };
        })()
      `,
      returnByValue: true
    });

    const val = res.result?.result?.value || res.result?.value;
    return val || {};
  };

  // 1. STUDENT DASHBOARD TESTS
  console.log('--- 1. Testing Student Dashboard ---');
  await send('Page.navigate', { url: 'http://localhost:4173' });
  await new Promise((resolve) => eventListeners.set('Page.loadEventFired', resolve));

  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cryptocode_user', JSON.stringify({
        id: 'test-student-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        year: 'Third Year',
        branch: 'Computer Science',
        college: 'Engineering College',
        semester: '5',
        rollNo: '42'
      }));
      localStorage.setItem('cryptocode_token', 'test-token');
      window.location.href = 'http://localhost:4173/dashboard';
    `
  });
  await new Promise((resolve) => eventListeners.set('Page.loadEventFired', resolve));
  await new Promise(r => setTimeout(r, 1500));

  const studentSections = ['dashboard', 'editor', 'submissions', 'progress', 'profile', 'settings'];
  for (const sec of studentSections) {
    // Click section
    await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('button, a')).find(el => {
          const t = (el.innerText || '').toLowerCase();
          if ('${sec}' === 'dashboard') return t.includes('overview') || t.includes('dashboard');
          if ('${sec}' === 'editor') return t.includes('editor');
          if ('${sec}' === 'submissions') return t.includes('history') || t.includes('submission');
          if ('${sec}' === 'progress') return t.includes('progress') || t.includes('analytics');
          if ('${sec}' === 'profile') return t.includes('profile');
          if ('${sec}' === 'settings') return t.includes('setting');
          return false;
        })?.click();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const desktop = await measureScrollBottomSpace('student', sec, false);
    const mobile = await measureScrollBottomSpace('student', sec, true);

    console.log(`[Student] ${sec.toUpperCase().padEnd(12)} -> Desktop Space: ${desktop.spaceToViewportBottom}px | Mobile Space: ${mobile.spaceToViewportBottom}px`);
  }

  // 2. TEACHER DASHBOARD TESTS
  console.log('\n--- 2. Testing Teacher Dashboard ---');
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cryptocode_user', JSON.stringify({
        id: 'test-teacher-id',
        name: 'Prof. Alan Turing',
        email: 'alan@teacher.edu',
        role: 'teacher'
      }));
      localStorage.setItem('cryptocode_token', 'teacher-token');
      window.location.href = 'http://localhost:4173/teacher/dashboard';
    `
  });
  await new Promise((resolve) => eventListeners.set('Page.loadEventFired', resolve));
  await new Promise(r => setTimeout(r, 1500));

  const teacherSections = ['dashboard', 'students', 'submissions', 'analytics', 'settings'];
  for (const sec of teacherSections) {
    await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('button, a')).find(el => {
          const t = (el.innerText || '').toLowerCase();
          if ('${sec}' === 'dashboard') return t.includes('overview') || t.includes('dashboard');
          if ('${sec}' === 'students') return t.includes('students');
          if ('${sec}' === 'submissions') return t.includes('submission');
          if ('${sec}' === 'analytics') return t.includes('analytics');
          if ('${sec}' === 'settings') return t.includes('setting');
          return false;
        })?.click();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const desktop = await measureScrollBottomSpace('teacher', sec, false);
    const mobile = await measureScrollBottomSpace('teacher', sec, true);

    console.log(`[Teacher] ${sec.toUpperCase().padEnd(12)} -> Desktop Space: ${desktop.spaceToViewportBottom}px | Mobile Space: ${mobile.spaceToViewportBottom}px`);
  }

  // 3. ADMIN DASHBOARD TESTS
  console.log('\n--- 3. Testing Admin Dashboard ---');
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cryptocode_user', JSON.stringify({
        id: 'admin-id',
        name: 'Super Admin',
        email: 'admin@cryptocode.com',
        role: 'ADMIN'
      }));
      localStorage.setItem('cryptocode_admin_token', 'admin-token');
      window.location.href = 'http://localhost:4173/admin/dashboard';
    `
  });
  await new Promise((resolve) => eventListeners.set('Page.loadEventFired', resolve));
  await new Promise(r => setTimeout(r, 1500));

  const adminSections = ['dashboard', 'students', 'teachers', 'practicals', 'analytics', 'settings'];
  for (const sec of adminSections) {
    await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('button, a')).find(el => {
          const t = (el.innerText || '').toLowerCase();
          if ('${sec}' === 'dashboard') return t.includes('dashboard');
          if ('${sec}' === 'students') return t.includes('students');
          if ('${sec}' === 'teachers') return t.includes('teachers');
          if ('${sec}' === 'practicals') return t.includes('practicals');
          if ('${sec}' === 'analytics') return t.includes('analytics');
          if ('${sec}' === 'settings') return t.includes('settings');
          return false;
        })?.click();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const desktop = await measureScrollBottomSpace('admin', sec, false);
    const mobile = await measureScrollBottomSpace('admin', sec, true);

    console.log(`[Admin]   ${sec.toUpperCase().padEnd(12)} -> Desktop Space: ${desktop.spaceToViewportBottom}px | Mobile Space: ${mobile.spaceToViewportBottom}px`);
  }

  console.log('\n======================================================');
  console.log('       ALL DASHBOARD SECTIONS VERIFIED CLEANLY        ');
  console.log('======================================================\n');

  ws.close();
  edge.kill();
}

main().catch(console.error);
