"""임베딩(.npz) 파일 로딩 및 의미 기반(코사인 유사도) 검색 유틸리티.

- 로컬 경로 또는 Streamlit 업로드 파일 객체 모두 지원합니다.
- .npz 파일이 없으면 CSV 데이터로부터 자동으로 임베딩을 생성합니다.
- sentence-transformers 미설치 시 graceful 하게 None 을 반환하여
  챗봇이 기존 키워드 매칭으로 폴백할 수 있도록 합니다.
"""

import os
from dataclasses import dataclass

import numpy as np

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
DEFAULT_EMBEDDING_PATH = os.path.join(DATA_DIR, "yes24_embeddings.npz")
CSV_PATH = os.path.join(DATA_DIR, "yes24_it_mobile_bestseller.csv")
DEFAULT_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"


@dataclass
class EmbeddingStore:
    vectors: np.ndarray  # (N, D) L2 정규화된 임베딩
    ids: np.ndarray  # (N,) 도서 순위
    texts: np.ndarray  # (N,) 원본 텍스트
    model: str  # 임베딩 생성에 사용된 모델명

    @property
    def size(self) -> int:
        return int(self.vectors.shape[0])


def _build_embeddings_from_csv() -> "EmbeddingStore | None":
    """CSV 데이터로부터 임베딩을 생성하고 .npz 파일로 저장합니다."""
    try:
        import pandas as pd
    except ImportError:
        return None

    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        return None

    if not os.path.exists(CSV_PATH):
        return None

    try:
        df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
        texts = (
            df["제목"].fillna("") + " " + df["저자"].fillna("") + " " + df["출판사"].fillna("")
        ).str.strip().tolist()
        ids = df["순위"].astype(int).tolist()

        model = SentenceTransformer(DEFAULT_MODEL)
        vectors = model.encode(
            texts, batch_size=64, show_progress_bar=False, normalize_embeddings=True
        ).astype(np.float32)

        os.makedirs(os.path.dirname(DEFAULT_EMBEDDING_PATH), exist_ok=True)
        np.savez_compressed(
            DEFAULT_EMBEDDING_PATH,
            vectors=vectors,
            ids=np.array(ids, dtype=np.int64),
            texts=np.array(texts, dtype=object),
            model=np.array(DEFAULT_MODEL),
        )

        return EmbeddingStore(
            vectors=vectors,
            ids=np.array(ids, dtype=np.int64),
            texts=np.array(texts, dtype=object),
            model=DEFAULT_MODEL,
        )
    except Exception:
        return None


def load_embeddings(source=None) -> "EmbeddingStore | None":
    """임베딩 파일을 로드합니다.

    source:
        - None: 기본 경로(data/yes24_embeddings.npz) 사용.
                 파일이 없으면 CSV로부터 자동 생성을 시도합니다.
        - str: 파일 경로
        - file-like: Streamlit UploadedFile 등
    로드 실패 시 None 반환.
    """
    try:
        if source is None:
            if not os.path.exists(DEFAULT_EMBEDDING_PATH):
                return _build_embeddings_from_csv()
            source = DEFAULT_EMBEDDING_PATH

        data = np.load(source, allow_pickle=True)
        if "vectors" not in data:
            return None

        vectors = np.asarray(data["vectors"], dtype=np.float32)
        ids = np.asarray(data["ids"]) if "ids" in data else np.arange(len(vectors))
        texts = (
            np.asarray(data["texts"], dtype=object)
            if "texts" in data
            else np.array([""] * len(vectors), dtype=object)
        )
        model = str(data["model"]) if "model" in data else ""

        return EmbeddingStore(vectors=vectors, ids=ids, texts=texts, model=model)
    except Exception:
        return None


def _load_model(model_name: str):
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        return None
    try:
        return SentenceTransformer(model_name)
    except Exception:
        return None


def semantic_search(store: EmbeddingStore, query: str, top_k: int = 20):
    """질의를 임베딩하여 코사인 유사도 상위 top_k 도서의 (순위, 점수) 리스트를 반환합니다.

    모델 로딩 실패 시 None 반환(폴백 유도).
    """
    if store is None or not query or not query.strip():
        return None

    model = _load_model(store.model or "paraphrase-multilingual-MiniLM-L12-v2")
    if model is None:
        return None

    try:
        q = model.encode([query], normalize_embeddings=True).astype(np.float32)[0]
    except Exception:
        return None

    scores = store.vectors @ q  # 정규화 벡터이므로 코사인 유사도
    top_k = min(top_k, len(scores))
    top_idx = np.argpartition(-scores, top_k - 1)[:top_k]
    top_idx = top_idx[np.argsort(-scores[top_idx])]

    return [(int(store.ids[i]), float(scores[i])) for i in top_idx]
