
#!/usr/bin/env python3
"""
Convert the campaign JSON (like the one we crafted) into a set of CSVs
ready for Google Ads Editor import. Keeps JSON as the single source of truth.

Usage:
  python json_to_ads_csv.py --input campaigns.json --out out/

Outputs:
  campaigns.csv
  asset_groups.csv
  assets_text.csv
  search_themes.csv
  sitelinks.csv
  callouts.csv
  structured_snippets.csv
  phones.csv

Notes:
- If a section is missing in JSON, the script skips it gracefully.
- Languages can be a list; we store as a pipe-joined string (e.g., "es|en").
- Asset text types emitted:
    headline_30, headline_90, description_90, description_180, cta
"""

import argparse
import json
import csv
from pathlib import Path
from typing import Any, Iterable

def join_array(node: Any, sep: str = "|") -> str:
    if isinstance(node, list):
        return sep.join([str(x) for x in node])
    return ""

def write_csv(path: Path, header: Iterable[str], rows: Iterable[Iterable[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(list(header))
        for r in rows:
            w.writerow(list(r))

def emit_rows(root: dict, out_dir: Path) -> None:
    campaigns = root.get("campaigns", [])

    # Prepare CSV paths
    p_campaigns = out_dir / "campaigns.csv"
    p_asset_groups = out_dir / "asset_groups.csv"
    p_assets_text = out_dir / "assets_text.csv"
    p_search_themes = out_dir / "search_themes.csv"
    p_sitelinks = out_dir / "sitelinks.csv"
    p_callouts = out_dir / "callouts.csv"
    p_structured = out_dir / "structured_snippets.csv"
    p_phones = out_dir / "phones.csv"

    # Accumulators
    rows_campaigns = []
    rows_asset_groups = []
    rows_assets_text = []
    rows_search_themes = []
    rows_sitelinks = []
    rows_callouts = []
    rows_structured = []
    rows_phones = []

    for camp in campaigns:
        campaign_name = camp.get("name", "")
        type_ = camp.get("type", "")
        objective = camp.get("objective", "")
        geo = camp.get("geo_target", {}) or {}
        city = geo.get("city", "")
        country = geo.get("country", "")
        radius_km = str(geo.get("radius_km", ""))
        languages = join_array(camp.get("languages", []))
        final_url = camp.get("url", "")
        offer = camp.get("offer", "")

        rows_campaigns.append([campaign_name, type_, objective, city, country, radius_km, languages, final_url, offer])

        # Asset groups
        for ag in camp.get("asset_groups", []):
            ag_name = ag.get("name", "")
            ag_final_url = ag.get("final_url", final_url)
            brand = ag.get("brand_guidelines", {}) or {}
            business_name = brand.get("business_name", "")
            # Infer language from asset group name suffix, or leave blank
            lang = ""
            if " - ES" in ag_name or "Niños - ES" in ag_name or "Adultos - ES" in ag_name:
                lang = "es"
            elif "EN" in ag_name or "(Expats)" in ag_name:
                lang = "en"

            rows_asset_groups.append([campaign_name, ag_name, ag_final_url, lang, business_name])

            assets = ag.get("assets", {}) or {}
            def push_assets(list_key: str, type_name: str):
                for txt in assets.get(list_key, []) or []:
                    if txt:
                        rows_assets_text.append([campaign_name, ag_name, type_name, txt])

            push_assets("headlines_short_30", "headline_30")
            push_assets("headlines_long_90", "headline_90")
            push_assets("descriptions_90", "description_90")
            push_assets("descriptions_long_180", "description_180")

            cta = assets.get("call_to_action")
            if cta:
                rows_assets_text.append([campaign_name, ag_name, "cta", cta])

            # Search themes (AssetGroupSignal)
            signals = ag.get("signals", {}) or {}
            for theme in signals.get("search_themes", []) or []:
                if theme:
                    rows_search_themes.append([campaign_name, ag_name, theme])

        # Extensions (shared at campaign level)
        exts = camp.get("extensions", {}) or {}

        for sl in exts.get("sitelinks", []) or []:
            rows_sitelinks.append([
                campaign_name,
                sl.get("text", ""),
                sl.get("description1", ""),
                sl.get("description2", ""),
                sl.get("final_url", ""),
                sl.get("language", ""),
            ])

        for callout in exts.get("callouts", []) or []:
            rows_callouts.append([campaign_name, callout, ""])

        for ss in exts.get("structured_snippets", []) or []:
            header = ss.get("header", "")
            lang = ss.get("language", "")
            for val in ss.get("values", []) or []:
                rows_structured.append([campaign_name, header, val, lang])

        phone = (exts.get("phone") or {})
        if phone and phone.get("number"):
            rows_phones.append([campaign_name, phone.get("country_code", ""), phone.get("number", "")])

    # Write CSVs
    write_csv(p_campaigns,
              ["campaign_name","type","objective","city","country","radius_km","languages","final_url","offer"],
              rows_campaigns)
    write_csv(p_asset_groups, ["campaign_name","asset_group_name","final_url","language","business_name"], rows_asset_groups)
    write_csv(p_assets_text, ["campaign_name","asset_group_name","type","text"], rows_assets_text)
    write_csv(p_search_themes, ["campaign_name","asset_group_name","search_theme"], rows_search_themes)
    write_csv(p_sitelinks, ["campaign_name","text","description1","description2","final_url","language"], rows_sitelinks)
    write_csv(p_callouts, ["campaign_name","callout_text","language"], rows_callouts)
    write_csv(p_structured, ["campaign_name","header","value","language"], rows_structured)
    write_csv(p_phones, ["campaign_name","country_code","number"], rows_phones)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="Ruta al JSON de campañas")
    ap.add_argument("--out", required=True, help="Directorio de salida para CSVs")
    args = ap.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        data = json.load(f)

    out_dir = Path(args.out)
    emit_rows(data, out_dir)
    print(f"CSV generados en: {out_dir.resolve()}")

if __name__ == "__main__":
    main()
