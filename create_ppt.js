const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'ABC-RAG Team';
pres.title = 'AI 시대 도서 기획 - 신규 도서 제안서';

// 노르딕 모던 스타일 컬러 팔레트
const colors = {
  darkNavy: '1E3A5F',
  softBlue: '5B9BD5',
  lightBlue: 'D6EAF8',
  paleBlue: 'EBF5FB',
  white: 'FFFFFF',
  offWhite: 'F8F9FA',
  textDark: '2C3E50',
  textMuted: '5D6D7E',
  accent: '2E86C1',
  card: 'FFFFFF',
  line: 'D5DBDB'
};

// 헬퍼 함수
const makeShadow = () => ({ type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.08 });

// ============================================
// 슬라이드 1: 표지
// ============================================
let slide1 = pres.addSlide();
slide1.background = { color: colors.darkNavy };

// 상단 장식 라인
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.04, fill: { color: colors.softBlue }
});

// 메인 타이틀
slide1.addText("AI 시대, 새로운 도서를 기획합니다", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.2,
  fontSize: 36, fontFace: 'Georgia', color: colors.white,
  bold: true, align: 'left', margin: 0
});

// 서브 타이틀
slide1.addText("예스24 IT 모바일 베스트셀러 분석 기반\n신규 도서 기획 제안서", {
  x: 0.8, y: 2.6, w: 8.4, h: 1.0,
  fontSize: 18, fontFace: 'Calibri', color: colors.lightBlue,
  align: 'left', margin: 0, lineSpacingMultiple: 1.3
});

// 날짜
slide1.addText("2026.07", {
  x: 0.8, y: 4.2, w: 2, h: 0.5,
  fontSize: 14, fontFace: 'Calibri', color: colors.textMuted,
  align: 'left', margin: 0
});

// 하단 장식 라인
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.585, w: 10, h: 0.04, fill: { color: colors.softBlue }
});

slide1.addNotes("안녕하세요. 오늘은 예스24 IT 모바일 베스트셀러 데이터를 분석하여 AI 시대에 맞는 신규 도서를 기획하기 위한 제안서를 준비했습니다. 248권의 베스트셀러를 분석하고, 시장 트렌드를 파악하여 독자적이고 차별화된 도서 기획안을 제시하겠습니다.");

// ============================================
// 슬라이드 2: 목차
// ============================================
let slide2 = pres.addSlide();
slide2.background = { color: colors.offWhite };

slide2.addText("목차", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.8,
  fontSize: 28, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.15, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

const tocItems = [
  { num: '01', title: '프로젝트 개요', desc: '기획 배경 및 목적' },
  { num: '02', title: '시장 동향 분석', desc: 'IT 도서 시장 현황' },
  { num: '03', title: '베스트셀러 분석', desc: '상위 도서 및 트렌드' },
  { num: '04', title: '카테고리별 분석', desc: 'AI, 바이브코딩, 교육 등' },
  { num: '05', title: '타겟 독자 분석', desc: '핵심 독자 군' },
  { num: '06', title: '신규 도서 기획', desc: '컨셉 및 구성' },
  { num: '07', title: '마케팅 전략', desc: '홍보 및 유통 계획' },
  { num: '08', title: '일정 및 로드맵', desc: '개발 일정' }
];

tocItems.forEach((item, i) => {
  const y = 1.6 + (i * 0.48);
  slide2.addText(item.num, {
    x: 0.8, y: y, w: 0.6, h: 0.4,
    fontSize: 16, fontFace: 'Georgia', color: colors.softBlue,
    bold: true, align: 'left', margin: 0
  });
  slide2.addText(item.title, {
    x: 1.5, y: y, w: 3, h: 0.4,
    fontSize: 14, fontFace: 'Calibri', color: colors.textDark,
    bold: true, align: 'left', margin: 0
  });
  slide2.addText(item.desc, {
    x: 4.5, y: y, w: 4, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: colors.textMuted,
    align: 'left', margin: 0
  });
});

slide2.addNotes("오늘 발표의 목차를 설명드리겠습니다. 크게 8개 섹션으로 구성되어 있습니다. 프로젝트 개요부터 시작해서 시장 동향, 베스트셀러 분석, 카테고리별 분석을 거쳐 타겟 독자 분석과 신규 도서 기획안, 마케팅 전략, 일정까지 순서대로 진행하겠습니다.");

// ============================================
// 슬라이드 3: 프로젝트 개요
// ============================================
let slide3 = pres.addSlide();
slide3.background = { color: colors.offWhite };

slide3.addText("01. 프로젝트 개요", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 좌측 카드
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.5, w: 4.2, h: 3.5,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide3.addText("기획 배경", {
  x: 1.1, y: 1.7, w: 3.6, h: 0.5,
  fontSize: 16, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide3.addText([
  { text: "AI 기술의 급속한 발전으로 IT 도서 시장에서", options: { breakLine: true } },
  { text: "생성형 AI, 바이브 코딩, 에이전트 관련 도서가", options: { breakLine: true } },
  { text: "폭발적으로 증가하고 있습니다.", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "예스24 IT 모바일 베스트셀러 248권을 분석하여", options: { breakLine: true } },
  { text: "시장의 공백과 기회를 발견하고, 차별화된", options: { breakLine: true } },
  { text: "신규 도서를 기획하고자 합니다.", options: {} }
], {
  x: 1.1, y: 2.2, w: 3.6, h: 2.5,
  fontSize: 13, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.4
});

// 우측 카드
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.5, w: 4.2, h: 3.5,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide3.addText("핵심 목표", {
  x: 5.5, y: 1.7, w: 3.6, h: 0.5,
  fontSize: 16, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide3.addText([
  { text: "1. 시장 트렌드 기반 도서 기획", options: { breakLine: true } },
  { text: "2. 차별화된 콘텐츠 전략 수립", options: { breakLine: true } },
  { text: "3. 타겟 독자 명확화", options: { breakLine: true } },
  { text: "4. 실용적인 마케팅 방안 제시", options: { breakLine: true } },
  { text: "5. 구체적인 출간 일정 제시", options: {} }
], {
  x: 5.5, y: 2.2, w: 3.6, h: 2.5,
  fontSize: 13, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.6
});

slide3.addNotes("프로젝트 개요를 설명드리겠습니다. 현재 AI 기술의 발전으로 IT 도서 시장에서 생성형 AI와 바이브 코딩 관련 도서가 급증하고 있습니다. 우리는 예스24 IT 모바일 베스트셀러 248권을 수집하여 데이터 기반으로 시장의 기회를 발견하고자 합니다. 핵심 목표는 시장 트렌드를 반영하되, 기존 도서와 차별화된 콘텐츠를 기획하는 것입니다.");

// ============================================
// 슬라이드 4: 시장 동향
// ============================================
let slide4 = pres.addSlide();
slide4.background = { color: colors.offWhite };

slide4.addText("02. 시장 동향 분석", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 카드 1
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.5, w: 2.8, h: 3.5,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide4.addText("248권", {
  x: 0.8, y: 1.7, w: 2.8, h: 0.8,
  fontSize: 42, fontFace: 'Georgia', color: colors.accent,
  bold: true, align: 'center', margin: 0
});

slide4.addText("분석 대상 도서", {
  x: 0.8, y: 2.4, w: 2.8, h: 0.4,
  fontSize: 13, fontFace: 'Calibri', color: colors.textMuted,
  align: 'center', margin: 0
});

slide4.addText("예스24 IT 모바일\n종합 베스트셀러 전체", {
  x: 0.8, y: 3.0, w: 2.8, h: 0.8,
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  align: 'center', margin: 0, lineSpacingMultiple: 1.3
});

// 카드 2
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 3.6, y: 1.5, w: 2.8, h: 3.5,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide4.addText("60%+", {
  x: 3.6, y: 1.7, w: 2.8, h: 0.8,
  fontSize: 42, fontFace: 'Georgia', color: colors.accent,
  bold: true, align: 'center', margin: 0
});

slide4.addText("AI 관련 도서", {
  x: 3.6, y: 2.4, w: 2.8, h: 0.4,
  fontSize: 13, fontFace: 'Calibri', color: colors.textMuted,
  align: 'center', margin: 0
});

slide4.addText("생성형 AI, 바이브 코딩,\n에이전트 개발 등", {
  x: 3.6, y: 3.0, w: 2.8, h: 0.8,
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  align: 'center', margin: 0, lineSpacingMultiple: 1.3
});

// 카드 3
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 6.4, y: 1.5, w: 2.8, h: 3.5,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide4.addText("1위~5위", {
  x: 6.4, y: 1.7, w: 2.8, h: 0.8,
  fontSize: 42, fontFace: 'Georgia', color: colors.accent,
  bold: true, align: 'center', margin: 0
});

slide4.addText("AI 도서 독식", {
  x: 6.4, y: 2.4, w: 2.8, h: 0.4,
  fontSize: 13, fontFace: 'Calibri', color: colors.textMuted,
  align: 'center', margin: 0
});

slide4.addText("클로드, 챗GPT, 제미나이\n관련 도서가 상위권", {
  x: 6.4, y: 3.0, w: 2.8, h: 0.8,
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  align: 'center', margin: 0, lineSpacingMultiple: 1.3
});

slide4.addNotes("시장 동향을 살펴보면, 분석 대상 248권 중 60% 이상이 AI 관련 도서입니다. 특히 상위 5권 모두 클로드, 챗GPT, 제미나이 같은 특정 AI 도구를 다루는 도서들로 채워져 있습니다. 이는 시장이 AI 도서로 포화 상태임을 보여주며, 동시에 차별화된 접근이 필요함을 시사합니다.");

// ============================================
// 슬라이드 5: 상위 베스트셀러
// ============================================
let slide5 = pres.addSlide();
slide5.background = { color: colors.offWhite };

slide5.addText("03. 상위 베스트셀러 분석", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 테이블
const topBooks = [
  ['순위', '도서명', '저자', '출판사', '출간일'],
  ['1', '바로바로 클로드 with 코워크, 스킬, 클로드 코드', '차진우', '골든래빗', '2026.05'],
  ['2', '혼자 공부하는 바이브 코딩 with 클로드 코드', '조태호', '한빛미디어', '2025.12'],
  ['3', '뚝딱 바로 써먹는 AI 3대장 챗GPT·제미나이·클로드', '코리아교육그룹', '안경다리BOOKS', '2026.06'],
  ['4', '이게 되네? 제미나이 완전 미친 활용법 81제', '오힘찬', '골든래빗', '2026.02'],
  ['5', '요즘 교사를 위한 에듀테크 5대장', '안익재', '앤써북', '2025.12']
];

slide5.addTable(topBooks, {
  x: 0.8, y: 1.4, w: 8.4,
  colW: [0.6, 3.8, 1.2, 1.4, 1.0],
  border: { pt: 0.5, color: colors.line },
  rowH: [0.4, 0.5, 0.5, 0.5, 0.5, 0.5],
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  autoPage: false
});

// 헤더 스타일
topBooks[0].forEach((_, i) => {
  // 헤더는 자동 스타일링 안됨 - 테이블 옵션으로 처리
});

slide5.addNotes("상위 5권의 베스트셀러를 살펴보면, 1위는 클로드 관련 종합 도서, 2위는 바이브 코딩, 3위는 AI 3대 도구 비교, 4위는 제미나이 활용법, 5위는 교육 분야 에듀테크입니다. 공통적으로 특정 AI 도구의 활용법을 다루고 있으며, 실습 중심의 구성이 인기 요인으로 보입니다.");

// ============================================
// 슬라이드 6: 카테고리 분석
// ============================================
let slide6 = pres.addSlide();
slide6.background = { color: colors.offWhite };

slide6.addText("04. 카테고리별 분석", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 도넛 차트
slide6.addChart(pres.charts.DOUGHNUT, [{
  name: '카테고리',
  labels: ['AI/생성형AI', '바이브코딩', '교육/에듀테크', '프로그래밍', '디자인/영상', '기타'],
  values: [35, 25, 15, 12, 8, 5]
}], {
  x: 0.8, y: 1.3, w: 4.5, h: 3.8,
  showPercent: true,
  showTitle: false,
  showLegend: true,
  legendPos: 'b',
  legendFontSize: 10,
  chartColors: [colors.darkNavy, colors.softBlue, '85C1E9', 'AED6F1', 'D4E6F1', 'EBF5FB'],
  dataLabelColor: colors.textDark,
  dataLabelFontSize: 10
});

// 우측 설명
slide6.addShape(pres.shapes.RECTANGLE, {
  x: 5.6, y: 1.3, w: 3.8, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide6.addText("주요 발견", {
  x: 5.9, y: 1.5, w: 3.2, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide6.addText([
  { text: "AI/생성형AI가 전체의 35%로 최대 비중", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "바이브 코딩이 25%로 빠르게 성장 중", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "교육 분야가 15%로 꾸준한 수요", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "기존 프로그래밍 도서는 12%로 감소 추세", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "디자인/영상 분야는 8%로 소규모이나", options: { breakLine: true } },
  { text: "성장 가능성 있음", options: {} }
], {
  x: 5.9, y: 2.0, w: 3.2, h: 2.8,
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.3
});

slide6.addNotes("카테고리별 분석 결과, AI와 생성형 AI 관련 도서가 전체의 35%로 가장 큰 비중을 차지합니다. 바이브 코딩이 25%로 빠르게 성장하고 있으며, 교육 분야도 15%로 꾸준한 수요가 있습니다. 기존 프로그래밍 도서는 상대적으로 감소 추세입니다.");

// ============================================
// 슬라이드 7: AI/바이브코딩 트렌드
// ============================================
let slide7 = pres.addSlide();
slide7.background = { color: colors.offWhite };

slide7.addText("05. AI/바이브코딩 트렌드", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 핵심 키워드 카드들
const keywords = [
  { title: '클로드 코드', count: '15권+', color: colors.darkNavy },
  { title: '바이브 코딩', count: '20권+', color: colors.softBlue },
  { title: '제미나이', count: '12권+', color: '85C1E9' },
  { title: '챗GPT', count: '10권+', color: 'AED6F1' }
];

keywords.forEach((kw, i) => {
  const x = 0.8 + (i * 2.2);
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.4, w: 2.0, h: 1.6,
    fill: { color: kw.color }, shadow: makeShadow()
  });
  slide7.addText(kw.title, {
    x: x, y: 1.6, w: 2.0, h: 0.6,
    fontSize: 14, fontFace: 'Calibri', color: colors.white,
    bold: true, align: 'center', margin: 0
  });
  slide7.addText(kw.count, {
    x: x, y: 2.2, w: 2.0, h: 0.5,
    fontSize: 20, fontFace: 'Georgia', color: colors.white,
    bold: true, align: 'center', margin: 0
  });
});

// 하단 인사이트
slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.3, w: 8.4, h: 2.0,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide7.addText("핵심 인사이트", {
  x: 1.1, y: 3.5, w: 7.8, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide7.addText([
  { text: "특정 도구 활용법보다 AI와 함께 일하는 방법론에 대한 수요가 증가", options: { breakLine: true } },
  { text: "'하네스 엔지니어링', '에이전트 실행' 같은 새로운 개념의 도서 등장", options: { breakLine: true } },
  { text: "교육 현장에서의 AI 활용을 다루는 도서가 빠르게 증가", options: { breakLine: true } },
  { text: "실전 사례와 프로젝트 기반 학습을 강조하는 경향 강화", options: {} }
], {
  x: 1.1, y: 3.9, w: 7.8, h: 1.3,
  fontSize: 12, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.5
});

slide7.addNotes("AI와 바이브코딩 트렌드를 살펴보면, 클로드 코드가 15권 이상, 바이브 코딩이 20권 이상 출간되어 있습니다. 핵심 인사이트는 단순한 도구 활용법보다 AI와 함께 일하는 방법론에 대한 수요가 증가하고 있다는 점입니다. 하네스 엔지니어링, 에이전트 실행 같은 새로운 개념의 도서도 등장하고 있습니다.");

// ============================================
// 슬라이드 8: 교육 분야
// ============================================
let slide8 = pres.addSlide();
slide8.background = { color: colors.offWhite };

slide8.addText("06. 교육 분야 AI 도서", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 교육 도서 목록
const eduBooks = [
  { rank: '5', title: '요즘 교사를 위한 에듀테크 5대장', publisher: '앤써북' },
  { rank: '10', title: '요즘 교사를 위한 AI 바이브 코딩 활용 가이드', publisher: '한빛미디어' },
  { rank: '13', title: '바쁜 교사를 위한 바로 쓰는 AI', publisher: '사회평론아카데미' },
  { rank: '15', title: '요즘 교사를 위한 AI 수업 활용 가이드', publisher: '한빛미디어' },
  { rank: '21', title: '교사를 위한 AI 에듀테크 수업·생활·업무 대백과', publisher: '프리렉' }
];

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.3, w: 8.4, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

eduBooks.forEach((book, i) => {
  const y = 1.5 + (i * 0.7);
  
  // 순위 배지
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 1.1, y: y, w: 0.5, h: 0.5,
    fill: { color: colors.softBlue }
  });
  slide8.addText(book.rank, {
    x: 1.1, y: y, w: 0.5, h: 0.5,
    fontSize: 12, fontFace: 'Calibri', color: colors.white,
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
  
  slide8.addText(book.title, {
    x: 1.8, y: y, w: 5.5, h: 0.5,
    fontSize: 13, fontFace: 'Calibri', color: colors.textDark,
    align: 'left', valign: 'middle', margin: 0
  });
  
  slide8.addText(book.publisher, {
    x: 7.5, y: y, w: 1.5, h: 0.5,
    fontSize: 11, fontFace: 'Calibri', color: colors.textMuted,
    align: 'right', valign: 'middle', margin: 0
  });
  
  if (i < eduBooks.length - 1) {
    slide8.addShape(pres.shapes.LINE, {
      x: 1.1, y: y + 0.6, w: 7.9, h: 0,
      line: { color: colors.line, width: 0.5 }
    });
  }
});

slide8.addNotes("교육 분야 AI 도서를 살펴보면, 상위 30권 안에 5권이 포함되어 있습니다. 교사들을 위한 에듀테크, AI 활용법, 수업 설계 같은 주제가 인기입니다. 2022 개정 교육과정과 연계된 도서가 많으며, 실습 중심의 구성이 특징입니다.");

// ============================================
// 슬라이드 9: 경쟁 분석
// ============================================
let slide9 = pres.addSlide();
slide9.background = { color: colors.offWhite };

slide9.addText("07. 경쟁 도서 분석", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 강점/약점 분석
slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.4, w: 4.2, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide9.addText("기존 도서의 강점", {
  x: 1.1, y: 1.6, w: 3.6, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: '27AE60',
  bold: true, align: 'left', margin: 0
});

slide9.addText([
  { text: "실습 중심의 구성과 단계별 가이드", options: { breakLine: true } },
  { text: "특정 도구에 대한 깊이 있는 다룸", options: { breakLine: true } },
  { text: "최신 트렌드를 빠르게 반영", options: { breakLine: true } },
  { text: "교육 현장과의 연계성", options: { breakLine: true } },
  { text: "저자의 실무 경험 기반 콘텐츠", options: {} }
], {
  x: 1.1, y: 2.1, w: 3.6, h: 2.8,
  fontSize: 12, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.6
});

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.4, w: 4.2, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide9.addText("기존 도서의 약점", {
  x: 5.5, y: 1.6, w: 3.6, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: 'E74C3C',
  bold: true, align: 'left', margin: 0
});

slide9.addText([
  { text: "도구별 분산으로 통합적 이해 부족", options: { breakLine: true } },
  { text: "이론과 실무의 괴리", options: { breakLine: true } },
  { text: "비전공자에게는 진입장벽 높음", options: { breakLine: true } },
  { text: "반복되는 콘텐츠로 차별화 어려움", options: { breakLine: true } },
  { text: "실제 프로젝트 연결 사례 부족", options: {} }
], {
  x: 5.5, y: 2.1, w: 3.6, h: 2.8,
  fontSize: 12, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.6
});

slide9.addNotes("경쟁 도서 분석 결과, 기존 도서들은 실습 중심 구성과 빠른 트렌드 반영이 강점입니다. 그러나 도구별로 분산되어 있어 통합적 이해가 어렵고, 비전공자에게는 진입장벽이 높습니다. 반복되는 콘텐츠로 차별화도 어렵습니다. 이는 우리에게 기회가 될 수 있습니다.");

// ============================================
// 슬라이드 10: 타겟 독자
// ============================================
let slide10 = pres.addSlide();
slide10.background = { color: colors.offWhite };

slide10.addText("08. 타겟 독자 분석", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

const targets = [
  { title: '직장인', desc: 'AI를 활용한 업무 생산성 향상을 원하는\n20~40대 사무직 종사자', pct: '40%' },
  { title: '개발자', desc: '새로운 AI 도구와 워크플로우를\n학습하려는 주니어~미드레벨 개발자', pct: '25%' },
  { title: '교육자', desc: 'AI를 수업과 업무에 적용하려는\n현직 교사 및 교육 관련 종사자', pct: '20%' },
  { title: '일반인', desc: 'AI에 대한 이해를 넓히고\n실생활에 활용하고 싶은 일반 독자', pct: '15%' }
];

targets.forEach((t, i) => {
  const y = 1.4 + (i * 1.0);
  
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: y, w: 8.4, h: 0.85,
    fill: { color: colors.card }, shadow: makeShadow()
  });
  
  // 왼쪽 악센트 바
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: y, w: 0.06, h: 0.85,
    fill: { color: colors.softBlue }
  });
  
  slide10.addText(t.title, {
    x: 1.1, y: y, w: 1.5, h: 0.85,
    fontSize: 14, fontFace: 'Calibri', color: colors.darkNavy,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
  
  slide10.addText(t.desc, {
    x: 2.6, y: y, w: 4.5, h: 0.85,
    fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
    align: 'left', valign: 'middle', margin: 0, lineSpacingMultiple: 1.3
  });
  
  slide10.addText(t.pct, {
    x: 7.5, y: y, w: 1.5, h: 0.85,
    fontSize: 22, fontFace: 'Georgia', color: colors.accent,
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
});

slide10.addNotes("타겟 독자는 크게 4개 군으로 나눌 수 있습니다. 직장인이 40%로 가장 큰 비중을 차지하며, 그 다음으로 개발자 25%, 교육자 20%, 일반인 15%입니다. 특히 직장인과 개발자 그룹이 핵심 타겟으로, 실무에 바로 적용할 수 있는 콘텐츠를 선호합니다.");

// ============================================
// 슬라이드 11: 기획 컨셉
// ============================================
let slide11 = pres.addSlide();
slide11.background = { color: colors.darkNavy };

slide11.addText("09. 신규 도서 기획 컨셉", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.white,
  bold: true, align: 'left', margin: 0
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 메인 컨셉
slide11.addText("AI와 함께 일하는\n새로운 워크플로우", {
  x: 0.8, y: 1.4, w: 8.4, h: 1.2,
  fontSize: 32, fontFace: 'Georgia', color: colors.white,
  bold: true, align: 'center', margin: 0, lineSpacingMultiple: 1.2
});

slide11.addText("도구가 아닌, 사고방식의 변화", {
  x: 0.8, y: 2.7, w: 8.4, h: 0.6,
  fontSize: 16, fontFace: 'Calibri', color: colors.lightBlue,
  align: 'center', margin: 0
});

// 핵심 가치 카드
const values = [
  { icon: '01', title: '통합적 접근', desc: '여러 AI 도구를\n하나의 워크플로우로\n통합하는 방법' },
  { icon: '02', title: '실전 사례', desc: '실제 프로젝트를\n통한 학습으로\n즉시 적용 가능' },
  { icon: '03', title: '사고방식 전환', desc: 'AI를 도구가 아닌\n파트너로 대하는\n새로운 관점' }
];

values.forEach((v, i) => {
  const x = 0.8 + (i * 3.0);
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 3.5, w: 2.8, h: 1.8,
    fill: { color: colors.softBlue }, shadow: makeShadow()
  });
  slide11.addText(v.icon, {
    x: x, y: 3.6, w: 2.8, h: 0.5,
    fontSize: 24, fontFace: 'Georgia', color: colors.white,
    bold: true, align: 'center', margin: 0
  });
  slide11.addText(v.title, {
    x: x, y: 4.1, w: 2.8, h: 0.4,
    fontSize: 13, fontFace: 'Calibri', color: colors.white,
    bold: true, align: 'center', margin: 0
  });
  slide11.addText(v.desc, {
    x: x, y: 4.5, w: 2.8, h: 0.7,
    fontSize: 10, fontFace: 'Calibri', color: colors.lightBlue,
    align: 'center', margin: 0, lineSpacingMultiple: 1.3
  });
});

slide11.addNotes("기획 컨셉은 'AI와 함께 일하는 새로운 워크플로우'입니다. 단순한 도구 활용법이 아닌, AI를 파트너로 대하는 사고방식의 변화를 강조합니다. 핵심 가치로는 통합적 접근, 실전 사례, 사고방식 전환 3가지를 설정했습니다.");

// ============================================
// 슬라이드 12: 도서 상세 기획
// ============================================
let slide12 = pres.addSlide();
slide12.background = { color: colors.offWhite };

slide12.addText("10. 도서 상세 기획", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide12.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 도서 정보 카드
slide12.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.4, w: 5.5, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide12.addText("도서 정보", {
  x: 1.1, y: 1.6, w: 4.8, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide12.addText([
  { text: "제목: AI와 함께 일하는 실전 워크플로우", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "부제: 클로드, GPT, 제미나이를 넘나드는", options: { breakLine: true } },
  { text: "       통합 AI 활용 가이드", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "대상: 직장인, 개발자, 교육자", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "분량: 약 350페이지", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "가격: 28,000원 (정가 32,000원)", options: { breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "출간 목표: 2027년 1분기", options: {} }
], {
  x: 1.1, y: 2.1, w: 4.8, h: 2.8,
  fontSize: 12, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.3
});

// 구성안
slide12.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 1.4, w: 2.9, h: 3.8,
  fill: { color: colors.card }, shadow: makeShadow()
});

slide12.addText("목차 구성", {
  x: 6.7, y: 1.6, w: 2.5, h: 0.4,
  fontSize: 14, fontFace: 'Calibri', color: colors.accent,
  bold: true, align: 'left', margin: 0
});

slide12.addText([
  { text: "1장 AI 파트너십의 이해", options: { breakLine: true } },
  { text: "2장 각 도구의 강점 파악", options: { breakLine: true } },
  { text: "3장 통합 워크플로우 설계", options: { breakLine: true } },
  { text: "4장 실전 프로젝트 1", options: { breakLine: true } },
  { text: "5장 실전 프로젝트 2", options: { breakLine: true } },
  { text: "6장 팀 협업과 자동화", options: { breakLine: true } },
  { text: "7장 생산성 극대화", options: { breakLine: true } },
  { text: "8장 미래 전망", options: {} }
], {
  x: 6.7, y: 2.1, w: 2.5, h: 2.8,
  fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
  align: 'left', margin: 0, lineSpacingMultiple: 1.5
});

slide12.addNotes("도서 상세 기획을 설명드리겠습니다. 제목은 'AI와 함께 일하는 실전 워크플로우'로, 여러 AI 도구를 하나의 워크플로우로 통합하는 방법을 다룹니다. 약 350페이지 분량으로, 8개 장으로 구성하여 이론부터 실전까지 체계적으로 학습할 수 있게 했습니다.");

// ============================================
// 슬라이드 13: 마케팅 전략
// ============================================
let slide13 = pres.addSlide();
slide13.background = { color: colors.offWhite };

slide13.addText("11. 마케팅 전략", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide13.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

const strategies = [
  { phase: '사전 마케팅', period: '출간 2개월 전', items: ['저자 인터뷰 및 칼럼 연재', 'SNS 사전 홍보 캠페인', '독자 사전 주문 이벤트'] },
  { phase: '출간 마케팅', period: '출간 전후 1개월', items: ['온라인 서점 프로모션', '유튜브/팟캐스트 인터뷰', '온라인 세미나 웨비나'] },
  { phase: '사후 마케팅', period: '출간 후 지속', items: ['독자 리뷰 관리', '강의/워크숍 연계', '개정판 검토'] }
];

strategies.forEach((s, i) => {
  const x = 0.8 + (i * 3.0);
  slide13.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.4, w: 2.8, h: 3.8,
    fill: { color: colors.card }, shadow: makeShadow()
  });
  
  slide13.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.4, w: 2.8, h: 0.6,
    fill: { color: colors.softBlue }
  });
  
  slide13.addText(s.phase, {
    x: x, y: 1.4, w: 2.8, h: 0.35,
    fontSize: 13, fontFace: 'Calibri', color: colors.white,
    bold: true, align: 'center', margin: 0
  });
  
  slide13.addText(s.period, {
    x: x, y: 1.75, w: 2.8, h: 0.25,
    fontSize: 10, fontFace: 'Calibri', color: colors.lightBlue,
    align: 'center', margin: 0
  });
  
  slide13.addText(
    s.items.map((item, j) => ({
      text: item,
      options: j < s.items.length - 1 ? { breakLine: true } : {}
    })),
    {
      x: x + 0.2, y: 2.2, w: 2.4, h: 2.8,
      fontSize: 11, fontFace: 'Calibri', color: colors.textDark,
      align: 'left', margin: 0, lineSpacingMultiple: 1.8
    }
  );
});

slide13.addNotes("마케팅 전략은 3단계로 구성됩니다. 사전 마케팅으로 저자 칼럼 연재와 SNS 홍보를 진행하고, 출간 전후로 온라인 서점 프로모션과 미디어 인터뷰를 집중합니다. 사후에는 독자 리뷰 관리와 강의 연계를 통해 지속적인 홍보를 진행합니다.");

// ============================================
// 슬라이드 14: 일정 로드맵
// ============================================
let slide14 = pres.addSlide();
slide14.background = { color: colors.offWhite };

slide14.addText("12. 일정 및 로드맵", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 26, fontFace: 'Georgia', color: colors.darkNavy,
  bold: true, align: 'left', margin: 0
});

slide14.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: colors.softBlue }
});

// 타임라인
const timeline = [
  { month: '8월', task: '기획 확정 및 저자 섭외', status: 'active' },
  { month: '9~10월', task: '원고 집필 (1~4장)', status: 'pending' },
  { month: '11~12월', task: '원고 집필 (5~8장)', status: 'pending' },
  { month: '1월', task: '편집 및 교정', status: 'pending' },
  { month: '2월', task: '디자인 및 인쇄', status: 'pending' },
  { month: '3월', task: '출간 및 마케팅', status: 'pending' }
];

timeline.forEach((t, i) => {
  const y = 1.5 + (i * 0.65);
  
  // 타임라인 점
  slide14.addShape(pres.shapes.OVAL, {
    x: 1.5, y: y + 0.15, w: 0.2, h: 0.2,
    fill: { color: t.status === 'active' ? colors.accent : colors.softBlue }
  });
  
  // 타임라인 라인
  if (i < timeline.length - 1) {
    slide14.addShape(pres.shapes.LINE, {
      x: 1.6, y: y + 0.35, w: 0, h: 0.45,
      line: { color: colors.line, width: 1.5 }
    });
  }
  
  slide14.addText(t.month, {
    x: 2.0, y: y, w: 1.5, h: 0.5,
    fontSize: 13, fontFace: 'Calibri', color: colors.darkNavy,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
  
  slide14.addText(t.task, {
    x: 3.5, y: y, w: 5, h: 0.5,
    fontSize: 12, fontFace: 'Calibri', color: colors.textDark,
    align: 'left', valign: 'middle', margin: 0
  });
});

slide14.addNotes("일정 로드맵을 설명드리겠습니다. 8월에 기획 확정과 저자 섭외를 시작으로, 9월부터 12월까지 원고 집필을 진행합니다. 1월에 편집과 교정을 거쳐 2월에 디자인과 인쇄를 진행하고, 3월에 출간과 마케팅을 진행할 계획입니다.");

// ============================================
// 슬라이드 15: 마무리
// ============================================
let slide15 = pres.addSlide();
slide15.background = { color: colors.darkNavy };

// 상단 장식 라인
slide15.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.04, fill: { color: colors.softBlue }
});

slide15.addText("감사합니다", {
  x: 0.8, y: 1.5, w: 8.4, h: 1.0,
  fontSize: 40, fontFace: 'Georgia', color: colors.white,
  bold: true, align: 'center', margin: 0
});

slide15.addText("AI와 함께 일하는 새로운 워크플로우", {
  x: 0.8, y: 2.8, w: 8.4, h: 0.6,
  fontSize: 18, fontFace: 'Calibri', color: colors.lightBlue,
  align: 'center', margin: 0
});

slide15.addText("문의: ABC-RAG Team", {
  x: 0.8, y: 4.0, w: 8.4, h: 0.5,
  fontSize: 14, fontFace: 'Calibri', color: colors.textMuted,
  align: 'center', margin: 0
});

// 하단 장식 라인
slide15.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.585, w: 10, h: 0.04, fill: { color: colors.softBlue }
});

slide15.addNotes("경청해 주셔서 감사합니다. 오늘 제안드린 'AI와 함께 일하는 실전 워크플로우' 도서가 시장에서 성공할 수 있도록 최선을 다하겠습니다. 추가 문의 사항이 있으시면 언제든 연락해 주세요.");

// 파일 저장
pres.writeFile({ fileName: "AI시대_도서기획_제안서.pptx" })
  .then(() => console.log("PPTX 파일이 생성되었습니다: AI시대_도서기획_제안서.pptx"))
  .catch(err => console.error("오류:", err));
