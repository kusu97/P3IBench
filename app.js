(() => {
  'use strict';
  const data = window.P3I;
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const framePath = (key, i) => `assets/frames/${key}-${i + 1}.jpg`;
  const format = (number) => number.toFixed(2);
  const icons = {
    paper: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    dataset: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0 0 16 0V5M4 12a8 3 0 0 0 16 0"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14"/>'
  };
  document.querySelectorAll('[data-resources]').forEach((container) => {
    container.innerHTML = Object.entries(data.resources).map(([key, url]) => {
      const label = { paper: 'Paper', dataset: 'Dataset', code: 'Code' }[key];
      return `<a class="resource-button" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><svg class="resource-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg><strong>${label}<svg class="resource-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></strong></a>`;
    }).join('');
  });

  let activeCase = 0;
  let activeFrame = 2;
  const tabs = [...document.querySelectorAll('[data-case]')];
  function renderCase() {
    const example = data.examples[activeCase];
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === activeCase));
      tab.tabIndex = i === activeCase ? 0 : -1;
    });
    const panel = $('#case-panel');
    panel.className = `case-panel ${example.key}`;
    panel.setAttribute('aria-labelledby', tabs[activeCase].id);
    panel.innerHTML = `<div class="case-copy"><span class="micro">${escapeHTML(example.question)}</span><h3>${escapeHTML(example.headline)}</h3><div class="instruction"><small>INITIAL INSTRUCTION</small><p>“${escapeHTML(example.instruction)}”</p></div><div class="target-response"><span class="micro">TARGET RESPONSE · ${example.times[example.focus]} s</span><p>${escapeHTML(example.response)}</p></div></div><div class="case-stage"><div class="case-photo"><img id="case-image" src="${framePath(example.key, activeFrame)}" alt="${escapeHTML(example.descriptions[activeFrame])}" width="744" height="418"><span class="state-pill" id="frame-state"></span><span class="frame-time" id="case-time"></span></div><div class="time-nodes" role="group" aria-label="Select a video frame">${example.times.map((time, i) => `<button class="time-node" type="button" data-frame="${i}" aria-pressed="${i === activeFrame}" aria-label="${time} seconds, ${i === example.focus ? 'target response' : i > example.focus ? 'later context' : 'observe'}">${time} s<small>${i === example.focus ? 'Respond' : i > example.focus ? 'Later context' : 'Silent'}</small></button>`).join('')}</div><p class="frame-description" id="frame-description" aria-live="polite"></p></div>`;
    updateFrame();
  }
  function updateFrame() {
    const example = data.examples[activeCase];
    $('#case-image').src = framePath(example.key, activeFrame);
    $('#case-image').alt = example.descriptions[activeFrame];
    $('#case-time').textContent = `${example.times[activeFrame]} s`;
    $('#frame-state').textContent = activeFrame === example.focus ? 'TARGET · RESPOND' : activeFrame > example.focus ? 'LATER CONTEXT' : 'OBSERVE · SILENT';
    $('#frame-description').textContent = example.descriptions[activeFrame];
    document.querySelectorAll('[data-frame]').forEach((node, i) => node.setAttribute('aria-pressed', String(i === activeFrame)));
  }
  function chooseCase(i) { activeCase = i; activeFrame = data.examples[i].focus; renderCase(); }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseCase(i));
    tab.addEventListener('keydown', (event) => {
      let next = i;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); chooseCase(next); tabs[next].focus();
    });
  });
  $('#case-panel').addEventListener('click', (event) => {
    const node = event.target.closest('[data-frame]');
    if (node) { activeFrame = Number(node.dataset.frame); updateFrame(); }
  });
  document.querySelectorAll('[data-open-case]').forEach((link) => link.addEventListener('click', () => chooseCase(Number(link.dataset.openCase))));
  renderCase();

  let cumulative = 0;
  const segments = data.tasks.map((task) => {
    const start = cumulative; cumulative += task.count / 533 * 100;
    return `${task.color} ${start}% ${cumulative}%`;
  });
  $('#donut').style.background = `conic-gradient(${segments.join(',')})`;
  $('#task-legend').innerHTML = data.tasks.map((task) => `<div class="legend-row"><span class="legend-name"><i style="background:${task.color}"></i>${task.name}</span><strong>${task.count}<small>${(task.count / 533 * 100).toFixed(1)}%</small></strong></div>`).join('');
  $('#duration-chart').innerHTML = data.tasks.map((task) => `<div class="duration-row"><div class="duration-row-head"><span>${task.name}</span><span>${task.min.toFixed(1)} / ${task.median.toFixed(1)} / ${task.max.toFixed(1)} s</span></div><div class="duration-range" role="img" aria-label="${task.name}: minimum ${task.min}, median ${task.median}, maximum ${task.max} seconds" style="--color:${task.color}"><span class="range-line" style="left:${task.min / 520 * 100}%;width:${(task.max - task.min) / 520 * 100}%"></span><span class="median-dot" style="left:calc(${task.median / 520 * 100}% - 3px)"></span></div></div>`).join('');

  function renderRanking() {
    const metric = $('input[name="metric"]:checked').value;
    const task = Number($('#task-select').value);
    const title = `${task === 5 ? 'Overall' : data.tasks[task].name} · PRS-${metric.toUpperCase()} ↑`;
    $('#ranking-title').textContent = title;
    const models = [...data.models].sort((a, b) => b[metric][task] - a[metric][task]);
    $('#ranking-chart').innerHTML = models.map((model) => `<div class="ranking-row ${model.group}" aria-label="${escapeHTML(model.name)}: ${format(model[metric][task])} ${escapeHTML(title)}"><span class="ranking-name">${escapeHTML(model.name)}${model.group === 'ours' ? '<small>OURS</small>' : ''}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${model[metric][task]}%"></div></div><span class="ranking-score">${format(model[metric][task])}</span></div>`).join('');
  }
  $('#task-select').addEventListener('change', renderRanking);
  document.querySelectorAll('input[name="metric"]').forEach((input) => input.addEventListener('change', renderRanking));
  renderRanking();

  const analysis = data.analysis;
  $('#frequency-legend').innerHTML = analysis.responseBuckets.map((bucket) => `<span><i style="background:${bucket.color}" aria-hidden="true"></i>${escapeHTML(bucket.label)}</span>`).join('');
  $('#frequency-chart').innerHTML = analysis.responseFrequency.map((model) => {
    const description = model.values.map((value, i) => `${analysis.responseBuckets[i].label}: ${value}%`).join('; ');
    return `<div class="frequency-row"><div class="frequency-model"><strong>${escapeHTML(model.name)}</strong><span>${escapeHTML(model.group)}</span></div><div class="frequency-bar" role="img" aria-label="${escapeHTML(model.name)}: ${escapeHTML(description)}">${model.values.map((value, i) => value ? `<span style="width:${value}%;background:${analysis.responseBuckets[i].color};color:${analysis.responseBuckets[i].ink}" title="${escapeHTML(analysis.responseBuckets[i].label)}: ${value}%">${value >= 10 ? `${value}%` : ''}</span>` : '').join('')}</div></div>`;
  }).join('');
  $('#context-chart').innerHTML = analysis.contextAblations.map((panel) => `<div class="context-panel"><h5>${escapeHTML(panel.name)}</h5><div class="context-axis" aria-hidden="true"><span>0</span><span>50</span></div>${panel.values.map((item) => `<div class="context-row" role="img" aria-label="${escapeHTML(panel.name)}, ${escapeHTML(item.label)}: ${format(item.score)} PRS-B"><span>${escapeHTML(item.label)}</span><div class="context-track" aria-hidden="true"><i style="width:${item.score / 50 * 100}%;background:${panel.color}"></i></div><strong>${format(item.score)}</strong></div>`).join('')}</div>`).join('');

  $('#training-stages').innerHTML = data.stages.map((stage, i) => `<div class="training-stage"><span class="micro">0${i + 1} / ${stage.name.toUpperCase()}</span><div class="stage-score"><strong>${format(stage.overall)}</strong><span>PRS-B</span></div><p>${stage.description}</p></div>`).join('');
  $('#training-table tbody').innerHTML = data.tasks.map((task, i) => `<tr><td>${task.name}</td>${data.stages.map((stage) => `<td>${format(stage.values[i])}</td>`).join('')}</tr>`).join('');
  $('#failures').innerHTML = data.failures.map((failure, index) => `<article class="failure ${['perception','prediction','intervention'][index]}"><div class="failure-header"><div><span class="micro">${failure.category}</span><h3>${failure.title}</h3></div><span class="failure-model">${failure.model}</span></div><p class="failure-instruction">${escapeHTML(failure.instruction)}</p><div class="failure-frames">${failure.times.map((time, i) => `<figure><img src="${framePath(failure.key,i)}" alt="${escapeHTML(failure.labels[i])}: ${failure.category}, at ${time} seconds" width="1006" height="566" loading="lazy"><figcaption><strong>${time} s</strong> · ${failure.labels[i]}</figcaption></figure>`).join('')}</div><div class="trace-comparison"><div><span class="micro">GROUND TRUTH</span><p>${escapeHTML(failure.gt)}</p></div><div><span class="micro">MODEL OUTPUT</span><p>${escapeHTML(failure.output)}</p></div></div><p class="failure-takeaway">${escapeHTML(failure.takeaway)}</p></article>`).join('');
})();
