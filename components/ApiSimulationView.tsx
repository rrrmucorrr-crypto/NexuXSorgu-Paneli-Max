'use client';

import React, { useState } from 'react';
import { Server, Play, CheckCircle2, AlertCircle, RefreshCw, Code } from 'lucide-react';

interface ApiEndpointItem {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  roleRequired: string;
  sampleBody?: Record<string, any>;
}

const API_ENDPOINTS: ApiEndpointItem[] = [
  {
    method: 'GET',
    path: '/api/queries/catalog',
    description: '12 kategori ve 101 sorgunun tam katalog şemasını ve doğrulama durumunu getirir.',
    roleRequired: 'PUBLIC / FREE',
  },
  {
    method: 'POST',
    path: '/api/queries/run',
    description: 'Sunucu tarafında sentetik veri motorunu çalıştırır ve şemayı onaylar.',
    roleRequired: 'ROLE_BASED',
    sampleBody: {
      queryId: 'q-kimlik-ad-soyad',
      userRole: 'ADMIN',
      inputs: { ad: 'Can', soyad: 'Yılmaz', il: 'İstanbul' },
    },
  },
  {
    method: 'GET',
    path: '/api/admin/health',
    description: 'MySQL bağlantı havuzu, uptime ve bileşen sağlık durumunu döndürür.',
    roleRequired: 'ADMIN',
  },
];

async function sendApiTestRequest(endpoint: ApiEndpointItem): Promise<{
  statusText: string;
  json: any;
}> {
  const startTime = Date.now();
  try {
    let res: Response;
    if (endpoint.method === 'GET') {
      res = await fetch(endpoint.path);
    } else {
      res = await fetch(endpoint.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint.sampleBody || {}),
      });
    }

    const dur = Date.now() - startTime;
    const json = await res.json();
    return {
      statusText: `${res.status} ${res.statusText} (${dur} ms)`,
      json,
    };
  } catch (err) {
    return {
      statusText: 'Bağlantı hatası',
      json: { error: true, message: String(err) },
    };
  }
}

export const ApiSimulationView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpointItem>(API_ENDPOINTS[0]);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>('Hazır');

  const handleTestEndpoint = async (endpoint: ApiEndpointItem) => {
    setActiveEndpoint(endpoint);
    setLoading(true);
    setStatusText('İstek gönderiliyor...');
    const result = await sendApiTestRequest(endpoint);
    setResponseJson(result.json);
    setStatusText(result.statusText);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#252A35] pb-5">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-[#84D9FF]" />
          <span className="font-mono text-xs font-bold text-[#84D9FF]">RESTFUL API SUITE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
          Backend API Simülasyon Konsolu
        </h1>
        <p className="text-xs text-[#A0A8B7] mt-1">
          Şartnamede tanımlanan Next.js sunucu uç noktalarını canlı olarak test edin ve JSON yanıtlarını inceleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoints List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#A0A8B7] uppercase tracking-wider">
            Kullanılabilir Uç Noktalar ({API_ENDPOINTS.length})
          </h3>
          <div className="space-y-2">
            {API_ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  activeEndpoint.path === ep.path
                    ? 'border-[#C8103D]/60 bg-[#151923]'
                    : 'border-[#252A35] bg-[#10131A] hover:border-[#252A35]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`rounded px-2 py-0.5 font-bold ${
                        ep.method === 'GET'
                          ? 'bg-[#84D9FF]/10 text-[#84D9FF] border border-[#84D9FF]/20'
                          : 'bg-[#F0204F]/10 text-[#F0204F] border border-[#F0204F]/20'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-semibold text-white">{ep.path}</span>
                  </div>
                  <span className="text-[10px] text-[#A0A8B7] font-mono">
                    {ep.roleRequired}
                  </span>
                </div>
                <p className="text-xs text-[#A0A8B7] mb-3">{ep.description}</p>
                <button
                  onClick={() => handleTestEndpoint(ep)}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-[#C8103D]/20 border border-[#C8103D]/40 px-3 py-1.5 text-xs font-bold text-[#F0204F] hover:bg-[#C8103D]/30 transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Şimdi Test Et</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Console Response Window */}
        <div className="rounded-2xl border border-[#252A35] bg-[#090C12] p-4 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Code className="h-4 w-4 text-[#84D9FF]" />
              <span className="text-white font-bold">API Yanıtı</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">{statusText}</span>
          </div>

          <div className="flex-1 overflow-auto rounded-lg bg-[#050609] p-3 border border-[#252A35]/40 font-mono text-xs text-[#84D9FF] leading-relaxed">
            {loading ? (
              <div className="flex items-center justify-center h-full text-[#A0A8B7] gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#F0204F]" />
                <span>İstek sunucuya iletiliyor...</span>
              </div>
            ) : responseJson ? (
              <pre>{JSON.stringify(responseJson, null, 2)}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#A0A8B7]">
                <span>Soldaki uç noktalardan birine tıklayarak testi başlatın.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
