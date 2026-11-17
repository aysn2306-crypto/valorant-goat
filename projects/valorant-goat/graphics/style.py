"""Channel style, from the editing and voiceover style guide.
Gold is for titles won, the top 3 and the GOAT reveal only: keep it rare."""
import pathlib

BG = "#0E1116"        # deep charcoal: every background
PANEL = "#1B212B"     # slate: cards, leaderboard rows
CYAN = "#22D3EE"      # brand accent: titles, formula, "AI" moments
GOLD = "#F5B83D"      # trophies / top 3 / GOAT only
RED = "#FF5A5F"       # dropping, weaknesses
MINT = "#34D399"      # rising after a twist
TEXT = "#EDEFF2"      # body text and numbers
MUTED = "#6B7685"     # labels, sources

FONTS = pathlib.Path(__file__).resolve().parent / "fonts"
TITLE_FONT = FONTS / "Anton-Regular.ttf"       # big titles, rank numbers
ALT_TITLE_FONT = FONTS / "BebasNeue-Regular.ttf"
BODY_FONT = FONTS / "Inter-Variable.ttf"       # stats and labels

W, H = 1920, 1080
OUT = pathlib.Path(__file__).resolve().parent / "out"
OUT.mkdir(exist_ok=True)


def mpl_style():
    """Apply the palette to matplotlib charts."""
    import matplotlib as mpl
    from matplotlib import font_manager
    for f in (TITLE_FONT, BODY_FONT):
        font_manager.fontManager.addfont(str(f))
    mpl.rcParams.update({
        "figure.facecolor": BG, "axes.facecolor": BG, "savefig.facecolor": BG,
        "axes.edgecolor": PANEL, "axes.labelcolor": MUTED, "text.color": TEXT,
        "xtick.color": MUTED, "ytick.color": TEXT, "grid.color": PANEL,
        "font.family": "Inter", "font.size": 22,
        "axes.spines.top": False, "axes.spines.right": False,
    })
