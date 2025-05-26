# Volleyball Scoreboard (JavaScript Version) Manual

## 📱 User Instructions

- `Team A + / Team B +`: Add point to selected team. If not serving, rotate and switch server.
- `Undo`: Reverts the last state (scores, rotations, server, team names, set count).
- `Set Count`: Click the central display to update.
- `Team Name`: Tap/click to rename.
- `Player Number`: Click a player cell to edit.

---

## 💾 Data Structure

| Variable        | Description                                        |
|-----------------|----------------------------------------------------|
| `teamA`         | Array of A team player numbers (rotation order, index 0 = server) |
| `teamB`         | Same for B team                                    |
| `teamAPos`      | A team player positions as [row, col]              |
| `teamBPos`      | B team positions                                   |
| `serverTeam`    | `"A"` or `"B"` — current serving team              |
| `scoreA/B`      | Integer score for each team                        |
| `setCount`      | Current set number                                 |
| `history`       | Stack of previous states for undo                  |

---

## 🔁 Process Flow

- If serving team → Add score
- If not → Add score + rotate (clockwise) + switch server
- Rotation via `team.push(team.shift())`

---

## 🖼 Display Layout

- 2×3 grid for each team (A and B)
- Displayed side-by-side (left = A, right = B)
- Index 0 player is server and highlighted red

---

## 🧩 Extendable Features

- Match logging via `localStorage`
- Sound notification for points
- CSV export
- Installable PWA for mobile
- Sync with match records or live data

---

## 📎 License

This software is free to use, modify, and distribute (MIT-style license).
