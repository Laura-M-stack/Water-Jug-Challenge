// 🔁 Greatest Common Divisor (GCD) helper function
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  
  // 🧠 Solve the Water Jug Problem using simulation
  function solveWaterJug(x, y, z) {
    if (z > Math.max(x, y)) return { steps: [], solution: false };
    if (z % gcd(x, y) !== 0) return { steps: [], solution: false };
  
    // Helper to simulate pouring process
    const simulate = (fromCap, toCap) => {
      let from = 0, to = 0;
      const result = [];
  
      while (from !== z && to !== z) {
        if (from === 0) {
          from = fromCap;
          result.push({ x: fromCap === x ? from : to, y: fromCap === x ? to : from, action: `Fill ${fromCap === x ? 'X' : 'Y'}` });
        }
  
        const transfer = Math.min(from, toCap - to);
        to += transfer;
        from -= transfer;
        const action = `Transfer ${fromCap === x ? 'X → Y' : 'Y → X'}`;
        result.push({ x: fromCap === x ? from : to, y: fromCap === x ? to : from, action });
  
        if (from === z || to === z) {
          result[result.length - 1].action += '. SOLVED';
          break;
        }
  
        if (to === toCap) {
          to = 0;
          result.push({ x: fromCap === x ? from : to, y: fromCap === x ? 0 : from, action: `Empty ${toCap === y ? 'Y' : 'X'}` });
        }
      }
  
      return result;
    };
  
    const path1 = simulate(x, y);
    const path2 = simulate(y, x);
    const shortest = path1.length <= path2.length ? path1 : path2;
  
    return { steps: shortest, solution: true };
  }
  
  // 🔧 DOM elements and state variables
  const nextBtn = document.getElementById('nextStepBtn');
  const resultDiv = document.getElementById('result');
  const visualDiv = document.getElementById('visualResult');
  const tableDiv = document.getElementById('tableResult');
  const finalMsg = document.getElementById('finalMessage');
  let stepIndex = 0;
  let stepData = [];
  
  // ▶️ Solve button handler
  solveBtn.addEventListener('click', () => {
    // Clear previous results and messages
    resultDiv.textContent = '';
    visualDiv.innerHTML = '';
    tableDiv.innerHTML = '';
    tableDiv.classList.add('hidden');
    visualDiv.classList.add('hidden');
    finalMsg.textContent = '';
  
    const x = parseInt(document.getElementById('x').value);
    const y = parseInt(document.getElementById('y').value);
    const z = parseInt(document.getElementById('z').value);
    const viewMode = document.getElementById('viewMode').value;
  
    if (!x || !y || !z || x <= 0 || y <= 0 || z <= 0) {
      resultDiv.textContent = 'Please enter valid positive numbers.';
      nextBtn.classList.add('hidden');
      nextBtn.disabled = true;
      return;
    }
  
    const { steps, solution } = solveWaterJug(x, y, z);
    stepData = steps;
    stepIndex = 0;
    nextBtn.disabled = !solution;
  
    if (!solution) {
      resultDiv.textContent = 'No Solution';
      nextBtn.classList.add('hidden');
      return;
    }
  
    if (viewMode === 'table') {
      // Render as table
      const table = document.createElement('table');
      const header = document.createElement('tr');
      header.innerHTML = '<th>Bucket X</th><th>Bucket Y</th><th>Explanation</th>';
      table.appendChild(header);
      steps.forEach((step, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${step.x}</td><td>${step.y}</td><td>${step.action}</td>`;
        table.appendChild(row);
      });
      tableDiv.appendChild(table);
      tableDiv.classList.remove('hidden');
      nextBtn.classList.add('hidden');
      // ✅ Show final message also in table mode
      finalMsg.textContent = '✅ Target reached! Solution complete.';
    } else {
      // Prepare visual mode step-by-step
      visualDiv.classList.remove('hidden');
      visualDiv.innerHTML = '';
      nextBtn.classList.remove('hidden');
    }
  });
  
  // ⏭️ Next Step button handler
  nextBtn.addEventListener('click', () => {
    if (stepIndex >= stepData.length) {
      nextBtn.disabled = true;
      nextBtn.classList.add('hidden');
      finalMsg.textContent = '✅ Target reached! Solution complete.';
      return;
    }
  
    const step = stepData[stepIndex];
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
  
    const jugX = createJug(step.x, parseInt(document.getElementById('x').value), 'X');
    const jugY = createJug(step.y, parseInt(document.getElementById('y').value), 'Y');
  
    const action = document.createElement('div');
    action.className = 'action';
    action.innerHTML = step.action;
  
    stepDiv.appendChild(jugX);
    stepDiv.appendChild(jugY);
    stepDiv.appendChild(action);
  
    visualDiv.appendChild(stepDiv);
    stepIndex++;
  });
  
  // 🪣 Create jug visual
  function createJug(current, capacity, label) {
    const jugContainer = document.createElement('div');
    const jug = document.createElement('div');
    jug.className = 'jug';
    const fill = document.createElement('div');
    fill.className = 'jug-fill';
    fill.style.height = `${(current / capacity) * 100}%`;
    const lbl = document.createElement('div');
    lbl.className = 'jug-label';
    lbl.textContent = `Jug ${label}: ${current} / ${capacity} gal`;
  
    jug.appendChild(fill);
    jugContainer.appendChild(jug);
    jugContainer.appendChild(lbl);
  
    return jugContainer;
  }
  
  // 🔄 Reset button handler
  resetBtn.addEventListener('click', () => {
    document.getElementById('x').value = '';
    document.getElementById('y').value = '';
    document.getElementById('z').value = '';
  
    resultDiv.textContent = '';
    visualDiv.innerHTML = '';
    tableDiv.innerHTML = '';
    tableDiv.classList.add('hidden');
    visualDiv.classList.add('hidden');
    finalMsg.textContent = '';
  
    stepIndex = 0;
    stepData = [];
    nextBtn.disabled = true;
    nextBtn.classList.add('hidden');
  });
  
  