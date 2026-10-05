# mCRPC Nomogram — Android 연구용 프로토타입

변수 8개를 입력하면 Halabi 2014 Figure 2의 근사 점수 및 18/24/30/36/48개월 전체생존 확률을 표시합니다. Android 8.0(API 26) 이상. Java Activity + 번들 HTML/JavaScript를 사용하는 오프라인 Android 앱입니다.

## 현재 제공 상태

- Android 소스 프로젝트, 계산 엔진, 한국어 입력 화면, 결과 차트, 검증 테스트, APK 빌드 workflow 제공.
- 이 환경에는 Android SDK/JDK compiler/Gradle이 없어 **APK를 빌드하거나 실제 Android 기기에서 실행하지 못했습니다**.
- 계산 엔진과 브라우저 화면 검증 결과는 VALIDATION.md 참조.
- 정밀 원 모델을 재현한 임상 검증 앱이 아니라 **노모그램 그림 기반 연구용 근사 도구**입니다.

## 화면 먼저 확인

동봉한 `mCRPC_Nomogram_Preview.html`을 브라우저로 열면 동일 계산 화면이 실행됩니다. 이 파일은 APK가 아닙니다. 또는 `app/src/main/assets/index.html`을 엽니다.

## Android Studio에서 APK 만들기

필요: JDK 17, Android SDK Platform 35, Build Tools 35.0.0, Gradle 8.9. 플러그인과 빌드 도구의 첫 다운로드에는 인터넷이 필요합니다.

1. ZIP을 해제합니다.
2. Gradle 8.9가 설치된 터미널에서 프로젝트 루트에서 `gradle wrapper --gradle-version 8.9`를 실행합니다. 이 저장소에는 wrapper JAR가 포함되어 있지 않습니다.
3. Android Studio에서 프로젝트 폴더를 엽니다. Gradle JDK를 17로 지정하고 Sync합니다.
4. 필요하면 SDK Manager에서 API 35와 Build Tools 35.0.0을 설치합니다.
5. 메뉴에서 APK 빌드 또는 터미널에서 `./gradlew :app:assembleDebug`를 실행합니다. Windows: `gradlew.bat :app:assembleDebug`.
6. 생성 위치: `app/build/outputs/apk/debug/app-debug.apk`. Android 기기에 복사해 설치하거나 `adb install -r app/build/outputs/apk/debug/app-debug.apk`를 사용합니다.

Debug APK는 테스트용 자동 서명을 사용합니다. 배포용 release 서명 키나 Play Store 게시는 포함되어 있지 않습니다.

## GitHub에서 빌드

프로젝트 내용(루트에 settings.gradle과 .github 폴더가 오도록)을 본인의 GitHub 저장소에 올린 후 Actions의 `Build research APK`를 실행합니다. 완료되면 `mCRPC-Nomogram-research-APK` artifact를 다운로드하여 APK를 꺼냅니다. 이 workflow는 제공된 설정이며, 여기서 실행하거나 검증하지 않았습니다.

## 계산 검증

`node tests/model.test.js`

논문 Table A1의 그림 범위 내 4개 사례: 계산 총점과 발표 정수 점수 차이 모두 0.4점 미만. 첫 사례는 Hb 17.7로 그림 축 범위(7–17) 밖이므로 앱에서 거부합니다. 그림과 대조한 구현 검증이지 독립 환자 코호트에서의 임상 검증이 아닙니다.

## 수치화 방법

점수축 폭: 218.898987 PDF points. 각 변수의 가로 위치를 이 축에 투영합니다.

| 변수 | 계산 |
|---|---|
| Opioid 사용 | Yes: 26.623/218.898987 × 100 |
| LDH > ULN | Yes: 101.336/218.898987 × 100 |
| 전이 부위 | LN 0; bone 17.630/218.898987 × 100; visceral 88.800/218.898987 × 100 |
| ECOG | ECOG × 184.788/218.898987 × 100 / 2 |
| Albumin | (6−albumin) × 184.759/218.898987 × 100 / 5 |
| Hemoglobin | (17−Hb) × 197.792/218.898987 × 100 / 10 |
| ALP | (ln(ALP)−3.5) × 218.886/218.898987 × 100 / 5 |
| PSA | (ln(PSA)+3) × 54.153/218.898987 × 100 / 12 |

PSA의 0 눈금은 반올림 표기입니다. 실제 로그축의 시작점은 exp(−3) ≈ 0.0498입니다. PSA=0을 임의의 작은 값으로 치환하지 않습니다.

생존곡선은 첨부 PDF 5쪽 Figure 2의 유색 벡터 선분 100개를 추출하여 시점 순서대로 20개씩 분류했습니다. 끝점 좌표를 점수와 확률로 변환하고 선형 보간합니다. 정수 %와 ≈ 기호로 표시합니다. 공통 추출 범위 56.6–380.9점 밖으로 외삽하지 않으며 개인별 신뢰구간 및 중앙생존기간은 산출하지 않습니다.

입력 범위는 그림의 축 범위입니다. 예측값은 치료 시작 시점 예후의 근사값이며 현재부터의 잔여 생존기간이나 특정 치료의 인과적 효과를 의미하지 않습니다.

## プライバシー

인터넷 권한·서버·추적 도구·환자 식별 항목·영구 저장·JavaScript bridge가 없습니다. 입력값은 화면 메모리에서만 유지되며 변경 시 이전 결과를 숨깁니다.

## 根拠

Halabi S et al. Updated Prognostic Model for Predicting Overall Survival in First-Line Chemotherapy for Patients With Metastatic Castration-Resistant Prostate Cancer. J Clin Oncol. 2014;32:671–677. DOI 10.1200/JCO.2013.52.3696.

정오표 DOI 10.1200/JCO.2014.56.5366. LDH 기준은 >1×ULN입니다. 원본 그림과 첨부 PDF는 포함하지 않았습니다.

모델은 1차 docetaxel 치료 mCRPC에서 개발·검증되었습니다. mHSPC·후속 치료·현대 치료 순서에 대한 적용은 검증되지 않았습니다. 정식 사용 전 원 계산기의 정밀 계수·기저생존함수와의 대조, 독립 검증 및 Android 실기기 검증이 필요합니다.
