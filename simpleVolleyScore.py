# -*- coding: utf-8 -*-
# Volleyball Scoreboard with Reset Button (Python Tkinter)

import tkinter as tk
from tkinter import simpledialog
from collections import deque
import copy

class VolleyballScoreApp:
    def __init__(self, root):
        self.root = root
        self.root.title("バレーボール スコアボード")
        self.root.attributes('-fullscreen', True)
        self.root.bind("<Escape>", lambda e: self.root.attributes('-fullscreen', False))

        for i in range(6):
            self.root.columnconfigure(i, weight=1)
            self.root.rowconfigure(i, weight=1)

        self.init_state()
        self.create_widgets()

    def init_state(self):
        self.teamA_name = "A"
        self.teamB_name = "B"
        self.set_count = 1
        self.teamA_score = 0
        self.teamB_score = 0
        self.server_team = "A"
        self.teamA_rot = deque(["1", "2", "3", "4", "5", "6"])
        self.teamB_rot = deque(["1", "2", "3", "4", "5", "6"])
        self.teamA_pos = [(4, 0), (4, 1), (3, 1), (2, 1), (2, 0), (3, 0)]
        self.teamB_pos = [(2, 4), (2, 3), (3, 3), (4, 3), (4, 4), (3, 4)]
        self.history = []

    def create_widgets(self):
        tk.Button(self.root, text="TeamA +", command=self.add_point_A).grid(row=0, column=0, sticky="nsew")
        self.label_A = tk.Label(self.root, text=self.teamA_name, bg="lightblue")
        self.label_A.grid(row=0, column=1, sticky="nsew")
        self.label_A.bind("<Button-1>", self.change_teamA_name)

        tk.Button(self.root, text="サーブ交代", command=self.swap_serve).grid(row=0, column=2, sticky="nsew")

        self.label_B = tk.Label(self.root, text=self.teamB_name, bg="lightgreen")
        self.label_B.grid(row=0, column=3, sticky="nsew")
        self.label_B.bind("<Button-1>", self.change_teamB_name)

        tk.Button(self.root, text="TeamB +", command=self.add_point_B).grid(row=0, column=4, sticky="nsew")
        tk.Button(self.root, text="Undo", command=self.undo).grid(row=0, column=5, sticky="nsew")

        self.label_scoreA = tk.Label(self.root, text="0", font=("Helvetica", 32))
        self.label_scoreA.grid(row=1, column=1, sticky="nsew")

        self.set_label = tk.Label(self.root, text=f"{self.set_count}set", font=("Helvetica", 16))
        self.set_label.grid(row=1, column=2, sticky="nsew")
        self.set_label.bind("<Button-1>", self.edit_set_count)

        self.label_scoreB = tk.Label(self.root, text="0", font=("Helvetica", 32))
        self.label_scoreB.grid(row=1, column=3, sticky="nsew")

        tk.Button(self.root, text="リセット", command=self.reset_game).grid(row=1, column=5, sticky="nsew")

        self.player_labels_A = []
        self.player_labels_B = []

        for i, (r, c) in enumerate(self.teamA_pos):
            label = tk.Label(self.root, width=5, height=2, bg="orange", font=("Helvetica", 20))
            label.grid(row=r, column=c, sticky="nsew", padx=2, pady=2)
            label.bind("<Button-1>", lambda e, i=i: self.edit_player_number("A", i))
            self.player_labels_A.append(label)

        for i, (r, c) in enumerate(self.teamB_pos):
            label = tk.Label(self.root, width=5, height=2, bg="orange", font=("Helvetica", 20))
            label.grid(row=r, column=c, sticky="nsew", padx=2, pady=2)
            label.bind("<Button-1>", lambda e, i=i: self.edit_player_number("B", i))
            self.player_labels_B.append(label)

        self.update_rotation_display()

    def update_rotation_display(self):
        for i, label in enumerate(self.player_labels_A):
            label.config(text=self.teamA_rot[i])
            if self.server_team == "A" and i == 0:
                label.config(bg="red", fg="white", relief="solid", bd=3, font=("Helvetica", 20, "bold"))
            else:
                label.config(bg="orange", fg="black", relief="flat", bd=1, font=("Helvetica", 20))

        for i, label in enumerate(self.player_labels_B):
            label.config(text=self.teamB_rot[i])
            if self.server_team == "B" and i == 0:
                label.config(bg="red", fg="white", relief="solid", bd=3, font=("Helvetica", 20, "bold"))
            else:
                label.config(bg="orange", fg="black", relief="flat", bd=1, font=("Helvetica", 20))

        self.label_A.config(text=self.teamA_name)
        self.label_B.config(text=self.teamB_name)

    def save_state(self):
        state = {
            "scoreA": self.teamA_score,
            "scoreB": self.teamB_score,
            "server": self.server_team,
            "rotA": copy.deepcopy(self.teamA_rot),
            "rotB": copy.deepcopy(self.teamB_rot),
            "set": self.set_count
        }
        self.history.append(state)

    def undo(self):
        if self.history:
            state = self.history.pop()
            self.teamA_score = state["scoreA"]
            self.teamB_score = state["scoreB"]
            self.server_team = state["server"]
            self.teamA_rot = state["rotA"]
            self.teamB_rot = state["rotB"]
            self.set_count = state["set"]
            self.label_scoreA.config(text=str(self.teamA_score))
            self.label_scoreB.config(text=str(self.teamB_score))
            self.set_label.config(text=f"{self.set_count}set")
            self.update_rotation_display()

    def add_point_A(self):
        self.save_state()
        if self.server_team == "A":
            self.teamA_score += 1
        else:
            self.teamA_score += 1
            self.server_team = "A"
            self.teamA_rot.rotate(-1)
        self.label_scoreA.config(text=str(self.teamA_score))
        self.update_rotation_display()

    def add_point_B(self):
        self.save_state()
        if self.server_team == "B":
            self.teamB_score += 1
        else:
            self.teamB_score += 1
            self.server_team = "B"
            self.teamB_rot.rotate(-1)
        self.label_scoreB.config(text=str(self.teamB_score))
        self.update_rotation_display()

    def swap_serve(self):
        if self.teamA_score == 0 and self.teamB_score == 0:
            self.server_team = "B" if self.server_team == "A" else "A"
            self.update_rotation_display()

    def reset_game(self):
        self.init_state()
        self.label_scoreA.config(text="0")
        self.label_scoreB.config(text="0")
        self.set_label.config(text="1set")
        for i in range(6):
            self.player_labels_A[i].config(text=self.teamA_rot[i])
            self.player_labels_B[i].config(text=self.teamB_rot[i])
        self.update_rotation_display()

    def edit_player_number(self, team, index):
        number = simpledialog.askstring("背番号変更", f"{team}チームの選手 {index+1} の新しい背番号：")
        if number:
            if team == "A":
                self.teamA_rot[index] = number
            else:
                self.teamB_rot[index] = number
            self.update_rotation_display()

    def change_teamA_name(self, event=None):
        name = simpledialog.askstring("チーム名変更", "チームAの名前を入力してください：")
        if name:
            self.teamA_name = name
            self.update_rotation_display()

    def change_teamB_name(self, event=None):
        name = simpledialog.askstring("チーム名変更", "チームBの名前を入力してください：")
        if name:
            self.teamB_name = name
            self.update_rotation_display()

    def edit_set_count(self, event=None):
        new_set = simpledialog.askinteger("セット数変更", "セット数を入力してください：", initialvalue=self.set_count)
        if new_set is not None:
            self.set_count = new_set
            self.set_label.config(text=f"{self.set_count}set")

if __name__ == "__main__":
    root = tk.Tk()
    app = VolleyballScoreApp(root)
    root.mainloop()
