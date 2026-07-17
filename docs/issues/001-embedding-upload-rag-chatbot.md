# [개선] 임베딩 파일 업로드 및 배포 환경 챗봇 사용 지원

## 배경 / 문제점

현재 챗봇(`src/components/chatbot.py`)은 다음과 같은 한계가 있습니다.

1. **RAG가 아닌 단순 키워드 매칭**
   - `_build_book_context()`가 정규식 키워드 매칭으로 도서 컨텍스트를 구성합니다.
   - 의미 기반 검색(semantic search)이 되지 않아 유사어/자연어 질의에 약합니다.

2. **임베딩 파일 업로드 기능 부재**
   - 미리 계산된 임베딩(벡터) 파일을 활용하거나 업로드할 수 있는 경로가 없습니다.
   - 매 실행마다 전체 CSV를 키워드로 훑어야 합니다.

3. **배포 환경에서 챗봇 사용 불가/불편**
   - API Key를 사용자가 매번 사이드바에 직접 입력해야만 챗봇을 사용할 수 있습니다.
   - Streamlit Cloud 등 배포 결과물에서 배포자가 키를 주입할 방법(`st.secrets`)이 없습니다.

## 목표

- [x] 임베딩 파일을 **생성**하는 스크립트 제공 (`src/build_embeddings.py`)
- [x] 임베딩 파일을 **업로드**하여 챗봇 RAG에 사용 (`.npz` 업로드)
- [x] 임베딩 기반 **의미 검색(RAG)** 으로 컨텍스트 구성 개선
- [x] 배포 환경에서 `st.secrets` 또는 환경변수로 **API 키 자동 주입** 지원
- [x] 임베딩 파일이 없어도 기존 키워드 매칭으로 **동작 유지(하위 호환)**

## 설계

### 1. 임베딩 생성 (`src/build_embeddings.py`)
- `sentence-transformers`의 다국어 모델(`paraphrase-multilingual-MiniLM-L12-v2`)로 각 도서의
  "제목 + 저자 + 출판사" 텍스트를 임베딩합니다.
- 결과를 `data/yes24_embeddings.npz` 로 저장합니다.
  - `vectors`: float32 (N, D) 임베딩 행렬
  - `ids`: 각 벡터에 대응하는 도서 순위
  - `texts`: 임베딩에 사용된 원본 텍스트
  - `model`: 사용한 모델명

### 2. 임베딩 로딩/검색 (`src/components/embeddings.py`)
- `.npz` 파일(로컬 경로 또는 업로드된 파일 객체)을 로드합니다.
- 질의 임베딩과 코사인 유사도로 상위 K개 도서를 반환합니다.
- `sentence-transformers` 미설치 또는 임베딩 미제공 시 `None` 반환(하위 호환).

### 3. 챗봇 개선 (`src/components/chatbot.py`)
- 임베딩이 로드되면 `_build_book_context()`가 의미 검색 결과로 컨텍스트를 구성합니다.
- 사이드바에서 임베딩 `.npz` 파일 업로드 UI 제공.
- API Key 우선순위: 사이드바 입력 → `st.secrets["GROQ_API_KEY"]` → 환경변수 `GROQ_API_KEY`.
- 배포 시 `secrets`에 키가 있으면 입력 없이 즉시 챗봇 사용 가능.

### 4. 배포 설정
- `.streamlit/secrets.toml.example` 제공(키 이름 안내).
- `requirements.txt`에 `numpy`, (선택) `sentence-transformers` 반영.

## 검증
- 임베딩 파일 없이 실행 → 키워드 매칭으로 정상 동작.
- 임베딩 파일 업로드 → 의미 검색 컨텍스트가 반영되는지 확인.
- `secrets`에 키 설정 → 입력 없이 챗봇 사용 가능.
