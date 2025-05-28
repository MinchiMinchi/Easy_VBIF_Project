# Volleyball Scoreboard Manual (Python Tkinter Version)

## 📋 Usage
1. Click the `TeamA +` / `TeamB +` buttons in the title bar to add one point to the respective team.  
2. If a team scores while not serving, it is treated as a side-out: the rotation deque rotates one step clockwise and service switches to the scoring team.  
3. The `Swap Serve` button (enabled only when the score is 0-0) lets you manually toggle the serving team.  
4. Click the `Undo` button to revert to the previous state (score, rotation, server, set number).  
5. Click the `Reset` button to return to the initial state (0–0 score, initial rotation, Team A serving, set 1).  
6. You can edit the team names, set number, and player jersey numbers by clicking on the corresponding labels.

## 🧠 Data Structures
- `self.teamA_rot`, `self.teamB_rot` (`collections.deque`):  
  Deques holding each team's jersey numbers. Index 0 indicates the serving position.
- `self.teamA_pos`, `self.teamB_pos` (List of `(row, col)`):  
  Grid coordinates for each player cell using `grid(row, col)`. Matches the rotation order.
- `self.server_team` (str): `"A"` or `"B"`.
- `self.teamA_score`, `self.teamB_score` (int): Current scores.
- `self.set_count` (int): Current set number.
- `self.history` (List of dicts):  
  Undo history stack. Each entry is a dict containing score, rotation, server_team, and set_count.

## 🔁 Process Flow
1. **add_point_A** / **add_point_B**:  
   - Saves current state to `self.history` via `save_state()`.  
   - Increments the scoring team's score by 1.  
   - If the scoring team was not serving, calls `.rotate(-1)` on that team's deque and switches `server_team`.  
   - Calls `update_rotation_display()` to refresh the UI.  
2. **undo**:  
   - Pops the last state from `self.history`, restores all variables, and refreshes the UI.  
3. **swap_serve**:  
   - Toggles `server_team` between `"A"` and `"B"` only when both teams have 0 points.  
4. **reset_game**:  
   - Calls `init_state()` to reset score, rotation, server, and set count to their initial values.  
5. **Editing**:  
   - Uses `simpledialog.askstring` / `askinteger` to edit team names, set count, and jersey numbers.
