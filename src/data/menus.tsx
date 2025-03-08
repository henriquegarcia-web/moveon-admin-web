// src/data/menus.ts
import { ReactNode } from 'react'
import {
  HomeOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ShoppingOutlined,
  CheckSquareOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

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
export const adminMenus: IMenu[] = [
  // Categoria: Principal
  {
    menuId: 'inicio',
    menuName: 'Início',
    menuLegend: 'Visão geral do dashboard',
    menuIcon: <HomeOutlined />,
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
    menuIcon: <BarChartOutlined />,
    menuView: <ReportsUsersView />,
    menuCategory: 'Relatórios',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios-relatorios',
    menuName: 'Relatório de Anúncios',
    menuLegend: 'Estatísticas de anúncios publicados',
    menuIcon: <BarChartOutlined />,
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
    menuIcon: <AppstoreOutlined />,
    menuView: <CategoriesManagementView />,
    menuCategory: 'Dados',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'esportes',
    menuName: 'Esportes',
    menuLegend: 'Gerenciar lista de esportes disponíveis',
    menuIcon: <DatabaseOutlined />,
    menuView: <SportsManagementView />,
    menuCategory: 'Dados',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'condicoes',
    menuName: 'Condições',
    menuLegend: 'Gerenciar estados dos produtos',
    menuIcon: <DatabaseOutlined />,
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
    menuIcon: <UserOutlined />,
    menuView: <UsersListView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios',
    menuName: 'Anúncios',
    menuLegend: 'Listagem de todos os anúncios',
    menuIcon: <ShoppingOutlined />,
    menuView: <AdsListView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios-aprovacao',
    menuName: 'Aprovação de Anúncios',
    menuLegend: 'Aprovar ou rejeitar anúncios pendentes',
    menuIcon: <CheckSquareOutlined />,
    menuView: <AdsApprovalView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Configurações
  {
    menuId: 'configuracoes',
    menuName: 'Configurações',
    menuLegend: 'Configurações gerais da plataforma',
    menuIcon: <SettingOutlined />,
    menuView: <SettingsGeneralView />,
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  }
]

// Função utilitária para obter categorias únicas
export const getMenuCategories = (): string[] => {
  return [...new Set(adminMenus.map((menu) => menu.menuCategory))]
}
