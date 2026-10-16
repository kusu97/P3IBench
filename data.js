/* Public resources, benchmark statistics and results from the P³IBench paper. */
window.P3I = {
  resources: {
    paper: 'https://arxiv.org/abs/2610.21568',
    dataset: 'https://huggingface.co/datasets/AstroCuibing/P3IBench',
    code: 'https://github.com/Cuibing-fundemental/P3IBench'
  },
  tasks: [
    { name: 'Event Monitoring', short: 'Event', count: 233, color: '#287ca8', min: 122.6, median: 296.8, max: 359.3 },
    { name: 'Object Monitoring', short: 'Object', count: 50, color: '#70afca', min: 5.6, median: 10.6, max: 36.2 },
    { name: 'Accident Warning', short: 'Accident', count: 100, color: '#d18a29', min: 18.0, median: 40.2, max: 44.1 },
    { name: 'Crime Alert', short: 'Crime', count: 100, color: '#e9b875', min: 4.6, median: 59.4, max: 300.0 },
    { name: 'Event Intervention', short: 'Intervention', count: 50, color: '#8565b6', min: 40.6, median: 89.4, max: 512.3 }
  ],
  examples: [
    { key: 'perception', name: 'Perception', question: 'What is happening?', instruction: 'Let me know when I open a door for the second time.', times: ['231.0', '234.8', '235.5', '236.0'], focus: 2, headline: 'Recognize the right occurrence.', response: 'Second door opening detected. You opened a door earlier, and are opening one again.', descriptions: ['Earlier observations provide context for the requested occurrence.', 'Continue observing: the response target has not been reached.', 'Target response: the second door opening is identifiable.', 'Later context. The example does not require another response.'] },
    { key: 'prediction', name: 'Prediction', question: 'What may happen next?', instruction: 'Warn me if a collision may be imminent.', times: ['8.0', '16.0', '18.8', '20.0'], focus: 2, headline: 'Warn while there is time to act.', response: 'Warning! A car is pulling into our path. A collision may be imminent.', descriptions: ['Observe the driving scene.', 'Continue monitoring the evolving traffic context.', 'Target response: warn about the emerging collision risk.', 'Later context, shown for explanation only.'] },
    { key: 'intervention', name: 'Intervention', question: 'When and how should I intervene?', instruction: 'Help me buy snacks, juice, and tomatoes. Remind me before I check out.', times: ['330', '345', '355', '365'], focus: 2, headline: 'Connect progress to the user’s goal.', response: 'You’re approaching checkout. You still need tomatoes. Pick them up before paying.', descriptions: ['Track the shopping goal while observing the store.', 'Continue monitoring progress toward the goal.', 'Target response: remind the user about the missing tomatoes before checkout.', 'Later context, shown for explanation only.'] }
  ],
  // Score order: Event, Object, Accident, Crime, Intervention, Overall.
  // Table 2 for baselines; Table 5 for P³I-Assistant-4B.
  models: [
    { name: 'GLM-4.1V-9B-Base', group: 'offline', u: [0.89,26,2.11,18.15,0.93,9.62], b: [0.96,26.49,2.80,19.80,0.93,10.20] },
    { name: 'InternVL3.5-8B', group: 'offline', u: [5.43,28.02,23.19,43.81,5.89,21.27], b: [9.06,28.08,38.79,52.15,5.89,26.79] },
    { name: 'Qwen2.5-VL-3B-Instruct', group: 'offline', u: [3.44,22.38,14.91,11.25,1.49,10.69], b: [8.27,28.44,21.27,24.01,1.49,16.70] },
    { name: 'Qwen3-VL-4B-Instruct', group: 'offline', u: [14.84,32.67,30.93,35.29,9.13,24.57], b: [21.35,33.82,41.78,37.03,9.13,28.62] },
    { name: 'Qwen3-VL-8B-Instruct', group: 'offline', u: [16.17,44.38,29.21,43.65,5.53,27.79], b: [26,50.33,68.83,57.96,5.53,41.73] },
    { name: 'Qwen3.5-4B', group: 'offline', u: [13.14,30.65,18.39,36.84,5.17,20.84], b: [17.49,33.89,27.92,46.33,5.17,26.16] },
    { name: 'Qwen3.5-9B', group: 'offline', u: [10.13,37.81,15.82,42.75,3.26,21.95], b: [15.65,46.20,15.82,49.62,3.26,26.11] },
    { name: 'GPT-5.6-Luna', group: 'offline', u: [15.62,37.83,56.41,54.17,29.85,38.78], b: [24.60,41.51,74.64,62.37,29.85,46.59] },
    { name: 'Em-Garde', group: 'native', u: [2,31.92,27.45,25.59,4.74,18.34], b: [2.41,37.61,44.69,46.83,8.16,27.94] },
    { name: 'JoyVL', group: 'native', u: [9.94,29.96,19.66,43.15,4.10,21.36], b: [14.78,36.40,50.62,52.19,4.10,31.62] },
    { name: 'MMDuet2', group: 'native', u: [0.18,26,0,17,1.03,8.84], b: [0.26,26,0,17,1.03,8.86] },
    { name: 'VideoChat3', group: 'native', u: [6.08,25.82,44.09,26.83,12.84,23.13], b: [12.91,27.61,53.38,27.90,18.77,28.11] },
    { name: 'P³I-Assistant-4B', group: 'ours', u: [7.47,32.35,32.88,29.67,9.02,22.28], b: [22.77,40.03,87.59,51.21,9.02,42.12] }
  ],
  analysis: {
    // Figure 3, Accident Warning. Values are percentages of 100 GT windows.
    // Values follow the model rows in Figure 3.
    responseBuckets: [
      { label: '0 replies', color: '#c1d0da', ink: '#182a32' },
      { label: '1 reply', color: '#2c7169', ink: '#ffffff' },
      { label: '2 replies', color: '#f0d2aa', ink: '#182a32' },
      { label: '3+ replies', color: '#a35b34', ink: '#ffffff' }
    ],
    responseFrequency: [
      { name: 'Qwen2.5-VL-3B-Instruct', group: 'Adapted offline', values: [19, 26, 2, 53] },
      { name: 'JoyVL', group: 'Native proactive', values: [79, 21, 0, 0] },
      { name: 'MMDuet2', group: 'Native proactive', values: [100, 0, 0, 0] }
    ],
    // Tables 3 and 4: separate ablations, Qwen3-VL-4B, Accident PRS-B.
    contextAblations: [
      { name: 'Sampling rate', color: '#c58026', values: [{ label: '0.5 FPS', score: 39.86 }, { label: '1 FPS', score: 41.78 }, { label: '2 FPS', score: 30.02 }] },
      { name: 'Historical frames', color: '#287ca8', values: [{ label: '1 frame', score: 20.09 }, { label: '2 frames', score: 17.81 }, { label: '4 frames', score: 39.96 }, { label: 'All frames', score: 41.78 }] }
    ]
  },
  stages: [
    { name: 'Base', description: 'Qwen3-VL-4B-Instruct', values: [21.35,33.82,41.78,37.03,9.13], overall: 28.62 },
    { name: '+ SFT', description: 'Supervised fine-tuning', values: [18.10,48.62,61.78,47.04,8.05], overall: 36.72 },
    { name: '+ RL', description: 'P³I-Assistant-4B', values: [22.77,40.03,87.59,51.21,9.02], overall: 42.12 }
  ],
  failures: [
    { key: 'failure-repeat', title: 'One request. Thirteen replies.', category: 'Daily Perception', model: 'Qwen3-VL-8B-Instruct', times: ['4.000','5.000','27.000','65.000'], labels: ['First response','Target event','Later response','Later response'], instruction: 'Report the first occurrence of putting clay mix into the brick mold. Output “1” exactly once.', gt: 'One target: 4.889–7.139 s. Output “1” once.', output: '“1” at 4, 27, 46, 65, 68, 150, 166, 185, 204, 224, 242, 259, and 277 s.', takeaway: 'Repeated outputs violate the one-response constraint.' },
    { key: 'failure-late', title: 'A warning, 21.333 seconds late.', category: 'Accident Warning', model: 'GPT-5.6-Luna', times: ['18.867','19.900','20.200','40.200'], labels: ['GT warning time','Gap closes rapidly','Camera pitches upward','Model warning'], instruction: 'Warn when an imminent collision risk becomes identifiable, before the collision occurs.', gt: 'Warning target: 18.867 s. Output “Warning”.', output: 'The only “Warning” arrives at 40.200 s, 21.333 s after the target.', takeaway: 'A valid warning token can arrive too late to be useful.' },
    { key: 'failure-guidance', title: 'Recognizing is not correcting.', category: 'Event Intervention', model: 'JoyAI-VL-Interaction', times: ['29.729','35.002','37.004','40.007'], labels: ['Floor 2 landing','Downward turn','Continues descending','Returns to floor 2'], instruction: 'Guide me to room 212 on floor 2. Announce floor arrivals and correct excessive descent.', gt: 'Correction window: 35–39 s. “Already on floor 2; turn back.”', output: 'At 30 s and 35 s: “Reminder: you have arrived at the 2nd floor.” The correction is omitted.', takeaway: 'Useful guidance must identify deviations from the goal.' }
  ]
};
