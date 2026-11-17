"""Chart helpers in the channel style (matplotlib, 1920x1080 PNG).

    python -m graphics.charts   # demo: top 10 ratings at Champions 2022 (raw event data, not the GOAT ranking)
"""
import pandas as pd
import matplotlib.pyplot as plt

from graphics.style import mpl_style, CYAN, GOLD, MUTED, TEXT, OUT


def bar_leaderboard(labels, values, title, value_fmt="{:.2f}", highlight_top=0, source="", out_name="chart.png"):
    """Horizontal bars, biggest at the top. highlight_top=N paints the first N gold (top 3 / GOAT only)."""
    mpl_style()
    fig, ax = plt.subplots(figsize=(19.2, 10.8), dpi=100)
    n = len(labels)
    colors = [GOLD if i < highlight_top else CYAN for i in range(n)]
    ax.barh(range(n)[::-1], values, color=colors, height=0.66)
    ax.set_yticks(range(n)[::-1], labels, fontsize=28)
    for i, v in enumerate(values):
        ax.text(v, n - 1 - i, "  " + value_fmt.format(v), va="center", color=TEXT, fontsize=26)
    ax.set_xlim(min(values) * 0.9, max(values) * 1.08)
    ax.xaxis.set_visible(False)
    ax.spines["bottom"].set_visible(False)
    fig.suptitle(title, x=0.06, ha="left", fontsize=46, fontfamily="Anton", color=TEXT)
    if source:
        fig.text(0.06, 0.03, source, color=MUTED, fontsize=18)
    fig.subplots_adjust(left=0.16, right=0.94, top=0.86, bottom=0.08)
    path = OUT / out_name
    fig.savefig(path)
    plt.close(fig)
    return path


if __name__ == "__main__":
    df = pd.read_csv("data/csv/sample_champions_2022_stats.csv")
    df = df[df.rounds_played >= 200].sort_values("rating", ascending=False).head(10)
    print(bar_leaderboard(df.player.tolist(), df.rating.tolist(),
                          "CHAMPIONS 2022: HIGHEST RATING", source="Data: vlr.gg  ·  min. 200 rounds",
                          out_name="chart_demo_champions2022_rating.png"))
