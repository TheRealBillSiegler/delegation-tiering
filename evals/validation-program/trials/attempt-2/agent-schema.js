// Print, for each session JSONL given, the Agent tool's parameter names and the effort and model enums.
// The definition sits on the one line whose attachment carries the tool list: attachment.tools[].schema.input_schema.
const fs = require('fs');
const path = require('path');
for (const f of process.argv.slice(2)) {
  const line = fs.readFileSync(f, 'utf8').split('\n').find((l) => l.includes('"tools":[{"name":'));
  if (!line) { console.log(path.basename(f), '| no tool list line'); continue; }
  const o = JSON.parse(line);
  const agent = (o.attachment && o.attachment.tools || []).find((t) => t.name === 'Agent');
  if (!agent) { console.log(path.basename(f), '| no Agent tool'); continue; }
  const props = agent.schema && agent.schema.input_schema && agent.schema.input_schema.properties || {};
  const e = props.effort, m = props.model;
  console.log(path.basename(f).slice(0, 8), '| params:', Object.keys(props).join(','), '| effort:', e ? JSON.stringify(e.enum) : 'ABSENT', '| model:', m ? JSON.stringify(m.enum) : 'ABSENT');
}
