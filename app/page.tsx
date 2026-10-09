'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { QueryCenterView } from '@/components/QueryCenterView';
import { QueryRunnerView } from '@/components/QueryRunnerView';
import { HistoryView } from '@/components/HistoryView';
import { SavedResultsView } from '@/components/SavedResultsView';
import { PackagesView } from '@/components/PackagesView';
import { ProfileView } from '@/components/ProfileView';
import { KeyManagementView } from '@/components/KeyManagementView';
import { UserManagementView } from '@/components/UserManagementView';
import { AdminDashboardView } from '@/components/AdminDashboardView';
import { AuditLogsView } from '@/components/AuditLogsView';
import { MockEngineControlView } from '@/components/MockEngineControlView';
import { ApiSimulationView } from '@/components/ApiSimulationView';
import { SupportView } from '@/components/SupportView';
import { LockedModal } from '@/components/LockedModal';
import { ActivateKeyModal } from '@/components/ActivateKeyModal';
import {
  StorageAPI,
  useCurrentUser,
  useHistory,
  useSavedResults,
  useAccessKeys,
  useAllUsers,
  useNotifications,
  useEngineSettings,
} from '@/lib/storage';
import { QUERIES, validateCatalog } from '@/lib/catalog';
import {
  UserRole,
  HistoryRecord,
  QueryDefinition,
} from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const savedResults = useSavedResults();
  const keys = useAccessKeys();
  const users = useAllUsers();
  const notifications = useNotifications();
  const settings = useEngineSettings();

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // UI state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [lockedQueryTarget, setLockedQueryTarget] = useState<QueryDefinition | null>(null);

  // Validate catalog on start
  useEffect(() => {
    const validation = validateCatalog();
    if (!validation.isValid) {
      console.error('Catalog verification failure:', validation);
    }
  }, []);

  // Navigation dispatcher
  const handleNavigate = (view: string, queryId?: string, categoryId?: string) => {
    setCurrentView(view);
    if (queryId) setSelectedQueryId(queryId);
    if (categoryId) setSelectedCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQueryFromCatalog = (queryId: string) => {
    setSelectedQueryId(queryId);
    setCurrentView('query-runner');
  };

  const handleLockedQueryClick = (query: QueryDefinition) => {
    setLockedQueryTarget(query);
  };

  const handleRoleSwitch = (role: UserRole) => {
    StorageAPI.switchRole(role);
  };

  const handleNotificationRead = (id: string) => {
    StorageAPI.markNotificationRead(id);
  };

  const handleHistorySelect = (item: HistoryRecord) => {
    setSelectedQueryId(item.queryId);
    setCurrentView('query-runner');
  };

  const handleClearHistory = () => {
    StorageAPI.clearHistory();
  };

  const activeQueryDef = selectedQueryId
    ? QUERIES.find((q) => q.id === selectedQueryId) || QUERIES[0]
    : QUERIES[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#050609] text-[#F0F2F6]">
      {/* MAINTENANCE MODE ALERT BANNER */}
      {settings.maintenanceMode && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-[#C8103D] py-1.5 px-4 text-xs font-bold text-white shadow-md font-mono">
          <AlertTriangle className="h-4 w-4" />
          <span>SİSTEM BAKIM MODUNDA · YALNIZCA YÖNETİCİ TESTLERİ AKTİF</span>
        </div>
      )}

      {/* TOPBAR */}
      <Header
        currentUser={currentUser}
        onUserChange={(u) => StorageAPI.setCurrentUser(u)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        notifications={notifications}
        onMarkNotificationRead={handleNotificationRead}
        onNavigate={(v) => handleNavigate(v)}
      />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar
          currentView={currentView}
          selectedQueryId={selectedQueryId}
          selectedCategory={selectedCategory}
          onNavigate={handleNavigate}
          userRole={currentUser.role}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* VIEW ROUTER */}
            {currentView === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                history={history}
                onNavigate={handleNavigate}
                onOpenKeyModal={() => setIsKeyModalOpen(true)}
              />
            )}

            {currentView === 'query-center' && (
              <QueryCenterView
                userRole={currentUser.role}
                selectedCategory={selectedCategory}
                onSelectQuery={handleSelectQueryFromCatalog}
                onLockedClick={handleLockedQueryClick}
                history={history}
              />
            )}

            {currentView === 'query-runner' && (
              <QueryRunnerView
                query={activeQueryDef}
                currentUser={currentUser}
                onBack={() => handleNavigate('query-center')}
                onSaveResult={(item) => {
                  StorageAPI.saveResult(item);
                }}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                history={history}
                onSelectHistoryItem={handleHistorySelect}
                onClearHistory={handleClearHistory}
              />
            )}

            {currentView === 'saved-results' && (
              <SavedResultsView
                savedResults={savedResults}
                onOpenResult={(item) => {
                  setSelectedQueryId(item.queryId);
                  setCurrentView('query-runner');
                }}
                onRemoveResult={(id) => {
                  StorageAPI.removeSavedResult(id);
                }}
              />
            )}

            {currentView === 'packages' && (
              <PackagesView
                currentRole={currentUser.role}
                onOpenKeyModal={() => setIsKeyModalOpen(true)}
                onSelectRoleDemo={handleRoleSwitch}
              />
            )}

            {currentView === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUserUpdate={(u) => StorageAPI.setCurrentUser(u)}
              />
            )}

            {currentView === 'key-management' && (
              <KeyManagementView
                keys={keys}
                onKeysUpdate={(k) => StorageAPI.setAccessKeys(k)}
              />
            )}

            {currentView === 'user-management' && (
              <UserManagementView
                users={users}
                onUsersUpdate={(u) => StorageAPI.setAllUsers(u)}
              />
            )}

            {currentView === 'admin-dashboard' && (
              <AdminDashboardView onNavigate={handleNavigate} />
            )}

            {currentView === 'audit-logs' && <AuditLogsView />}

            {currentView === 'mock-controls' && <MockEngineControlView />}

            {currentView === 'api-simulation' && <ApiSimulationView />}

            {currentView === 'support' && (
              <SupportView currentUser={currentUser} />
            )}
          </div>
        </main>
      </div>

      {/* LOCKED QUERY MODAL */}
      {lockedQueryTarget && (
        <LockedModal
          query={lockedQueryTarget}
          currentUserRole={currentUser.role}
          onClose={() => setLockedQueryTarget(null)}
          onOpenKeyModal={() => {
            setLockedQueryTarget(null);
            setIsKeyModalOpen(true);
          }}
          onSwitchRoleDemo={(r) => {
            handleRoleSwitch(r);
            setLockedQueryTarget(null);
            setSelectedQueryId(lockedQueryTarget.id);
            setCurrentView('query-runner');
          }}
        />
      )}

      {/* ACTIVATE KEY MODAL */}
      {isKeyModalOpen && (
        <ActivateKeyModal
          onClose={() => setIsKeyModalOpen(false)}
          onSuccess={(u) => {
            StorageAPI.setCurrentUser(u);
          }}
        />
      )}
    </div>
  );
}
