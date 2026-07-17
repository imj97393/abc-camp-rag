import os
import sys

import pandas as pd
import streamlit as st

sys.path.insert(0, os.path.dirname(__file__))

from data_loader import load_data, search_books
from components.charts import (
    overview_metrics,
    price_distribution,
    price_vs_rank,
    publisher_ranking,
    publisher_avg_price,
    publication_trend,
    discount_analysis,
    author_top_words,
    price_box_by_publisher,
    rank_range_filter,
)
from components.chatbot import page_chatbot

st.set_page_config(
    page_title="Yes24 IT 모바일 베스트셀러 대시보드",
    page_icon="https://image.yes24.com/sysimage/renew/gnb/favicon_n.ico",
    layout="wide",
)


@st.cache_data
def load_cached_data():
    return load_data()


def render_book_card(row):
    rank = int(row["순위"])
    title = row["제목"]
    author = row["저자"]
    publisher = row["출판사"]
    sale = int(row["판매가_num"])
    original = int(row["정가_num"])
    discount = int(row["할인율_num"])
    pub_date = row["출간일"]
    link = row["링크"]
    img = row["이미지"]

    discount_badge = f"🔴 {discount}% 할인" if discount > 0 else ""
    price_display = f"**{sale:,}원**"
    if original > sale:
        price_display += f"  ~~~{original:,}원~~~"

    st.markdown(f"### {rank}. [{title}]({link})")
    c1, c2 = st.columns([1, 3])
    with c1:
        if img and img.startswith("http"):
            st.image(img, width=100)
        else:
            st.markdown("📷")
    with c2:
        st.markdown(f"**저자:** {author} | **출판사:** {publisher} | **출간일:** {pub_date}")
        st.markdown(f"{price_display}  {discount_badge}")
    st.divider()


def page_overview(df):
    st.header("IT 모바일 베스트셀러 개요")
    overview_metrics(df)
    st.divider()
    filtered = rank_range_filter(df)
    col1, col2 = st.columns(2)
    with col1:
        publisher_ranking(filtered)
    with col2:
        publication_trend(filtered)
    st.divider()
    price_distribution(filtered)
    st.divider()
    discount_analysis(filtered)


def page_price_analysis(df):
    st.header("가격 분포 분석")
    overview_metrics(df)
    st.divider()
    price_distribution(df)
    st.divider()
    price_vs_rank(df)
    st.divider()
    price_box_by_publisher(df)
    st.divider()
    discount_analysis(df)


def page_publisher_analysis(df):
    st.header("출판사 분석")
    col1, col2 = st.columns(2)
    with col1:
        n = st.slider("상위 출판사 수", 5, 30, 15, key="pub_n")
        publisher_ranking(df, top_n=n)
    with col2:
        publisher_avg_price(df, top_n=n)
    st.divider()
    price_box_by_publisher(df, top_n=n)
    st.divider()
    author_top_words(df)


def page_search(df):
    st.header("키워드 검색")

    tab_search, tab_advanced = st.tabs(["검색", "고급 검색"])

    with tab_search:
        query = st.text_input(
            "제목 또는 저자로 검색",
            placeholder="예: AI, 클로드, 조태호, 바이브 코딩 ...",
        )
        results = search_books(df, query)
        st.caption(f"검색 결과: **{len(results)}건**")

        if results.empty and query:
            st.info("검색 결과가 없습니다. 다른 키워드를 시도해 보세요.")
        elif not results.empty:
            for _, row in results.head(50).iterrows():
                render_book_card(row)
            if len(results) > 50:
                st.info(f"총 {len(results)}건 중 상위 50건만 표시됩니다.")

    with tab_advanced:
        c1, c2, c3 = st.columns(3)
        with c1:
            min_price = st.number_input("최소 판매가", value=0, step=1000)
        with c2:
            max_price = st.number_input("최대 판매가", value=int(df["판매가_num"].max()), step=1000)
        with c3:
            publisher_filter = st.multiselect(
                "출판사 선택", options=sorted(df["출판사"].unique().tolist())
            )

        col4, col5 = st.columns(2)
        with col4:
            discount_min = st.slider("최소 할인율", 0, 50, 0)
        with col5:
            year_range = st.slider(
                "출간년도 범위",
                min_value=int(df["출간년도"].dropna().min()),
                max_value=int(df["출간년도"].dropna().max()),
                value=(
                    int(df["출간년도"].dropna().min()),
                    int(df["출간년도"].dropna().max()),
                ),
            )

        mask = (
            (df["판매가_num"] >= min_price)
            & (df["판매가_num"] <= max_price)
            & (df["할인율_num"] >= discount_min)
            & (df["출간년도"] >= year_range[0])
            & (df["출간년도"] <= year_range[1])
        )
        if publisher_filter:
            mask &= df["출판사"].isin(publisher_filter)

        adv_results = df[mask]
        st.caption(f"검색 결과: **{len(adv_results)}건**")

        if adv_results.empty:
            st.info("해당 조건에 맞는 도서가 없습니다.")
        else:
            for _, row in adv_results.head(50).iterrows():
                render_book_card(row)
            if len(adv_results) > 50:
                st.info(f"총 {len(adv_results)}건 중 상위 50건만 표시됩니다.")


def page_ranking(df):
    st.header("전체 순위 목록")
    rank_range = st.slider(
        "순위 범위",
        min_value=1,
        max_value=int(df["순위"].max()),
        value=(1, 50),
    )
    filtered = df[(df["순위"] >= rank_range[0]) & (df["순위"] <= rank_range[1])]
    st.caption(f"총 **{len(filtered)}권**")

    display_df = filtered[
        ["순위", "제목", "저자", "출판사", "출간일", "판매가", "정가", "할인율"]
    ].copy()
    st.dataframe(display_df, use_container_width=True, height=600)

    csv_data = filtered.to_csv(index=False, encoding="utf-8-sig")
    st.download_button(
        label="선택 범위 CSV 다운로드",
        data=csv_data,
        file_name="yes24_filtered.csv",
        mime="text/csv",
    )


def main():
    df = load_cached_data()

    st.sidebar.title("Yes24 IT 모바일\n베스트셀러 대시보드")
    st.sidebar.markdown("---")
    st.sidebar.caption(f"총 **{len(df):,}권** 도서 데이터")

    page = st.sidebar.radio(
        "페이지 선택",
        ["개요", "가격 분석", "출판사 분석", "키워드 검색", "전체 순위", "📚 챗봇 추천"],
    )

    st.sidebar.markdown("---")
    with st.sidebar.expander("데이터 정보"):
        st.write(f"- 수집 도서 수: {len(df):,}권")
        st.write(f"- 출판사 수: {df['출판사'].nunique():,}곳")
        st.write(f"- 가격 범위: {df['판매가_num'].min():,}~{df['판매가_num'].max():,}원")
        st.write(f"- 출간 기간: {df['출간일'].dropna().min()} ~ {df['출간일'].dropna().max()}")

    if page == "개요":
        page_overview(df)
    elif page == "가격 분석":
        page_price_analysis(df)
    elif page == "출판사 분석":
        page_publisher_analysis(df)
    elif page == "키워드 검색":
        page_search(df)
    elif page == "전체 순위":
        page_ranking(df)
    elif page == "📚 챗봇 추천":
        page_chatbot(df)


if __name__ == "__main__":
    main()
