"""Independent re-derivation of analysis/engel_threshold.mjs in Python (stdlib only),
plus a transcription check of every CSV row against the extracted source tables."""
import csv, json, math, re

base = "/home/mario/EngelCurvesResearch/analysis/"
rows = list(csv.DictReader(open(base + "food_share_surveys.csv")))
wb = {(d["countryiso3code"], d["date"]): d["value"] for d in json.load(open(base + "wb_NY.GDP.PCAP.PP.KD_1990-2011.json"))[1] if d["value"] is not None}
pages = open("/home/mario/Documents/zk-data/corpus-mcp/engel-curves/extracted-b2/cgd_income_expenditure.pdf.txt").read().split("\f")
table_page = {"A.1": 32, "A.2": 33, "A.3": 34, "A.4a": 35, "A.4b": 36, "A.6": 38}  # 0-based

# Transcription: every row's share must appear on the row's table page, on a line naming the country (or year for IFLS).
miss = []
for r in rows:
    page = pages[table_page[r["table"]]]
    key = r["year"] if r["table"] == "A.2" else r["country"].split(" ")[0][:6]
    share = r["food_share"]
    variants = {share, share.rstrip("0"), ("%.2f" % float(share)), ("%.3f" % float(share))}
    lines = [l for l in page.split("\n") if key.lower() in l.lower()]
    if not any(any(re.search(r"(?<![\d.])" + re.escape(v) + r"(?!\d)", l) for v in variants) for l in lines):
        miss.append(f'{r["country"]} {r["year"]} {share} ({r["table"]})')

pts = [(math.log(wb[(r["iso3"], r["year"])]), float(r["food_share"])) for r in rows if (r["iso3"], r["year"]) in wb]
n = len(pts)
mx = sum(x for x, _ in pts) / n; my = sum(y for _, y in pts) / n
b = sum((x - mx) * (y - my) for x, y in pts) / sum((x - mx) ** 2 for x, _ in pts); a = my - b * mx
ssr_lin = sum((y - a - b * x) ** 2 for x, y in pts); r2 = 1 - ssr_lin / sum((y - my) ** 2 for _, y in pts)

def pw(k):  # normal equations for [1, x, max(0, x-k)]
    Z = [(1.0, x, max(0.0, x - k), y) for x, y in pts]
    A = [[sum(z[i] * z[j] for z in Z) for j in range(3)] + [sum(z[i] * z[3] for z in Z)] for i in range(3)]
    for c in range(3):
        p = max(range(c, 3), key=lambda r: abs(A[r][c])); A[c], A[p] = A[p], A[c]
        for r in range(3):
            if r != c:
                f = A[r][c] / A[c][c]; A[r] = [A[r][j] - f * A[c][j] for j in range(4)]
    beta = [A[i][3] / A[i][i] for i in range(3)]
    return sum((z[3] - beta[0] - beta[1] * z[1] - beta[2] * z[2]) ** 2 for z in Z), beta

xs = sorted(x for x, _ in pts); lo, hi = xs[int(0.15 * n)], xs[int(0.85 * n)]
best = None; k = lo
while k <= hi + 1e-12:
    s, be = pw(k)
    if best is None or s < best[0]: best = (s, be, k)
    k += 0.01
s_pw, be, kk = best
F = (ssr_lin - s_pw) / (s_pw / (n - 3))
print(json.dumps({
    "transcription_rows_checked": len(rows), "transcription_mismatches": miss,
    "n_matched": n, "a": round(a, 5), "b": round(b, 6), "r2": round(r2, 5),
    "share_at_15000": round(a + b * math.log(15000), 5),
    "gdp_at_35_30_25": [round(math.exp((t - a) / b)) for t in (0.35, 0.30, 0.25)],
    "knot_gdp": round(math.exp(kk)), "slope_below": round(be[1], 4), "slope_above": round(be[1] + be[2], 4), "supF": round(F, 2),
}, indent=1))
