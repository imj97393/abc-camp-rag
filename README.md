# ABC-RAG: Yes24 IT 모바일 베스트셀러 분석 프로젝트

예스24 IT 모바일 종합 베스트셀러 도서 데이터를 수집·분석하고, 시각화 대시보드를 자동 생성하는 프로젝트입니다.

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **데이터 소스** | 예스24 IT 모바일 종합 베스트셀러 |
| **수집 규모** | 1,000권 (전체 페이지) |
| **수집 필드** | 순위, 제목, 저자, 출판사, 출간일, 판매가, 정가, 할인율, 판매지수, 링크, 이미지 |
| **출력 형식** | CSV, Excel 대시보드 (.xlsx) |

## 작업 내역

### 1단계: 웹 크롤러 개발
- `scrape_yes24.py` — requests + BeautifulSoup 기반 크롤러 (초기 버전)
- `yes24_scraper.py` — Scrapling 기반 크롤러 (최종 버전)
  - 실제 브라우저 요청처럼 User-Agent 등 헤더 설정
  - 전체 페이지 자동 페이징 및 종료 조건 처리
  - 요청 간 랜덤 딜레이(1.5~3초)로 서버 부하 최소화
  - 중복 상품 번호 캐싱으로 정확한 수집 보장

### 2단계: 데이터 전처리 및 분석 모듈
- `src/data_loader.py`
  - CSV 데이터 로드 및 숫자형 변환 (판매가, 정가, 할인율)
  - 출간일에서 연도·월 추출
  - 제목·저자 정규화 (유니코드 정규화 + 소문자 변환)
  - 출판사별 통계, 도서 검색 유틸리티 함수 제공

### 3단계: Excel 대시보드 자동 생성
- `src/create_excel_dashboard.py` — openpyxl 기반 대시보드 생성 스크립트

#### 대시보드 시트 구성 (6개 시트)

| 시트 | 내용 |
|------|------|
| **대시보드 요약** | KPI 카드(총 도서 수, 평균 판매가, 평균 할인율, 출판사 수), 출판사별 도서 수 바 차트, 출간년도별 도서 수 차트 |
| **가격 분석** | 가격 구간별 도서 수·평균 할인율·평균 판매가, 할인율 구간별 분석, 상위 20권(가격 기준) |
| **출판사 분석** | 출판사별 도서 수·평균 판매가·평균 할인율·최고/최저 판매가, 출판사별 도서 수 차트 |
| **Top 50 순위** | 베스트셀러 Top 50 목록 (금/은동메달 시각 강조), Top 20 판매가 비교 차트 |
| **월별 추이** | 출간 월별 도서 수 추이 차트 |
| **전체 데이터** | 전체 1,000권 상세 목록 (자동 필터, 헤더 고정) |

### 4단계: PPT 제안서 생성
- `create_ppt.js` — pptxgenjs 기반 Node.js 스크립트
- `AI시대_도서기획_제안서.pptx` — AI시대 도서 기획 제안서 결과물

## 기술 스택

| 분류 | 기술 |
|------|------|
| **크롤링** | Python, requests, BeautifulSoup4, Scrapling, lxml |
| **데이터 처리** | Python, pandas |
| **대시보드** | Python, openpyxl (차트, 스타일링, 데이터 검증) |
| **PPT 생성** | Node.js, pptxgenjs |
| **버전 관리** | Git, GitHub |

## 프로젝트 구조

```
ABC-RAG/
├── data/
│   ├── yes24_it_mobile_bestseller.csv          # 수집된 원본 데이터 (1,000권)
│   └── yes24_it_mobile_bestseller_dashboard.xlsx  # 생성된 Excel 대시보드
├── src/
│   ├── __init__.py
│   ├── data_loader.py                           # 데이터 로드 및 전처리
│   └── create_excel_dashboard.py                # Excel 대시보드 생성
├── scrape_yes24.py                              # 크롤러 (requests + BS4)
├── yes24_scraper.py                             # 크롤러 (Scrapling)
├── create_ppt.js                                # PPT 제안서 생성 스크립트
├── AI시대_도서기획_제안서.pptx                    # 결과 PPT 파일
├── implementation_plan.md                       # 구현 계획서
├── requirements.txt                             # Python 의존성
├── package.json                                 # Node.js 의존성
└── README.md
```

## 실행 방법

### 1. 환경 설정

```bash
# Python 가상환경 생성 및 활성화
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Python 의존성 설치
uv pip install -r requirements.txt

# Node.js 의존성 설치 (PPT 생성 시)
npm install
```

### 2. 데이터 수집

```bash
# Scrapling 기반 크롤러 실행 (최종 버전)
python yes24_scraper.py

# 또는 requests + BeautifulSoup 기반 크롤러
python scrape_yes24.py
```

### 3. 대시보드 생성

```bash
python src/create_excel_dashboard.py
```

### 4. PPT 제안서 생성

```bash
node create_ppt.js
```

## 챗봇 (RAG) 및 배포

### 임베딩 파일 생성

의미 기반(semantic) 검색을 위해 임베딩 파일을 생성합니다.

```bash
python src/build_embeddings.py
# 결과: data/yes24_embeddings.npz
```

- 생성된 `.npz` 파일은 앱 실행 시 자동 로드되며, 사이드바에서 직접 업로드할 수도 있습니다.
- `sentence-transformers`가 없거나 임베딩 파일이 없으면 자동으로 키워드 매칭으로 폴백됩니다.

### 배포 환경에서 챗봇 사용

배포된 앱에서 사용자가 API 키를 매번 입력하지 않도록, `st.secrets` 또는 환경변수로 키를 주입할 수 있습니다.

- Streamlit Cloud: 앱 Secrets에 `GROQ_API_KEY` 등록
- 로컬: `.streamlit/secrets.toml`에 등록 (`.streamlit/secrets.toml.example` 참고)

API Key 우선순위: **사이드바 입력 → `st.secrets` → 환경변수(`GROQ_API_KEY`)**

## 라이선스

이 프로젝트는 학습 및 연구 목적으로 제작되었습니다.
