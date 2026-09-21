import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 개인정보를 담지 않는 화면 설정만 관리한다.
 * 이 스토어만 localStorage에 persist해도 안전하다.
 */
interface UiState {
  sidebarCollapsed: boolean
  tableDensity: 'compact' | 'comfortable'
  toggleSidebar: () => void
  setTableDensity: (density: UiState['tableDensity']) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      tableDensity: 'comfortable',
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTableDensity: (density) => set({ tableDensity: density }),
    }),
    { name: 'delivery-ui-preferences' },
  ),
)
