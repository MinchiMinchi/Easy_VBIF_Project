# バレーボール点示ソフト（Python Tkinter版）マニュアル

## 📋 利用方法
1. タイトルバーの `TeamA +` / `TeamB +` ボタンでそれぞれのチームに1点追加します。  
2. 自チームがサーバーでない状態で得点した場合、サイドアウト扱いとなり、ローテーションが時計回りに1つ回り、サーバー権が移動します。  
3. `Swap Serve` ボタン（スコア0-0時のみ有効）で、サーバー権を手動で切り替えられます。  
4. `Undo` ボタンで直前の状態（得点・ローテーション・サーバー権・セット数）を1手戻せます。  
5. `Reset` ボタンでスコア0-0、初期ローテーション、サーバーA、セット数1の状態に戻せます。  
6. チーム名やセット数、選手背番号は表示部をクリックすると入力ダイアログで編集可能です。  

## 🧠 データ構造
- `self.teamA_rot`, `self.teamB_rot` (`collections.deque`):  
  - 各チームの背番号リスト。配列の先頭（index 0）がサーバー位置です。
- `self.teamA_pos`, `self.teamB_pos` (List of `(row, col)`):  
  - `grid(row, col)` による選手セルの配置座標。ローテーション順と一致します。
- `self.server_team` (str): `"A"` または `"B"`.
- `self.teamA_score`, `self.teamB_score` (int): 各チームの得点。
- `self.set_count` (int): 現在のセット数。
- `self.history` (List[dict]):  
  - Undo用の状態履歴。各要素は得点、ローテーション、サーバー権、セット数を含む辞書です。

## 🔁 処理の流れ
1. **得点処理** (`add_point_A` / `add_point_B`):  
   - `save_state()` で現在状態を `self.history` に保存  
   - 得点チームのスコアを +1  
   - サーバー権が異なる場合は `.rotate(-1)` でローテーション、サーバー切替  
   - 画面更新 (`update_rotation_display()`)  
2. **Undo** (`undo`):  
   - `self.history.pop()` で前状態を取得、すべての変数を復元、画面再描画  
3. **Swap Serve** (`swap_serve`):  
   - `teamA_score==0 and teamB_score==0` のときのみサーバー権を `"A"` ⇄ `"B"`  
4. **Reset** (`reset_game`):  
   - 初期化メソッド `init_state()` を呼び、スコア・ローテーション・セット数を初期状態に戻す  
5. **編集機能**:  
   - `simpledialog.askstring` / `askinteger` でチーム名、セット数、背番号を変更  

---

