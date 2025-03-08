// src/data/menus.ts
import { ReactNode } from 'react'
import { GetProp, MenuProps } from 'antd'

import {
  LuChartColumnBig,
  LuCircleUser,
  LuGrid2X2,
  LuGrid2X2Check,
  LuHouse,
  LuKeyRound,
  LuLayoutGrid,
  LuLayoutList,
  LuLogOut,
  LuMegaphone,
  LuSettings,
  LuUsers
} from 'react-icons/lu'

// Componentes das Views (placeholders por enquanto)
import HomeView from '@/screens/DashboardScreen/views/Home'
import UsersListView from '@/screens/DashboardScreen/views/UsersList'
import AdsListView from '@/screens/DashboardScreen/views/AdsList'
import AdsApprovalView from '@/screens/DashboardScreen/views/AdsApproval'
import CategoriesManagementView from '@/screens/DashboardScreen/views/CategoriesManagement'
import SportsManagementView from '@/screens/DashboardScreen/views/SportsManagement'
import ConditionsManagementView from '@/screens/DashboardScreen/views/ConditionsManagement'
import ReportsUsersView from '@/screens/DashboardScreen/views/ReportsUsers'
import ReportsAdsView from '@/screens/DashboardScreen/views/ReportsAds'
import SettingsGeneralView from '@/screens/DashboardScreen/views/SettingsGeneral'

// Interface do Menu
export interface IMenu {
  menuId: string
  menuName: string
  menuLegend: string
  menuIcon: ReactNode
  menuView: ReactNode
  menuCategory: string
  menuDisabled?: boolean
  menuHidden?: boolean
}

// Estrutura de Menus Separada por Categorias
export const ADMIN_MENUS: IMenu[] = [
  // Categoria: Principal
  {
    menuId: 'inicio',
    menuName: 'Início',
    menuLegend: 'Visão geral do dashboard',
    menuIcon: <LuHouse />,
    menuView: <HomeView />,
    menuCategory: 'Principal',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Relatórios
  {
    menuId: 'usuarios-relatorios',
    menuName: 'Relatório de Usuários',
    menuLegend: 'Estatísticas e dados de usuários',
    menuIcon: <LuChartColumnBig />,
    menuView: <ReportsUsersView />,
    menuCategory: 'Relatórios',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios-relatorios',
    menuName: 'Relatório de Anúncios',
    menuLegend: 'Estatísticas de anúncios publicados',
    menuIcon: <LuChartColumnBig />,
    menuView: <ReportsAdsView />,
    menuCategory: 'Relatórios',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Dados
  {
    menuId: 'categorias',
    menuName: 'Categorias',
    menuLegend: 'Gerenciar categorias de produtos',
    menuIcon: <LuLayoutGrid />,
    menuView: <CategoriesManagementView />,
    menuCategory: 'Dados',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'esportes',
    menuName: 'Esportes',
    menuLegend: 'Gerenciar lista de esportes disponíveis',
    menuIcon: <LuLayoutList />,
    menuView: <SportsManagementView />,
    menuCategory: 'Dados',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'condicoes',
    menuName: 'Condições',
    menuLegend: 'Gerenciar estados dos produtos',
    menuIcon: <LuLayoutList />,
    menuView: <ConditionsManagementView />,
    menuCategory: 'Dados',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Gerenciamento
  {
    menuId: 'usuarios',
    menuName: 'Usuários',
    menuLegend: 'Gerenciar usuários da plataforma',
    menuIcon: <LuUsers />,
    menuView: <UsersListView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios',
    menuName: 'Anúncios',
    menuLegend: 'Listagem de todos os anúncios',
    menuIcon: <LuGrid2X2 />,
    menuView: <AdsListView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios-aprovacao',
    menuName: 'Aprovação de Anúncios',
    menuLegend: 'Aprovar ou rejeitar anúncios pendentes',
    menuIcon: <LuGrid2X2Check />,
    menuView: <AdsApprovalView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Configurações

  {
    menuId: 'acessos',
    menuName: 'Acessos',
    menuLegend: 'Gerenciamento de acessos ao painel de administrador',
    menuIcon: <LuKeyRound />,
    menuView: <SettingsGeneralView />,
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'minha-conta',
    menuName: 'Minha Conta',
    menuLegend: 'Dados gerais da sua conta',
    menuIcon: <LuCircleUser />,
    menuView: <SettingsGeneralView />,
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: true
  },
  {
    menuId: 'configuracoes',
    menuName: 'Configurações',
    menuLegend: 'Configurações gerais da plataforma',
    menuIcon: <LuSettings />,
    menuView: <SettingsGeneralView />,
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  }
]

export const ADMIN_USER_MENU = [
  {
    menuId: 'minha-conta',
    menuName: 'Minha Conta',
    menuIcon: <LuCircleUser />,
    menuDisabled: false
  },
  {
    menuId: 'configuracoes',
    menuName: 'Configurações',
    menuIcon: <LuSettings />,
    menuDisabled: false
  },
  {
    menuId: 'user_exit',
    menuName: 'Sair',
    menuIcon: <LuLogOut />,
    menuDisabled: false
  }
]

// Função utilitária para obter categorias únicas
export const getMenuCategories = (): string[] => {
  return [...new Set(ADMIN_MENUS.map((menu) => menu.menuCategory))]
}

// Função para formatar os menus no formato do Ant Design
export const formatMenusForAntDesign = (): GetProp<MenuProps, 'items'> => {
  const categories = getMenuCategories()

  return categories
    .map((category) => {
      const visibleMenus = ADMIN_MENUS.filter(
        (menu) => menu.menuCategory === category && !menu.menuHidden
      )

      if (visibleMenus.length === 0) {
        return null
      }

      return {
        key: `category-${category.toLowerCase().replace(' ', '-')}`,
        label: category,
        type: 'group',
        children: visibleMenus.map((menu) => ({
          key: menu.menuId,
          icon: menu.menuIcon,
          label: menu.menuName,
          disabled: menu.menuDisabled,
          title: menu.menuLegend
        }))
      }
    })
    .filter((item) => item !== null) as GetProp<MenuProps, 'items'>
}
