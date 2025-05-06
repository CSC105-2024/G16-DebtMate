const { exec } = require("child_process");

const commitCommands = [
  // Update Authentication Flow in Login and Signup Pages
  `git add src/pages/Login.jsx src/pages/SignUp.jsx && git commit -m "Update Login and Signup pages to use authentication context"`,

  // Refactor FriendList to use API Integration
  `git add src/pages/FriendList.jsx src/Component/FriendProfileModal.jsx && git commit -m "Refactor friend list to use backend API endpoints"`,

  // Refactor AddFriends Component with API Integration
  `git add src/pages/AddFriends.jsx && git commit -m "Update AddFriends component to use correct API endpoints"`,

  // Remove Loading States from Group Components
  `git add src/pages/GroupList.jsx src/pages/GroupForm.jsx && git commit -m "Remove redundant loading states from group components"`,

  // Remove Loading States from Item Components
  `git add src/pages/ItemList.jsx src/pages/AddItems.jsx src/pages/EditItem.jsx src/pages/SplitBill.jsx && git commit -m "Remove redundant loading states from item management components"`,

  // Add Axios Dependency
  `git add package.json package-lock.json && git commit -m "Add Axios dependency for HTTP requests"`,
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
  }, 1);
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
    const randomDelay = 1000; // fixed 1 sec delay since u had it random but always 1 anyway
    console.log(
      `⌛ waiting ${Math.ceil(randomDelay / 1000)} sec before next commit...`
    );
    countdown(randomDelay, () => runCommits(idx + 1));
  });
}

// start the commit flow
runCommits();
