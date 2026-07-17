import os
import re
import unicodedata

import pandas as pd


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CSV_PATH = os.path.join(DATA_DIR, "yes24_it_mobile_bestseller.csv")


def _clean_price(value):
    if pd.isna(value) or value == "":
        return 0
    cleaned = re.sub(r"[^\d]", "", str(value))
    return int(cleaned) if cleaned else 0


def _normalize_year(value):
    if pd.isna(value) or value == "":
        return None
    match = re.search(r"(\d{4})", str(value))
    return int(match.group(1)) if match else None


def _normalize_month(value):
    if pd.isna(value) or value == "":
        return None
    match = re.search(r"(\d{4})년\s*(\d{1,2})월", str(value))
    return int(match.group(2)) if match else None


def _extract_year_month(value):
    if pd.isna(value) or value == "":
        return None
    match = re.search(r"(\d{4})년\s*(\d{1,2})월", str(value))
    if match:
        return f"{match.group(1)}-{int(match.group(2)):02d}"
    return None


def load_data() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")

    df["판매가_num"] = df["판매가"].apply(_clean_price)
    df["정가_num"] = df["정가"].apply(_clean_price)
    df["할인율_num"] = pd.to_numeric(df["할인율"], errors="coerce").fillna(0).astype(int)

    if "판매지수" in df.columns:
        df["판매지수_num"] = df["판매지수"].apply(_clean_price)
    else:
        df["판매지수_num"] = 0

    df["출간년도"] = df["출간일"].apply(_normalize_year)
    df["출간월"] = df["출간일"].apply(_normalize_month)
    df["출간년월"] = df["출간일"].apply(_extract_year_month)

    df["제목_정규화"] = df["제목"].apply(
        lambda x: unicodedata.normalize("NFKC", str(x)).lower() if pd.notna(x) else ""
    )
    df["저자_정규화"] = df["저자"].apply(
        lambda x: unicodedata.normalize("NFKC", str(x)).lower() if pd.notna(x) else ""
    )

    return df


def get_top_publishers(df: pd.DataFrame, n: int = 15) -> pd.DataFrame:
    return (
        df["출판사"]
        .value_counts()
        .head(n)
        .reset_index()
        .rename(columns={"index": "출판사", "출판사": "출판사명", "count": "도서 수"})
    )


def search_books(df: pd.DataFrame, query: str) -> pd.DataFrame:
    if not query or not query.strip():
        return df
    q = unicodedata.normalize("NFKC", query).lower().strip()
    mask = df["제목_정규화"].str.contains(q, na=False) | df["저자_정규화"].str.contains(
        q, na=False
    )
    return df[mask].copy()
