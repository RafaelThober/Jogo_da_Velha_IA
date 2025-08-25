import tkinter as tk
from tkinter import messagebox
import random


class TicTacToeApp:
    def __init__(self, root):
        self.root = root
        root.title('Jogo da Velha com IA')
        root.resizable(False, False)

        self.player = 'X'  # human
        self.ai = 'O'
        self.board = [''] * 9
        self.game_over = False

        # Top frame: title and difficulty
        top = tk.Frame(root, padx=10, pady=10)
        top.pack()

        title = tk.Label(top, text='Jogo da Velha com IA', font=('Helvetica', 16, 'bold'))
        title.grid(row=0, column=0, columnspan=3)

        diff_frame = tk.Frame(top)
        diff_frame.grid(row=1, column=0, columnspan=3, pady=(8,0))

        tk.Label(diff_frame, text='Dificuldade:').pack(side='left')
        self.difficulty = tk.StringVar(value='Dificil')
        options = ['Fácil', 'Médio', 'Dificil']
        self.diff_menu = tk.OptionMenu(diff_frame, self.difficulty, *options)
        self.diff_menu.pack(side='left', padx=(6,0))

        # Board
        board_frame = tk.Frame(root, padx=10, pady=10)
        board_frame.pack()

        self.buttons = []
        for i in range(9):
            btn = tk.Button(board_frame, text='', width=6, height=3, font=('Helvetica', 24),
                            command=lambda i=i: self.on_click(i))
            btn.grid(row=i//3, column=i%3, padx=5, pady=5)
            self.buttons.append(btn)

        # Bottom controls
        bottom = tk.Frame(root, pady=6)
        bottom.pack()

        self.status = tk.Label(bottom, text="Sua vez (X)", font=('Helvetica', 12))
        self.status.pack(side='left', padx=(6,12))

        restart_btn = tk.Button(bottom, text='Reiniciar', command=self.reset)
        restart_btn.pack(side='left')

        # Start fresh
        self.reset()

    def reset(self):
        self.board = [''] * 9
        self.game_over = False
        for b in self.buttons:
            b.config(text='', state='normal', fg='black')
        self.status.config(text='Sua vez (X)')

    def on_click(self, idx):
        if self.game_over:
            return
        if self.board[idx] != '':
            return
        # Human move
        self.make_move(idx, self.player)
        winner = self.check_winner(self.board)
        if winner:
            self.finish(winner)
            return
        # AI move after small delay
        self.status.config(text='IA jogando...')
        self.root.after(200, self.ai_move)

    def make_move(self, idx, mark):
        self.board[idx] = mark
        self.buttons[idx].config(text=mark)
        if mark == self.player:
            self.buttons[idx].config(fg='blue')
        else:
            self.buttons[idx].config(fg='red')
        self.buttons[idx].config(state='disabled')

    def ai_move(self):
        if self.game_over:
            return
        empty = [i for i, v in enumerate(self.board) if v == '']
        if not empty:
            self.finish('Draw')
            return

        level = self.difficulty.get()
        if level == 'Fácil':
            choice = random.choice(empty)
        elif level == 'Médio':
            choice = self.medium_move()
        else:
            choice = self.best_move()

        self.make_move(choice, self.ai)
        winner = self.check_winner(self.board)
        if winner:
            self.finish(winner)
            return
        self.status.config(text='Sua vez (X)')

    def medium_move(self):
        # Win if possible
        for i in range(9):
            if self.board[i] == '':
                self.board[i] = self.ai
                if self.check_winner(self.board) == self.ai:
                    self.board[i] = ''
                    return i
                self.board[i] = ''
        # Block if human is about to win
        for i in range(9):
            if self.board[i] == '':
                self.board[i] = self.player
                if self.check_winner(self.board) == self.player:
                    self.board[i] = ''
                    return i
                self.board[i] = ''
        # Otherwise random
        empty = [i for i, v in enumerate(self.board) if v == '']
        return random.choice(empty)

    def best_move(self):
        # Minimax for perfect play
        _, move = self.minimax(self.board[:], self.ai)
        if move is None:
            empty = [i for i, v in enumerate(self.board) if v == '']
            return random.choice(empty)
        return move

    def minimax(self, board, player):
        winner = self.check_winner(board)
        if winner == self.ai:
            return (1, None)
        elif winner == self.player:
            return (-1, None)
        elif winner == 'Draw':
            return (0, None)

        moves = []
        for i in range(9):
            if board[i] == '':
                board[i] = player
                score, _ = self.minimax(board, self.player if player == self.ai else self.ai)
                moves.append((score, i))
                board[i] = ''

        if player == self.ai:
            # maximize
            best = max(moves, key=lambda x: x[0])
            return best
        else:
            # minimize
            best = min(moves, key=lambda x: x[0])
            return best

    def check_winner(self, b):
        wins = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
        for a, c, d in wins:
            if b[a] != '' and b[a] == b[c] == b[d]:
                return b[a]
        if all(cell != '' for cell in b):
            return 'Draw'
        return None

    def finish(self, winner):
        self.game_over = True
        if winner == 'Draw':
            self.status.config(text='Empate!')
            messagebox.showinfo('Resultado', 'Empate!')
        else:
            if winner == self.player:
                self.status.config(text='Você venceu!')
                messagebox.showinfo('Resultado', 'Parabéns — você venceu!')
            else:
                self.status.config(text='IA venceu!')
                messagebox.showinfo('Resultado', 'A IA venceu!')
        # disable remaining buttons
        for i, val in enumerate(self.board):
            if val == '':
                self.buttons[i].config(state='disabled')


def main():
    root = tk.Tk()
    app = TicTacToeApp(root)
    root.mainloop()


if __name__ == '__main__':
    main()
