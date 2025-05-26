# Volleyball Scoreboard (Python Tkinter Version) - Manual

## 📋 User Operations

- `TeamA + / TeamB +`: Adds a point. If not the serving team, rotates players and switches server.
- `Undo`: Reverts the last state (scores, rotation, server, set count, names).
- `Set Count`: Click to edit the current set number.
- `Team Name`: Click the team label (blue/green) to rename.
- `Player Number`: Click a player to edit their jersey number.

---

## 🧠 Data Structures

| Variable        | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `teamA_rot`     | A team's jersey numbers (`deque`) in rotation order          |
| `teamA_pos`     | A team's grid positions as (row, col)                        |
| `teamB_rot`     | B team's jersey numbers (`deque`)                            |
| `teamB_pos`     | B team's grid positions                                      |
| `server_team`   | `"A"` or `"B"` - current serving team                        |
| `scoreA / B`    | Current score for each team                                  |
| `set_count`     | Current set number                                           |
| `history`       | Stack of state snapshots for undo functionality              |

---

## 🔁 Process Flow

### `add_point_A` / `add_point_B`

1. Save the current state to `history`
2. If same server team → add point
3. If different:
   - Add point
   - Rotate the team (`rotate(-1)`)
   - Switch the server team
4. Refresh the display via `update_rotation_display()`

### `undo`

- Restores the last saved state from `history`

---

## 🖼 Display Mapping (grid layout)

### Team A (Left)

```
(2,0) UL   (2,1) UR
(3,0) ML   (3,1) MR
(4,0) LL★  (4,1) LR
```

### Team B (Right)

```
(2,3) UL   (2,4) UR★
(3,3) ML   (3,4) MR
(4,3) LL   (4,4) LR
```

★ = Server position (index 0)

---

## 💡 Features & Extensibility

- Logical rotation order matches visual grid layout
- `deque.rotate(-1)` enables intuitive clockwise rotation
- No `display_order` mapping required
- Easy to maintain and extend

### Possible Enhancements

- CSV export/import
- Match logging
- Libero and substitution tracking
- Canvas-based court visualization
- Real-time score broadcasting

---

## 📎 License / Usage

This software is free to use for educational and match-recording purposes.
