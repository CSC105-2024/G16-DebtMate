const { exec } = require("child_process");

const commitCommands = [
  `git add src/pages/Login.jsx src/pages/SignUp.jsx src/pages/SettingsPage.jsx src/App.jsx && git commit -m "refactor(frontend): update API endpoints" -m "- Update API endpoint paths" -m "- Remove context-based authentication references" -m "- Fix form submission logic for new API"`,

  `git add . && git reset HEAD backend/src/controllers/item.controller.ts && git commit -m "chore: clean up project structure" -m "- Remove unused code files" -m "- Clean up imports and dependencies" -m "- Delete old migrations in favor of schema push"`,
];

function countdown(ms, onDone) {
  let remaining = ms;

  const interval = setInterval(() => {
    remaining -= 10000;
    if (remaining <= 0) {
      clearInterval(interval);
      onDone();
    } else {
      console.log(`⏳ next commit in ${Math.ceil(remaining / 1000)} sec...`);
    }
  }, 10000);
}

function runCommits(idx = 0) {
  if (idx >= commitCommands.length) {
    console.log("✅ all commits done, my g!");
    return;
  }
  console.log(`🚀 running commit ${idx + 1}…`);
  exec(commitCommands[idx], (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ error at commit ${idx + 1}:`, stderr.trim() || err);
      return;
    }
    console.log(`✅ commit ${idx + 1} done:\n${stdout.trim()}`);
    const randomDelay = Math.floor(Math.random() * (1 - 1 + 1)) + 1;
    console.log(
      `⌛ waiting ${Math.ceil(randomDelay / 1000)} sec before next commit...`
    );
    countdown(randomDelay, () => runCommits(idx + 1));
  });
}

// start the commit flow
runCommits();
