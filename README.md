# 명절세트 배송관리 프론트엔드

대형마트 명절세트(선물세트) 주문/배송/재고 관리를 위한 내부 운영 화면.

## 스택

- React 19 + TypeScript + Vite
- 상태관리: [Zustand](https://github.com/pmndrs/zustand) — 서버 데이터는 다루지 않고 UI/세션 상태만 관리
- 서버 데이터: [TanStack Query](https://tanstack.com/query) — API 호출, 캐싱, 로딩/에러 상태
- UI: [MUI](https://mui.com/)
- 라우팅: react-router-dom
- 검증: zod (폼/응답 스키마 검증에 사용)
- 테스트: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- Lint/Format: ESLint(flat config) + Prettier

## 폴더 구조

```
src/
  api/            axios 인스턴스, react-query key 팩토리
  app/            App 루트, 라우터, queryClient 등 앱 단위 설정
  components/     여러 feature가 공유하는 컴포넌트(레이아웃, 가드 등)
  features/       도메인별 모듈 (customers / orders / delivery / inventory / auth)
    <feature>/
      api.ts              axios 호출 함수
      hooks/              react-query 훅
      components/         해당 도메인 전용 컴포넌트
      pages/               라우트에 매핑되는 페이지 컴포넌트
  store/          zustand 스토어
  theme/          MUI 테마
  types/          도메인 타입
  utils/          공용 유틸(마스킹 등)
  mocks/          MSW 목업 API (개발용, 프로덕션 빌드 제외)
  test/           테스트 전역 설정(setup.ts)
```

한 파일이 급격히 길어지면(대략 100줄 내외 초과) 책임을 쪼개는 것을 기준으로 삼았다.
다만 억지로 잘게 쪼개진 않았다.

## 화면 구성

| 경로                        | 화면      | 설명                                               |
| --------------------------- | --------- | -------------------------------------------------- |
| `/login`                    | 로그인    | httpOnly 쿠키 세션 로그인                          |
| `/customers`                | 고객 목록 | 검색/페이지네이션, 마스킹된 연락처/주소, 원본 열람 |
| `/customers/:customerId`    | 고객 상세 | 고객 정보 + 해당 고객의 주문 내역                  |
| `/orders`                   | 주문 목록 | 상품/상태/재고부족 표시, 행 클릭 시 상세로 이동    |
| `/orders/:orderId`          | 주문 상세 | 주문 상품 구성, 배송 조회 진입점                   |
| `/orders/:orderId/delivery` | 배송 조회 | 배송 타임라인, 상태 변경(수동/자동 시뮬레이션)     |
| `/inventory`                | 재고 관리 | 상품별 재고 현황, 안전재고 이하 경고, 입출고 조정  |

## 고객 개인정보 처리 원칙

이 시스템은 고객 이름/연락처/주소 등 민감정보를 다루기 때문에, 프론트엔드 설계 단계에서부터
아래 원칙을 지켰다.

1. **기본은 마스킹된 값만 화면에 노출한다.**
   목록/카드 등 일반 화면은 서버가 이미 마스킹해서 내려준 값(`phoneMasked`, `addressMasked`)만
   사용한다. 프론트가 원본을 받아서 화면에서 가리는 방식은 쓰지 않는다(네트워크 탭/개발자도구로
   원본이 그대로 노출되기 때문).

2. **원본 열람은 별도 API + 사유 입력 + 서버 감사 로그가 필수.**
   `POST /customers/:id/reveal` 같은 별도 엔드포인트를 호출해야 원본 값을 받을 수 있고,
   호출 시 열람 사유를 함께 전송해 서버에서 접근 로그를 남긴다([RevealContactButton](src/components/common/RevealContactButton.tsx)).
   고객 목록뿐 아니라 [고객 상세 화면](src/features/customers/pages/CustomerDetailPage.tsx)에서도
   동일하게 동작한다.

3. **원본 값은 어떤 전역 상태에도 저장하지 않는다.**
   - `useMutation` 결과는 컴포넌트 로컬 state로만 흐르고, react-query 캐시(`useQuery`)나
     zustand 스토어에 적재하지 않는다.
   - react-query 캐시 자체도 `persistQueryClient` 등으로 localStorage에 영속화하지 않는다
     ([queryClient.ts](src/app/queryClient.ts)). 탭을 닫으면 메모리 캐시도 함께 사라진다.
   - zustand는 `uiStore`(사이드바 접힘, 테이블 밀도 등 개인정보 없는 화면 설정)만 persist하고,
     `authStore`는 세션 role 정보만 메모리에 두고 persist하지 않는다.

4. **인증은 httpOnly 쿠키 기반 세션.**
   로그인 성공 시 토큰을 응답 바디로 받아 localStorage에 저장하는 방식 대신,
   서버가 `Set-Cookie: httpOnly; Secure`로 세션을 내려주고 axios는 `withCredentials: true`로
   쿠키를 자동 전송한다([httpClient.ts](src/api/httpClient.ts)). XSS가 발생해도 JS에서 토큰을
   직접 훔쳐갈 수 없다.

5. **새로고침/최초 진입 시 항상 서버 세션을 재검증한다.**
   [RequireAuth](src/components/common/RequireAuth.tsx)는 클라이언트에 남아있던 이전 role을
   신뢰하지 않고 `/auth/me`를 다시 호출해 확인한다.

6. **화면 단 권한 분기(RoleGuard)는 UX일 뿐 보안 경계가 아니다.**
   [RoleGuard](src/components/common/RoleGuard.tsx)로 버튼/메뉴 노출을 제어하지만,
   실제 권한 검증은 서버 API가 매번 다시 수행한다는 전제로 설계했다. 배송 상태 변경, 재고 조정
   버튼도 같은 방식으로 `ADMIN`/`DELIVERY_MANAGER`에게만 노출된다.

7. **개인정보를 URL 쿼리스트링에 담지 않는다.**
   검색 등은 body/params로 전달하고, 브라우저 히스토리·서버 접근 로그·프록시 로그에
   원문이 남을 수 있는 경로는 피한다.

> 위 항목 중 마스킹/감사 로그/세션 검증은 **서버가 실제로 구현해야** 의미가 있다.
> 프론트는 그 계약을 깨지 않도록(원본을 함부로 캐싱·재노출하지 않도록) 설계된 상태다.

## 배송 상태 관리

실무에서는 접수확인/포장/발송까지는 내부 시스템(또는 사람)이 처리하고, 발송 이후 배송
상태(집화/이동중/배송완료)는 보통 **택배사 웹훅/API 연동으로 자동 갱신**되며 사람이 직접
누르는 경우는 배송 실패 재처리 같은 예외 상황뿐이다. 이 프로젝트는 그 구조를 그대로 반영했다.

- [DeliveryStatusControls](src/features/delivery/components/DeliveryStatusControls.tsx) —
  `ADMIN`/`DELIVERY_MANAGER`만 보이는 "다음 단계로 진행" / "배송 실패 처리" 버튼. 정상 흐름
  (`READY → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → COMPLETED`)과 실패 가능 상태는
  [statusLabels.ts](src/features/delivery/statusLabels.ts)에 규칙으로 정의돼 있고, 서버(목업)도
  같은 규칙으로 잘못된 전이를 `409`로 거부한다.
- [DeliveryAutoSimulate](src/features/delivery/components/DeliveryAutoSimulate.tsx) — 실제
  택배사 웹훅이 있다면 이렇게 자동으로 넘어갈 것이라는 걸 로컬에서 확인해보는 **개발 전용**
  시뮬레이션(`import.meta.env.DEV`에서만 노출). 일정 간격으로 advance API를 대신 호출해서
  배송완료까지 자동 진행하고, 종료 상태에 도달하면 스스로 멈춘다.

## 재고 관리

- `/inventory`에서 상품별 현재고/안전재고/단가를 확인하고, 안전재고 이하로 떨어진 상품이 있으면
  경고 배너가 뜬다.
- 재고 조정(입고/출고)은 [StockAdjustDialog](src/features/inventory/components/StockAdjustDialog.tsx)에서
  수량과 **사유**를 함께 입력해야 하며, 서버(목업)가 조정 결과를 감사 로그로 남긴다 — 고객 정보
  열람과 같은 원칙이다. 조정 결과 재고가 음수가 되는 요청은 서버가 거부한다
  ([mocks/data/inventory.ts](src/mocks/data/inventory.ts)).
- 안전재고 이하인 상품은 주문 목록/상세 화면에도 경고 아이콘으로 표시된다
  ([useLowStockProductIds](src/features/inventory/hooks/useLowStockProductIds.ts)) — 재고 관리
  화면과 완전히 같은 기준을 공유하므로 두 화면이 서로 다른 판단을 내릴 일이 없다.

## 목업 API (백엔드 없이 화면 확인용)

아직 실제 백엔드가 없어서 `npm run dev`로 켜면 [MSW](https://mswjs.io/)가 브라우저에서
API 요청을 가로채 가짜 데이터를 돌려준다(`src/mocks/`). **`npm run build` 결과물에는
포함되지 않는다** — `main.tsx`에서 `import.meta.env.DEV`일 때만 동적으로 불러온다.

- 로그인 화면 하단에 목업 계정(`admin` / `1234`)이 안내되어 있다 — [testAccount.ts](src/mocks/testAccount.ts)
- 고객 47명 / 주문 63건 / 상품 4종을 규칙적으로 생성해서 목록·페이지네이션·검색을 확인할 수 있다
  ([mocks/data](src/mocks/data))
- "원본 정보 보기" 클릭 → 사유 입력 → 확인하면 실제로 마스킹 해제 API가 호출되고
  브라우저 콘솔에 `[mock audit log] ...` 로그가 남는 것까지 재현된다 (재고 조정도 동일)
- 배송/재고는 매 요청마다 새로 계산하지 않고 **목업 서버 쪽에 상태를 유지하는 메모리 저장소**로
  구현했다 (`Map` 기반) — 실제 배송/재고 상태가 있는 것처럼 동작하지만, 개발 서버를 새로고침하면
  초기 상태로 리셋된다.
- 실제 백엔드가 준비되면 `src/mocks` 폴더와 `main.tsx`의 `enableMocking` 호출을 지우고
  각 feature의 `api.ts`를 실제 엔드포인트에 맞게 조정하면 된다

## 테스트

Vitest + React Testing Library로 구성했다. jsdom 환경, jest-dom 매처는
[src/test/setup.ts](src/test/setup.ts)에서 로드한다. 테스트는 대상 파일 옆에
`*.test.ts(x)`로 같이 둔다 (탐색이 쉬워서).

```bash
npm run test       # watch 모드
npm run test:run   # 1회 실행 (CI용)
```

지금까지 다룬 대상:

- 순수 유틸/로직: [mask.test.ts](src/utils/mask.test.ts),
  [statusLabels.test.ts](src/features/delivery/statusLabels.test.ts)
- 목업 서버의 상태를 갖는 로직: [deliveries.test.ts](src/mocks/data/deliveries.test.ts)
  (배송 상태 전이), [inventory.test.ts](src/mocks/data/inventory.test.ts) (재고 조정),
  [customers.test.ts](src/mocks/data/customers.test.ts) (검색, 마스킹 무결성 검증)
- 컴포넌트: [RoleGuard.test.tsx](src/components/common/RoleGuard.test.tsx) — zustand 스토어
  상태를 직접 세팅해서 렌더링을 검증하는 패턴

배송/재고처럼 상태를 들고 있는 로직은 대부분 `mocks/data/*.ts`에 순수 함수로 분리해뒀기 때문에
MSW 핸들러(HTTP 계층)를 띄우지 않고도 바로 테스트할 수 있다. 다만 이 함수들은 저장소에 들어있는
객체를 그대로(참조로) 반환하므로, 테스트에서 "이전 상태"를 비교할 땐 객체를 들고 있지 말고
원시값(상태 문자열, 배열 길이 등)을 먼저 꺼내둬야 한다 — 안 그러면 이후 변경 함수가 같은
객체를 수정하면서 "이전 값"도 같이 바뀌어버린다.

## 스크립트

```bash
npm run dev        # 개발 서버
npm run build       # 타입체크 + 빌드
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Vitest (watch)
npm run test:run    # Vitest (1회 실행)
```

## 환경변수

`.env.example`을 복사해 `.env`로 사용한다. `.env`는 `.gitignore`에 포함되어 있다.

```
VITE_API_BASE_URL=https://api.example.com
```
