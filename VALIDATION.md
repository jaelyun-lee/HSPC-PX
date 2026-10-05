# 검증 결과

## 완료

- Node.js 계산 테스트 통과: Appendix A1 4개 사례, 결측/음수/비수치/범위 밖 입력 거부, 위험 변수 변화에 따른 점수 및 생존율 방향, 시간 증가에 따른 생존율 감소, 그림 좌표의 순서 및 단조성, 그림에서 판독한 생존율 기준점.
- 총점 대조: 발표 118 → 118.353; 166 → 166.104; 167 → 166.833; 209 → 208.775. 최대 절대 차이 0.354점.
- 첫 Appendix 사례는 Hb 17.7로 그림 범위 밖이므로 앱에서 거부합니다. 범위를 무시한 수학적 연장은 104.906점(발표 104점)이나 앱 예측에는 사용하지 않습니다.
- 166점 예시: 18개월 약 64%, 24개월 약 47%, 30개월 약 34%, 36개월 약 22%, 48개월 약 12%. Figure 2 곡선과의 시각적 대조로 합리적 위치 확인.
- Android manifest와 빌드 설정 파일 구조 확인. 앱에는 INTERNET 권한이 없으며 JavaScript native bridge가 없습니다.

## 미완료

- Android SDK 및 Gradle이 없어 APK 빌드/설치/Android WebView 실기기 검증 미수행.
- Playwright UI 테스트를 제공했으나 현재 환경에 Chromium 실행 파일이 없어 실행 미완료. 화면의 실제 렌더링 검증은 완료했다고 주장하지 않습니다.
- GitHub Actions 빌드 workflow 실행 미수행.
- 원 Duke 계산기의 정밀 계수·기저생존함수 대조 미완료.
- 독립 환자 자료를 이용한 임상 검증 미수행. 본 구현 검증은 임상 타당도 검증과 다릅니다.

UI 테스트 실행: 프로젝트 루트에서 `npm install --no-save playwright`, `npx playwright install chromium`, `node tests/ui.test.cjs`. 스크린샷은 프로젝트 상위 output 폴더에 생성됩니다.

곡선 재추출: PyMuPDF 설치 후 `python tools/extract_figure.py <첨부PDF경로>`. 추출 도구는 이 첨부판의 페이지 및 벡터 구조에 맞춘 것으로 다른 PDF에 재사용하면 안 됩니다.
