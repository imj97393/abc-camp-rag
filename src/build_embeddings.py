"""도서 데이터로부터 임베딩(.npz) 파일을 생성하는 스크립트.

사용법:
    python src/build_embeddings.py

결과물:
    data/yes24_embeddings.npz
        - vectors: float32 (N, D) 임베딩 행렬 (L2 정규화됨)
        - ids: 각 벡터에 대응하는 도서 순위
        - texts: 임베딩에 사용된 원본 텍스트
        - model: 사용한 모델명
"""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))

from data_loader import load_data

DEFAULT_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
OUTPUT_PATH = os.path.join(DATA_DIR, "yes24_embeddings.npz")


def build_text(row) -> str:
    parts = [
        str(row.get("제목", "")),
        str(row.get("저자", "")),
        str(row.get("출판사", "")),
    ]
    return " ".join(p for p in parts if p and p != "nan").strip()


def main(model_name: str = DEFAULT_MODEL, output_path: str = OUTPUT_PATH) -> None:
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print(
            "sentence-transformers가 설치되어 있지 않습니다.\n"
            "설치: pip install sentence-transformers"
        )
        raise

    df = load_data()
    texts = df.apply(build_text, axis=1).tolist()
    ids = df["순위"].astype(int).tolist()

    print(f"임베딩 대상 도서 수: {len(texts)}")
    print(f"모델 로딩 중: {model_name}")
    model = SentenceTransformer(model_name)

    print("임베딩 계산 중...")
    vectors = model.encode(
        texts,
        batch_size=64,
        show_progress_bar=True,
        normalize_embeddings=True,
    ).astype(np.float32)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.savez_compressed(
        output_path,
        vectors=vectors,
        ids=np.array(ids, dtype=np.int64),
        texts=np.array(texts, dtype=object),
        model=np.array(model_name),
    )
    print(f"저장 완료: {output_path}  (shape={vectors.shape})")


if __name__ == "__main__":
    main()
