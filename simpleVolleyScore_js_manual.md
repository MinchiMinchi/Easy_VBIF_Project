# バレーボール点示ソフト（JavaScript版）マニュアル

## 📋 利用方法
1. 各チームブロック内の `Team A +` / `Team B +` ボタンで得点を追加します。  
2. 自チームがサーバーでない状態で得点した場合、`team.push(team.shift())` による時計回りローテーションとサーバー切替が行われます。  
3. `Swap Serve` ボタン（スコア0-0時のみ有効）でサーバー権を手動切替可能です。  
4. `Undo` ボタンで直前の状態（得点・ローテーション・サーバー権・セット数・チーム名）を1手戻せます。  
5. `Reset` ボタンで初期状態（スコア0-0、初期ローテ、サーバーA、セット1）に戻せます。  
6. チーム名、セット数、選手番号はそれぞれの表示部をクリックして編集できます。  

## 🧠 データ構造
- `teamA`, `teamB` (Array of strings):  
  - 各チームの背番号配列。`team[0]` がサーバー位置です。
- `teamAPos`, `teamBPos` (Array of `[row, col]`):  
  - CSS Grid の `grid-row` / `grid-column` 用の配置データ。配列順序がローテーション順と一致。
- `serverTeam` (string): `"A"` または `"B"`.
- `scoreA`, `scoreB` (number): 各チームの得点。
- `setCount` (number): セット数。
- `history` (Array of objects):  
  - Undo用の状態履歴。得点・ローテーション・サーバー権・セット数・チーム名を含む。

## 🔁 処理の流れ
1. **得点処理** (`addPoint(team)`):  
   - `saveState()` で現在状態を履歴に保存  
   - `serverTeam === team` の場合はスコア +1  
   - それ以外はスコア +1、`team.push(team.shift())` でローテーション、`serverTeam=team`  
   - `render()` で画面再描画  
2. **Undo** (`undo()`):  
   - `history.pop()` で前状態を復元し、変数を書き換え `render()`  
3. **Swap Serve** (`swapServe()`):  
   - `scoreA===0 && scoreB===0` の場合のみ `serverTeam` を切替  
4. **Reset** (`resetGame()`):  
   - 初期配列・スコア0-0・サーバーA・セット1・履歴クリア、`render()`  
5. **編集機能**:  
   - `prompt()` でチーム名、セット数、背番号を入力して変更  

---
