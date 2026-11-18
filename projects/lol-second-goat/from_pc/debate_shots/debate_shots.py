"""Headless screenshots of debate articles + old.reddit posts. Fresh temp profile, never a visible window.
usage: python debate_shots.py <out_dir>
"""
import sys, os, csv, re, time, json, ctypes
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

try:
    ctypes.windll.kernel32.SetPriorityClass(ctypes.windll.kernel32.GetCurrentProcess(), 0x4000)
except Exception:
    pass
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
ARTICLES = [
    "https://esportsinsider.com/2026/05/keria-second-best-in-league-debate",
    "https://www.sheepesports.com/us/articles/knight-named-as-worlds-2026-most-valuable-player/en",
    "https://www.invenglobal.com/articles/28568/chovy-vs-knight-the-ultimate-showdown-to-complete-perfection",
    "https://earlygame.com/lol/lol-community-reignites-the-goat-debate-faker-ruler-uzi",
    "https://teamliquid.com/articles/whos-the-2nd-best-league-of-legends-player",
    "https://insider-gaming.com/knight-crowned-lol-worlds-2026-mvp-after-blg-victory/",
]
QUERIES = ["second best player after Faker", "Knight vs Chovy", "Keria second best", "best player not named Faker", "Chovy GOAT", "Knight best player in the world"]
DECLINE = ["Reject all", "Reject All", "Reject", "Decline", "Decline all", "I do not agree", "Disagree", "Only necessary",
           "Necessary only", "Continue without accepting", "Refuse all", "Deny", "Do not consent"]
KILL_OVERLAYS = """() => {
  const sel = ['#qc-cmp2-container','.fc-consent-root','#onetrust-consent-sdk','#usercentrics-root','.ncmp__banner','[id*="consent" i]','[class*="consent" i]','[id*="cookie" i]','[class*="cookie" i]','[id*="cmp" i]','[class*="cmp-" i]','[id*="privacy" i]','[class*="privacy" i]','[id^="google_ads"]','[id*="-ad-" i]','[class*="advert" i]','[class*="ad-slot" i]','[class*="adunit" i]','ins.adsbygoogle','iframe'];
  for (const q of sel) document.querySelectorAll(q).forEach(e => { if (!e.querySelector('h1')) e.remove(); });
  for (const e of [document.documentElement, document.body]) { e.style.setProperty('filter','none','important'); e.classList.remove('modal-open','no-scroll','sp-message-open'); } for (const el of document.querySelectorAll('body *')) { const s = getComputedStyle(el);
  if ((s.position === 'fixed' || s.position === 'sticky') && el.offsetHeight > 40 && !el.querySelector('h1')) el.style.setProperty('display','none','important'); }
  document.documentElement.style.overflow='auto'; document.body.style.overflow='auto'; }"""
rows = []


def decline(page):
    for fr in [page] + page.frames:
        for t in DECLINE:
            try:
                b = fr.get_by_role("button", name=re.compile("^" + re.escape(t) + "$", re.I))
                if b.count():
                    b.first.click(timeout=1500)
                    time.sleep(0.8)
                    return t
            except Exception:
                pass
    return ""


def shoot_region(page, top, height, path):
    page.evaluate(KILL_OVERLAYS)
    time.sleep(0.5)
    h1 = page.locator("h1").filter(has_text=re.compile(r"\w{4,}.*\w{4,}")).last
    page.evaluate(f"window.scrollTo(0, {max(0, top - 160)})")
    time.sleep(0.8)
    page.evaluate(KILL_OVERLAYS)
    b = h1.bounding_box() if h1.count() else None
    x0, w, y0 = 0, 1280, 0
    if b:
        cont = page.evaluate("""() => { let hs=[...document.querySelectorAll('h1')].filter(h=>/\w{4,}.*\w{4,}/.test(h.innerText)); let e = hs[hs.length-1]; for (let i=0;i<4 && e.parentElement;i++){ const r=e.parentElement.getBoundingClientRect(); if (r.width>900) break; e=e.parentElement;} const r=e.getBoundingClientRect(); return [r.left, r.width]; }""")
        x0 = max(0, int(min(b["x"], cont[0])) - 40); w = min(1280 - x0, int(max(b["width"], cont[1])) + 80)
        y0 = max(0, int(b["y"]) - 110)
    page.screenshot(path=path, clip={"x": x0, "y": y0, "width": w, "height": min(900 - y0, height)})


with sync_playwright() as p:
    br = p.chromium.launch(channel="chrome", headless=True, args=["--mute-audio"])
    ctx = br.new_context(viewport={"width": 1280, "height": 900}, device_scale_factor=2, locale="en-US",
                         user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36")
    page = ctx.new_page()
    for i, url in enumerate(ARTICLES, 1):
        name = f"article_{i:02d}_{re.sub(r'[^a-z0-9]+', '-', url.split('//')[1].split('/')[0].replace('www.', ''))}.png"
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            time.sleep(4)
            d = decline(page)
            title = page.title()
            h1 = page.locator("h1").filter(has_text=re.compile(r"\w{4,}.*\w{4,}")).last
            top = h1.bounding_box()["y"] + page.evaluate("window.scrollY") if h1.count() and h1.bounding_box() else 0
            date = page.evaluate("""() => { const t = document.querySelector('time[datetime], meta[property="article:published_time"]');
                return t ? (t.getAttribute('datetime') || t.getAttribute('content')) : ''; }""")
            shoot_region(page, top, 640, os.path.join(OUT, name))
            rows.append([name, url, title, date, "article", f"cookie: {d or 'none found'}"])
            print("OK", name, title[:70], flush=True)
        except Exception as e:
            print("FAIL", url, str(e)[:150], flush=True)
            rows.append(["", url, "", "", "article", "FAILED: " + str(e)[:100]])
    # old reddit search
    seen, posts = set(), []
    for q in QUERIES:
        try:
            page.goto(f"https://old.reddit.com/r/leagueoflegends/search?q={q.replace(' ', '+')}&restrict_sr=on&sort=top&t=all", timeout=45000)
            time.sleep(3)
            print("search", q, page.title()[:60], page.locator("div.search-result-link").count(), page.url[:80], flush=True)
            for it in page.locator("div.search-result-link").all()[:12]:
                a = it.locator("a.search-title").first
                href, title = a.get_attribute("href"), a.inner_text()
                tm = it.locator("time").first.get_attribute("datetime") or ""
                if href in seen or not tm[:4] in ("2024", "2025", "2026"):
                    continue
                seen.add(href)
                posts.append((href, title, tm, q))
        except Exception as e:
            print("search fail", q, str(e)[:100], flush=True)
        time.sleep(3)
    keys = ["second best", "faker", "knight", "chovy", "keria", "goat", "best player"]
    posts = [x for x in posts if any(k in x[1].lower() for k in keys)][:10]
    for j, (href, title, tm, q) in enumerate(posts, 1):
        name = f"reddit_{j:02d}.png"
        try:
            page.goto(href.replace("www.reddit.com", "old.reddit.com"), timeout=45000)
            time.sleep(3)
            page.evaluate("() => { for (const s of ['.side','#header','.infobar','.listingsignupbar','.footer-parent']) document.querySelectorAll(s).forEach(e=>e.style.display='none'); }")
            thing = page.locator("#siteTable .thing").first.bounding_box()
            com = page.locator(".commentarea .sitetable > .thing.comment").first
            cb = com.bounding_box() if com.count() else None
            top = thing["y"]
            bottom = (cb["y"] + min(cb["height"], 260)) if cb else thing["y"] + thing["height"]
            page.screenshot(path=os.path.join(OUT, name), full_page=True,
                            clip={"x": 0, "y": max(0, top - 10), "width": 1280, "height": min(900, bottom - top + 20)})
            score = page.locator("#siteTable .thing .score.unvoted").first.inner_text() if page.locator("#siteTable .thing .score.unvoted").count() else ""
            rows.append([name, href, title, tm[:10], "reddit", f"score {score}; search '{q}'"])
            print("OK", name, title[:70], flush=True)
        except Exception as e:
            print("FAIL", href, str(e)[:150], flush=True)
        time.sleep(3)
    # X without sign-in
    try:
        page.goto("https://x.com/search?q=Knight%20Worlds%202026%20MVP&f=top", timeout=30000)
        time.sleep(5)
        print("X page title:", page.title(), "| login wall:", page.locator("text=Sign in").count() > 0 or "login" in page.url, flush=True)
    except Exception as e:
        print("X fail", str(e)[:100], flush=True)
    br.close()
with open(os.path.join(OUT, "sources.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["file", "url", "title", "date", "kind", "note"])
    w.writerows(rows)
print("DONE", len(rows), flush=True)
