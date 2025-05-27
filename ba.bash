# Add and commit the balance utility function
git add src/utils/balanceUtils.js
git commit -m "feat: create friend balance utility function"

# Add and commit FriendCard component update
git add src/Component/FriendCard.jsx
git commit -m "feat: add balance fetching capability to FriendCard"

# Add and commit updates to AddItems page
git add src/pages/AddItems.jsx
git commit -m "feat: implement dynamic balance display in AddItems page"

# Add and commit updates to EditItem page
git add src/pages/EditItem.jsx
git commit -m "feat: integrate friend balance in EditItem page"

# Add and commit FriendList fixes
git add src/pages/FriendList.jsx
git commit -m "fix: resolve balance not updating in FriendList desktop view"

# Add final touches and cleanup
git add src/Component/FriendCard.jsx
git commit -m "refactor: improve balance fetch logic with better error handling"

# Update any docs and README
git add README.md
git commit -m "docs: update documentation with balance calculation details"
