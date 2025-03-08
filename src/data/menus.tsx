// src/data/menus.ts
import { ReactNode } from 'react'
import { GetProp, MenuProps } from 'antd'

import {
  LuChartColumnBig,
  LuCheck,
  LuCircleUser,
  LuFileText,
  LuGrid2X2,
  LuGrid2X2Check,
  LuHouse,
  LuImage,
  LuKeyRound,
  LuList,
  LuLogOut,
  LuMail,
  LuMegaphone,
  LuMessageSquare,
  LuSettings,
  LuShield,
  LuTrophy,
  LuUsers
} from 'react-icons/lu'

// Componentes das Views (placeholders por enquanto)
import HomeView from '@/screens/DashboardScreen/views/Home'
import UsersListView from '@/screens/DashboardScreen/views/UsersList'
import AdsListView from '@/screens/DashboardScreen/views/AdsList'
import AdsApprovalView from '@/screens/DashboardScreen/views/AdsApproval'
import BannersManagementView from '@/screens/DashboardScreen/views/BannersManagement'
import AdvertisingManagementView from '@/screens/DashboardScreen/views/AdvertisingManagement'
import ReportsUsersView from '@/screens/DashboardScreen/views/ReportsUsers'
import ReportsAdsView from '@/screens/DashboardScreen/views/ReportsAds'
import SettingsGeneralView from '@/screens/DashboardScreen/views/SettingsGeneral'
import ChatsManagementView from '@/screens/DashboardScreen/views/ChatsManagement'
import TournamentsManagementView from '@/screens/DashboardScreen/views/TournamentsManagement'
import AccessManagementView from '@/screens/DashboardScreen/views/AccessManagement'
import TermsManagementView from '@/screens/DashboardScreen/views/TermsManagement'
import SecuritySettingsView from '@/screens/DashboardScreen/views/SecuritySettings'
import NotificationsManagementView from '@/screens/DashboardScreen/views/NotificationsManagement'
import MyAccountView from '@/screens/DashboardScreen/views/MyAccount'

import { SettingsProvider } from '@/contexts/SettingsProvider'
import { UsersProvider } from '@/contexts/UsersProvider'
import { AdsProvider } from '@/contexts/AdsProvider'

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
  //   {
  //     menuId: 'engajamento-relatorios',
  //     menuName: 'Relatório de Engajamento',
  //     menuLegend: 'Análise de interações e chats',
  //     menuIcon: <LuChartColumnBig />,
  //     // menuView: <ReportsEngagementView />,
  //     menuView: <></>,
  //     menuCategory: 'Relatórios',
  //     menuDisabled: true,
  //     menuHidden: false
  //   },

  // Categoria: Estilizações
  {
    menuId: 'banners',
    menuName: 'Banners',
    menuLegend: 'Gerenciar banners promocionais na plataforma',
    menuIcon: <LuImage />,
    menuView: <BannersManagementView />,
    menuCategory: 'Layout',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'publicidade',
    menuName: 'Publicidade',
    menuLegend: 'Gerenciar campanhas publicitárias na plataforma',
    menuIcon: <LuMegaphone />,
    menuView: <AdvertisingManagementView />,
    menuCategory: 'Layout',
    menuDisabled: false,
    menuHidden: false
  },

  // Categoria: Gerenciamento
  {
    menuId: 'usuarios',
    menuName: 'Usuários',
    menuLegend: 'Gerenciar usuários da plataforma',
    menuIcon: <LuUsers />,
    menuView: (
      <UsersProvider>
        <UsersListView />
      </UsersProvider>
    ),
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'anuncios',
    menuName: 'Anúncios',
    menuLegend: 'Gerenciar todos os anúncios',
    menuIcon: <LuList />,
    menuView: (
      <AdsProvider>
        <AdsListView />
      </AdsProvider>
    ),
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'aprovacao-anuncios',
    menuName: 'Aprovação de Anúncios',
    menuLegend: 'Aprovar anúncios pendentes',
    menuIcon: <LuCheck />,
    menuView: (
      <AdsProvider>
        <AdsApprovalView />
      </AdsProvider>
    ),
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'conversas',
    menuName: 'Conversas',
    menuLegend: 'Monitorar e gerenciar chats entre usuários',
    menuIcon: <LuMessageSquare />,
    menuView: <ChatsManagementView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'torneios',
    menuName: 'Torneios',
    menuLegend: 'Gerenciar lista de torneios para o centro de interesse',
    menuIcon: <LuTrophy />,
    menuView: <TournamentsManagementView />,
    menuCategory: 'Gerenciamento',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'notificacoes',
    menuName: 'Notificações',
    menuLegend: 'Gerenciar templates de notificações',
    menuIcon: <LuMail />,
    menuView: <NotificationsManagementView />,

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
    menuView: (
      <SettingsProvider>
        <AccessManagementView />
      </SettingsProvider>
    ),
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'seguranca',
    menuName: 'Segurança',
    menuLegend: 'Configurações de segurança e privacidade',
    menuIcon: <LuShield />,
    menuView: <SecuritySettingsView />,

    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'termos',
    menuName: 'Termos e Políticas',
    menuLegend: 'Gerenciar termos de uso e políticas',
    menuIcon: <LuFileText />,
    menuView: <TermsManagementView />,

    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: false
  },
  {
    menuId: 'configuracoes',
    menuName: 'Configurações Gerais',
    menuLegend: 'Configurações gerais da plataforma',
    menuIcon: <LuSettings />,
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
    menuView: <MyAccountView />,
    menuCategory: 'Configurações',
    menuDisabled: false,
    menuHidden: true
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
          title: menu.menuName
        }))
      }
    })
    .filter((item) => item !== null) as GetProp<MenuProps, 'items'>
}
