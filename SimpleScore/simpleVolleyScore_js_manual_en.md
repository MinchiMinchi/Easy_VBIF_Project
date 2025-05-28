# Volleyball Scoreboard Manual (JavaScript Version)

## 📋 Usage
1. Click the `Team A +` / `Team B +` button in each team block to add a point.  
2. If a team scores while not serving, the code performs a clockwise rotation via `team.push(team.shift())` and switches the server.  
3. The `Swap Serve` button (enabled only at 0-0) lets you manually toggle the serving team.  
4. Click `Undo` to revert to the previous state, restoring score, rotation, server, set count, and team names.  
5. Click `Reset` to return to the initial state (0-0 score, initial rotation, Team A serving, set 1).  
6. Click on the team name, set count, or player number to edit via `prompt()`.

## 🧠 Data Structures
- `teamA`, `teamB` (Array of strings):  
  Arrays of jersey numbers. `team[0]` is the server position.
- `teamAPos`, `teamBPos` (Array of `[row, col]`):  
  Coordinates for CSS Grid `grid-row` / `grid-column`. The index order matches the rotation order.
- `serverTeam` (string): `"A"` or `"B"`.
- `scoreA`, `scoreB` (number): Each team's score.
- `setCount` (number): Current set number.
- `history` (Array of objects):  
  Stack of states for undo, including score, rotation, serverTeam, setCount, team names.

## 🔁 Process Flow
1. **addPoint(team)**:  
   - Calls `saveState()` to push the current state onto `history`.  
   - If `serverTeam === team`, increments score by 1.  
   - Otherwise, increments score, rotates the array (`team.push(team.shift())`), sets `serverTeam = team`.  
   - Calls `render()` to update the UI.  
2. **undo()**:  
   - Pops the last state from `history` and restores variables, then calls `render()`.  
3. **swapServe()**:  
   - Toggles `serverTeam` only when `scoreA === 0 && scoreB === 0`.  
4. **resetGame()**:  
   - Resets arrays to initial, scores to 0, `serverTeam = "A"`, `setCount = 1`, clears `history`, calls `render()`.  
5. **Editing**:  
   - Uses `prompt()` to edit team name, set count, or player number.
