# 명절세트 배송관리 프론트엔드

대형마트 명절세트(선물세트) 주문/배송 관리를 위한 내부 운영 화면.

## 스택

- React 19 + TypeScript + Vite
- 상태관리: [Zustand](https://github.com/pmndrs/zustand) — 서버 데이터는 다루지 않고 UI/세션 상태만 관리
- 서버 데이터: [TanStack Query](https://tanstack.com/query) — API 호출, 캐싱, 로딩/에러 상태
- UI: [MUI](https://mui.com/)
- 라우팅: react-router-dom
- 검증: zod (폼/응답 스키마 검증에 사용)
- Lint/Format: ESLint(flat config) + Prettier

## 폴더 구조

```
src/
  api/            axios 인스턴스, react-query key 팩토리
  app/            App 루트, 라우터, queryClient 등 앱 단위 설정
  components/     여러 feature가 공유하는 컴포넌트(레이아웃, 가드 등)
  features/       도메인별 모듈 (customers / orders / delivery / auth)
    <feature>/
      api.ts              axios 호출 함수
      hooks/              react-query 훅
      components/         해당 도메인 전용 컴포넌트
      pages/               라우트에 매핑되는 페이지 컴포넌트
  store/          zustand 스토어
  theme/          MUI 테마
  types/          도메인 타입
  utils/          공용 유틸(마스킹 등)
```

한 파일이 급격히 길어지면(대략 100줄 내외 초과) 책임을 쪼개는 것을 기준으로 삼았다.
다만 억지로 잘게 쪼개진 않았다.

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
   실제 권한 검증은 서버 API가 매번 다시 수행한다는 전제로 설계했다.

7. **개인정보를 URL 쿼리스트링에 담지 않는다.**
   검색 등은 body/params로 전달하고, 브라우저 히스토리·서버 접근 로그·프록시 로그에
   원문이 남을 수 있는 경로는 피한다.

> 위 항목 중 마스킹/감사 로그/세션 검증은 **서버가 실제로 구현해야** 의미가 있다.
> 프론트는 그 계약을 깨지 않도록(원본을 함부로 캐싱·재노출하지 않도록) 설계된 상태다.

## 목업 API (백엔드 없이 화면 확인용)

아직 실제 백엔드가 없어서 `npm run dev`로 켜면 [MSW](https://mswjs.io/)가 브라우저에서
API 요청을 가로채 가짜 데이터를 돌려준다(`src/mocks/`). **`npm run build` 결과물에는
포함되지 않는다** — `main.tsx`에서 `import.meta.env.DEV`일 때만 동적으로 불러온다.

- 로그인 화면 하단에 목업 계정(`admin` / `1234`)이 안내되어 있다 — [testAccount.ts](src/mocks/testAccount.ts)
- 고객 47명 / 주문 63건을 규칙적으로 생성해서 목록·페이지네이션·검색을 확인할 수 있다
  ([mocks/data](src/mocks/data))
- "원본 정보 보기" 클릭 → 사유 입력 → 확인하면 실제로 마스킹 해제 API가 호출되고
  브라우저 콘솔에 `[mock audit log] ...` 로그가 남는 것까지 재현된다
- 실제 백엔드가 준비되면 `src/mocks` 폴더와 `main.tsx`의 `enableMocking` 호출을 지우고
  각 feature의 `api.ts`를 실제 엔드포인트에 맞게 조정하면 된다

## 스크립트

```bash
npm run dev       # 개발 서버
npm run build      # 타입체크 + 빌드
npm run lint       # ESLint
npm run format     # Prettier
```

## 환경변수

`.env.example`을 복사해 `.env`로 사용한다. `.env`는 `.gitignore`에 포함되어 있다.

```
VITE_API_BASE_URL=https://api.example.com
```
