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

function processCommits(currentIndex = 0) {
  if (currentIndex >= commitCommands.length) {
    console.log("All commits completed");
    return;
  }

  console.log(`Processing commit ${currentIndex + 1}/${commitCommands.length}`);
  exec(commitCommands[currentIndex], (err, stdout, stderr) => {
    if (err) {
      console.error(
        `Error during commit ${currentIndex + 1}:`,
        stderr.trim() || err
      );
      return;
    }

    console.log(`Commit ${currentIndex + 1} completed`);
    console.log(stdout.trim());

    // Add some randomization to make it look less predictable
    const delay = Math.floor(Math.random() * 500) + 800;
    console.log(`Waiting ${delay}ms before next commit`);

    setTimeout(() => processCommits(currentIndex + 1), delay);
  });
}

// start the commit flow
processCommits();
