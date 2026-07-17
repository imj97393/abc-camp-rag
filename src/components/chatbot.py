import json
import re

import pandas as pd
import streamlit as st
from groq import Groq


SYSTEM_PROMPT = """당신은 Yes24 IT 모바일 베스트셀러 도서 추천 어시스턴트입니다.
사용자의 질문을 분석하여 관련 도서를 추천해 줍니다.

규칙:
1. 제공된 도서 목록(context)에서 사용자 질문과 관련된 도서를 찾아 추천합니다.
2. 추천할 도서가 있으면 각 도서의 제목, 저자, 출판사, 가격, 그리고 [상세보기](링크) 형식으로 링크를 포함하여 답변합니다.
3. 추천할 도서가 없다면 "현재 데이터베이스에 해당 조건의 도서는 없습니다."라고 솔직하게 답변합니다.
4. 답변은 한국어로 작성합니다.
5. 마크다운 형식을 활용하여 가독성 있게 답변합니다.
6. 링크 형식: [상세보기](URL) - 반드시 실제 URL을 사용하세요.

도구 사용 규칙:
- 사용자가 가격에 대해 질문하면(예: "가격 범위", "가격순 정렬", "가장 비싼 책", "가장 저렴한 책", "평균 가격", "할인율") get_price_statistics 도구를 호출하세요.
- 사용자가 판매지수에 대해 질문하면(예: "판매지수", "판매지수 높은", "판매지수 범위") get_sales_index_statistics 도구를 호출하세요.
- 도구 호출 후 결과를 바탕으로 사용자에게 친절하게 답변하세요.
- 도구 결과의 JSON 데이터를 자연스러운 한국어 문장으로 변환하여 답변하세요."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_price_statistics",
            "description": "전체 도서의 가격(판매가, 정가) 관련 통계, 범위, 분포를 계산하고 정렬된 도서 목록을 반환합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sort_by": {
                        "type": "string",
                        "enum": ["price_asc", "price_desc", "discount_desc"],
                        "description": "정렬 기준: price_asc(가격 오름차순), price_desc(가격 내림차순), discount_desc(할인율 높은순)",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "반환할 도서 수 (기본값 10)",
                    },
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_sales_index_statistics",
            "description": "전체 도서의 판매지수 관련 통계, 범위, 분포를 계산하고 정렬된 도서 목록을 반환합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sort_by": {
                        "type": "string",
                        "enum": ["index_asc", "index_desc", "price_asc", "price_desc"],
                        "description": "정렬 기준: index_asc(판매지수 오름차순), index_desc(판매지수 내림차순), price_asc(가격 오름차순), price_desc(가격 내림차순)",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "반환할 도서 수 (기본값 10)",
                    },
                },
                "required": [],
            },
        },
    },
]


def _exec_price_statistics(df: pd.DataFrame, sort_by: str = "price_desc", limit: int = 10) -> dict:
    prices = df["판매가_num"]
    originals = df["정가_num"]
    discounts = df["할인율_num"]

    stats = {
        "total_books": len(df),
        "sale_price": {
            "min": int(prices.min()),
            "max": int(prices.max()),
            "mean": round(float(prices.mean())),
            "median": round(float(prices.median())),
        },
        "original_price": {
            "min": int(originals.min()),
            "max": int(originals.max()),
            "mean": round(float(originals.mean())),
            "median": round(float(originals.median())),
        },
        "discount_rate": {
            "min": int(discounts.min()),
            "max": int(discounts.max()),
            "mean": round(float(discounts.mean()), 1),
        },
        "price_ranges": {
            "1만원 미만": int((prices < 10000).sum()),
            "1만~2만원": int(((prices >= 10000) & (prices < 20000)).sum()),
            "2만~3만원": int(((prices >= 20000) & (prices < 30000)).sum()),
            "3만~4만원": int(((prices >= 30000) & (prices < 40000)).sum()),
            "4만원 이상": int((prices >= 40000).sum()),
        },
    }

    sorted_df = df.copy()
    if sort_by == "price_asc":
        sorted_df = sorted_df.sort_values("판매가_num", ascending=True)
    elif sort_by == "price_desc":
        sorted_df = sorted_df.sort_values("판매가_num", ascending=False)
    elif sort_by == "discount_desc":
        sorted_df = sorted_df.sort_values("할인율_num", ascending=False)

    books = []
    for _, row in sorted_df.head(limit).iterrows():
        book = {
            "rank": int(row["순위"]),
            "title": row["제목"],
            "author": row["저자"],
            "publisher": row["출판사"],
            "sale_price": int(row["판매가_num"]),
            "original_price": int(row["정가_num"]),
            "discount_rate": int(row["할인율_num"]),
            "link": row["링크"],
        }
        books.append(book)

    stats["sorted_books"] = books
    return stats


def _exec_sales_index_statistics(df: pd.DataFrame, sort_by: str = "index_desc", limit: int = 10) -> dict:
    indices = df["판매지수_num"]
    has_data = bool(indices.sum() > 0)

    stats = {
        "total_books": len(df),
        "has_sales_index_data": has_data,
    }

    if has_data:
        non_zero = indices[indices > 0]
        stats["sales_index"] = {
            "min": int(non_zero.min()) if len(non_zero) > 0 else 0,
            "max": int(non_zero.max()) if len(non_zero) > 0 else 0,
            "mean": round(float(non_zero.mean()), 1) if len(non_zero) > 0 else 0,
            "median": round(float(non_zero.median()), 1) if len(non_zero) > 0 else 0,
            "count_with_data": int(len(non_zero)),
        }
        stats["index_ranges"] = {
            "1000 미만": int((non_zero < 1000).sum()),
            "1000~5000": int(((non_zero >= 1000) & (non_zero < 5000)).sum()),
            "5000~10000": int(((non_zero >= 5000) & (non_zero < 10000)).sum()),
            "10000~50000": int(((non_zero >= 10000) & (non_zero < 50000)).sum()),
            "50000 이상": int((non_zero >= 50000).sum()),
        }
    else:
        stats["message"] = "판매지수 데이터가 아직 수집되지 않았습니다. 판매지수는 스크래퍼를 업데이트한 후 재수집하면 제공됩니다."
        stats["sales_index"] = {"min": 0, "max": 0, "mean": 0, "median": 0, "count_with_data": 0}
        stats["index_ranges"] = {}

    sorted_df = df.copy()
    if sort_by == "index_asc":
        sorted_df = sorted_df.sort_values("판매지수_num", ascending=True)
    elif sort_by == "index_desc":
        sorted_df = sorted_df.sort_values("판매지수_num", ascending=False)
    elif sort_by == "price_asc":
        sorted_df = sorted_df.sort_values("판매가_num", ascending=True)
    elif sort_by == "price_desc":
        sorted_df = sorted_df.sort_values("판매가_num", ascending=False)

    books = []
    for _, row in sorted_df.head(limit).iterrows():
        book = {
            "rank": int(row["순위"]),
            "title": row["제목"],
            "author": row["저자"],
            "publisher": row["출판사"],
            "sale_price": int(row["판매가_num"]),
            "original_price": int(row["정가_num"]),
            "discount_rate": int(row["할인율_num"]),
            "sales_index": int(row["판매지수_num"]),
            "link": row["링크"],
        }
        books.append(book)

    stats["sorted_books"] = books
    return stats


def _build_book_context(df: pd.DataFrame, query: str, max_items: int = 30) -> str:
    if df.empty:
        return ""

    keywords = re.findall(r"[\w가-힣]+", query.lower())
    if not keywords:
        top = df.head(max_items)
    else:
        mask = pd.Series([False] * len(df))
        for kw in keywords:
            mask |= df["제목"].str.contains(kw, case=False, na=False)
            mask |= df["저자"].str.contains(kw, case=False, na=False)
            mask |= df["출판사"].str.contains(kw, case=False, na=False)
        matched = df[mask]
        if matched.empty:
            top = df.head(max_items)
        else:
            top = matched.head(max_items)

    lines = []
    for _, row in top.iterrows():
        sale = int(row["판매가_num"])
        original = int(row["정가_num"])
        discount = int(row["할인율_num"])
        link = row["링크"]
        price_str = f"{sale:,}원"
        if original > sale:
            price_str += f" (정가 {original:,}원, {discount}% 할인)"
        else:
            price_str += f" (정가 {original:,}원)"
        lines.append(
            f"- 순위 {row['순위']}: {row['제목']} | 저자: {row['저자']} | "
            f"출판사: {row['출판사']} | 출간일: {row['출간일']} | "
            f"가격: {price_str} | 링크: {link}"
        )
    return "\n".join(lines)


def _execute_tool(name: str, arguments: dict, df: pd.DataFrame) -> str:
    if name == "get_price_statistics":
        sort_by = arguments.get("sort_by", "price_desc")
        limit = arguments.get("limit", 10)
        result = _exec_price_statistics(df, sort_by=sort_by, limit=limit)
    elif name == "get_sales_index_statistics":
        sort_by = arguments.get("sort_by", "index_desc")
        limit = arguments.get("limit", 10)
        result = _exec_sales_index_statistics(df, sort_by=sort_by, limit=limit)
    else:
        result = {"error": f"알 수 없는 도구: {name}"}
    return json.dumps(result, ensure_ascii=False, indent=2)


def chat_with_groq(client: Groq, df: pd.DataFrame, query: str, model: str) -> str:
    context = _build_book_context(df, query)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"다음은 Yes24 IT 모바일 베스트셀러 도서 목록입니다:\n\n{context}\n\n---\n\n사용자 질문: {query}",
        },
    ]

    max_tool_rounds = 3
    for _ in range(max_tool_rounds):
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=TOOLS,
            temperature=0.3,
            max_tokens=2048,
        )

        choice = response.choices[0]
        msg = choice.message

        if msg.tool_calls:
            messages.append({
                "role": "assistant",
                "content": None,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        },
                    }
                    for tc in msg.tool_calls
                ],
            })

            for tc in msg.tool_calls:
                args = json.loads(tc.function.arguments)
                tool_result = _execute_tool(tc.function.name, args, df)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": tool_result,
                })
        else:
            return msg.content

    final_response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.3,
        max_tokens=2048,
    )
    return final_response.choices[0].message.content


def render_chat_message(role: str, content: str):
    with st.chat_message(role, avatar="📚" if role == "assistant" else "👤"):
        st.markdown(content, unsafe_allow_html=True)


def page_chatbot(df: pd.DataFrame):
    st.header("📚 도서 추천 챗봇")

    with st.sidebar:
        st.markdown("---")
        st.subheader("⚙️ 챗봇 설정")
        api_key = st.text_input(
            "Groq API Key",
            type="password",
            placeholder="gsk_...",
            help="https://console.groq.com 에서 API Key를 발급받으세요.",
        )
        model = st.selectbox(
            "모델 선택",
            [
                "llama-3.3-70b-versatile",
                "llama-3.1-8b-instant",
                "mixtral-8x7b-32768",
                "gemma2-9b-it",
            ],
            index=0,
        )

    if not api_key:
        st.info("🔑 사이드바에서 Groq API Key를 입력해 주세요.")
        st.markdown("""
        ### 사용법
        1. [Groq Console](https://console.groq.com)에서 API Key를 발급받으세요
        2. 사이드바에 API Key를 입력하세요
        3. 질문을 입력하면 관련 도서를 추천해 드립니다

        **예시 질문:**
        - "AI 관련 책 추천해줘"
        - "Python 배우기 좋은 책 있어?"
        - "바이브 코딩에 대한 책 추천"
        - "가성비 좋은 IT 책 추천해줘"
        - "클로드 관련 책 있어?"

        **도구 기반 질문 (Function Calling):**
        - "가격 범위가 어떻게 되나요?"
        - "가장 저렴한 책 5권 보여줘"
        - "가격 높은순으로 정렬해줘"
        - "판매지수가 높은 책 추천해줘"
        - "할인율이 높은 책 있어?"
        """)
        return

    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []

    for msg in st.session_state.chat_messages:
        render_chat_message(msg["role"], msg["content"])

    user_input = st.chat_input("IT 도서에 대해 질문해 보세요...")
    if not user_input:
        return

    render_chat_message("user", user_input)
    st.session_state.chat_messages.append({"role": "user", "content": user_input})

    try:
        client = Groq(api_key=api_key)
        with st.spinner("🔍 관련 도서를 검색하고 있습니다..."):
            response = chat_with_groq(client, df, user_input, model)
    except Exception as e:
        error_msg = f"API 호출 중 오류가 발생했습니다: {str(e)}"
        render_chat_message("assistant", error_msg)
        st.session_state.chat_messages.append({"role": "assistant", "content": error_msg})
        return

    render_chat_message("assistant", response)
    st.session_state.chat_messages.append({"role": "assistant", "content": response})

    matched = _build_book_context(df, user_input, max_items=5)
    if matched:
        with st.expander("🔗 추천 도서 빠른 링크", expanded=False):
            for line in matched.strip().split("\n"):
                line = line.strip().lstrip("- ")
                parts = line.split(" | ")
                title_part = parts[0] if parts else ""
                link_part = [p for p in parts if p.startswith("링크: ")]
                if link_part:
                    url = link_part[0].replace("링크: ", "")
                    title_text = title_part.split(": ", 1)[-1] if ": " in title_part else title_part
                    st.markdown(f"📖 [{title_text}]({url})")
