'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { LayoutDashboard, Handshake, FileText, Wallet, Settings, LogOut, Sparkles } from 'lucide-react'
import { Command } from 'cmdk'

// Asset URLs from the latest Figma Design (47:4088)
const imgLogo = "https://www.figma.com/api/mcp/asset/a32df1a4-14a5-41e2-a277-96f0831aa81f";
const imgSvgAI = "/icons/ai.svg";
const imgSvgLogout = "/icons/logout.svg";
const imgSvgConfig = "/icons/config.svg";
const imgSvgProcessos = "/icons/processos.svg";
const imgSvgFinanceiro = "/icons/financeiro.svg";
const imgSvgClientes = "/icons/clientes.svg";
const imgSvgDashboard = "/icons/dashboard.svg";
const imgFrame = "https://www.figma.com/api/mcp/asset/5958c5e7-594c-4efa-9de4-a1cb69cbbde6"; // Search icon frame
const imgVector = "https://www.figma.com/api/mcp/asset/313651dc-b2ea-45a3-8c7c-73507a429ed3"; // Search icon vector
const imgSvgNotifications = "https://www.figma.com/api/mcp/asset/4dd9b3ad-bb1a-444a-abe6-2ecc27108e4e";

// Metrics Icons
const imgSvgProcessosRisco = "https://www.figma.com/api/mcp/asset/b19f9dd6-2848-474f-b30e-cd57e789561a";
const imgSvgValorCausa = "https://www.figma.com/api/mcp/asset/d5ec1f92-3872-4c33-99b4-056d1a3489a8";
const imgSvgMovimentacoes = "https://www.figma.com/api/mcp/asset/ec40b17a-f87e-4d53-b0cb-daf4287033db";
const imgSvgReceita = "https://www.figma.com/api/mcp/asset/e88e8b60-040b-4f40-be43-2f56bc1a1239";
const imgSvgDespesas = "https://www.figma.com/api/mcp/asset/6d2ee7ec-4ef4-4901-8ff2-ce1e0202293d";

// Quick Action Icons
const imgSvgActionProcesso = "https://www.figma.com/api/mcp/asset/29bd20cb-78b9-44bd-8dff-2d4a03a389d7";
const imgSvgActionReembolso = "https://www.figma.com/api/mcp/asset/2693cc11-2d94-4dfa-a118-9c7a9bd7dd1d"; // Same as valor causa in design context but different usage? Check URLs. 
// Actually Figma context lists:
// 232:4504 -> imgSvg13 (Action Processo) -> 29bd20cb...
// 232:4513 -> imgSvg12 (Action Reembolso - Reuse?) -> NO, context says imgSvg12 is Despesas (6d2ee...). Wait, context says imgSvg12 for 232:4514. Let's verify.
// Context: "const imgSvg12 = ...6d2ee..."
// Context: Reembolso icon src={imgSvg12}. So it reuses Despesas icon? Let's double check.
// Context: Action Processo uses imgSvg13 -> 29bd20cb...
// Context: Analise Receita uses imgSvg14 -> 2693cc11...
// Context: Ultimas Transacoes uses imgSvg15 -> b62ec189...
// Context: Relatorio Processos uses imgSvg16 -> 54b143ea...

const imgSvgActionAnalise = "https://www.figma.com/api/mcp/asset/2693cc11-2d94-4dfa-a118-9c7a9bd7dd1d";
const imgSvgActionTransacoes = "https://www.figma.com/api/mcp/asset/b62ec189-f560-4d5c-b5a4-748bd7bc8d63";
const imgSvgActionRelatorio = "https://www.figma.com/api/mcp/asset/54b143ea-7c64-47c2-b5ef-46428dbe8f4e";

type TrialButtonProps = {
  className?: string;
}

function TrialButton({ className }: TrialButtonProps) {
  return (
    <div className={className}>
      <div className="flex flex-col font-serif justify-center text-[#878787] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Pro trial - 14 days left</p>
      </div>
    </div>
  );
}

// Search result type
type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: 'metric' | 'action' | 'page';
  icon?: string;
}

// Searchable content database - Updated to match new design
const searchableContent: SearchResult[] = [
  { id: '1', title: 'Processos em risco', description: 'Próximos 7 dias - 0', type: 'metric', icon: imgSvgProcessosRisco },
  { id: '2', title: 'Valor Total da Causa', description: 'Soma de processos ativos - R$ 11.5M', type: 'metric', icon: imgSvgValorCausa },
  { id: '3', title: 'Movimentações Recentes', description: 'Últimas 48 horas - 4', type: 'metric', icon: imgSvgMovimentacoes },
  { id: '4', title: 'Receita Estimada', description: 'Baseado em ~10% do valor - R$ 1.15M', type: 'metric', icon: imgSvgReceita },
  { id: '5', title: 'Despesas comprometidas', description: 'Próximos 30 dias - R$ 9.200', type: 'metric', icon: imgSvgDespesas },
  { id: '6', title: 'Novo Processo', description: 'Cadastrar novo processo', type: 'action', icon: imgSvgActionProcesso },
  { id: '7', title: 'Novo Reembolso', description: 'Solicitar reembolso', type: 'action', icon: imgSvgDespesas },
  { id: '8', title: 'Análise de Receita', description: 'Ver análise detalhada', type: 'action', icon: imgSvgActionAnalise },
  { id: '9', title: 'Dashboard', description: 'Ir para Dashboard', type: 'page', icon: imgSvgDashboard },
  { id: '10', title: 'Clientes', description: 'Gerenciar clientes', type: 'page', icon: imgSvgClientes },
  { id: '11', title: 'Processos', description: 'Gerenciar processos', type: 'page', icon: imgSvgProcessos },
];

// Helper function to get color for percentage values
const getPercentageColor = (percentage: string): string => {
  const numValue = parseFloat(percentage.replace(/[+%]/g, ''));
  return numValue >= 0 ? '#00875A' : '#FF2A00';
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [openCommandPalette, setOpenCommandPalette] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Dynamic greeting based on user's timezone
  const [greeting, setGreeting] = useState('Boa noite');
  const [userName, setUserName] = useState('Roni');

  // Function to get appropriate greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Update greeting based on time
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Cmd+K keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommandPalette((open) => !open);
      }
      // Close on Escape
      if (e.key === 'Escape') {
        setOpenCommandPalette(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = searchableContent.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(results);
    setShowResults(true);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected:', result);
    if (result.type === 'page') {
      setActivePage(result.title);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <>
      {/* Command Palette */}
      {openCommandPalette && (
        <div 
          className="fixed inset-0 z-[200] bg-black/50 flex items-start justify-center pt-[20vh]"
          onClick={() => setOpenCommandPalette(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Command className="w-full max-w-[640px] bg-white border border-[#dbdad7] shadow-lg rounded-lg overflow-hidden">
              <Command.Input 
                placeholder="Search processos, finance, settings..."
                className="w-full px-4 py-3 text-[14px] outline-none border-b border-[#dbdad7]"
                autoFocus
              />
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center text-[#666] text-sm">
                  No results found.
                </Command.Empty>
                
                <Command.Group heading="Navigation">
                  <Command.Item
                    value="processos"
                    onSelect={() => {
                      setActivePage('Processos');
                      setOpenCommandPalette(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer hover:bg-[#f3f2f2] transition-colors data-[selected]:bg-[#f3f2f2]"
                  >
                    <FileText className="size-4 text-[#666666]" />
                    <span className="text-[14px] text-[#262626]">Processos</span>
                  </Command.Item>
                  
                  <Command.Item
                    value="finance"
                    onSelect={() => {
                      setActivePage('Financeiro');
                      setOpenCommandPalette(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer hover:bg-[#f3f2f2] transition-colors data-[selected]:bg-[#f3f2f2]"
                  >
                    <Wallet className="size-4 text-[#666666]" />
                    <span className="text-[14px] text-[#262626]">Finance</span>
                  </Command.Item>
                  
                  <Command.Item
                    value="settings"
                    onSelect={() => {
                      setActivePage('Configurações');
                      setOpenCommandPalette(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer hover:bg-[#f3f2f2] transition-colors data-[selected]:bg-[#f3f2f2]"
                  >
                    <Settings className="size-4 text-[#666666]" />
                    <span className="text-[14px] text-[#262626]">Settings</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}

      <div className="bg-white flex items-start justify-center min-h-screen w-full font-serif">
      {/* Sidebar - Figma Design (60px) */}
      <div className="bg-white flex flex-col h-screen w-[60px] shrink-0 sticky top-0 z-[100] relative border-r border-[#dbdad7]">
        {/* Logo Area */}
        <div className="border-b border-[#dbdad7] h-[70px] flex items-center justify-center shrink-0 relative z-10">
          <button 
            onClick={() => setActivePage('Dashboard')}
            className="relative size-[28px] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to Dashboard"
          >
            <div className="absolute h-[26px] left-[2px] top-px w-[22px]">
              <img alt="Logo" className="w-full h-full object-contain" src={imgLogo} />
            </div>
          </button>
        </div>

        {/* Navigation Menu - Matching Figma Design 14-466 */}
        <div className="flex-1 flex flex-col justify-between py-6 relative z-10 bg-white">
          {/* Top Group: Dashboard, Clientes, Processos, Financeiro - 4 grey icons */}
          <div className="flex flex-col gap-2">
            {[
              { icon: LayoutDashboard, name: 'Dashboard' },
              { icon: Handshake, name: 'Clientes' },
              { icon: FileText, name: 'Processos' },
              { icon: Wallet, name: 'Financeiro' },
            ].map((item) => {
              const isActive = activePage === item.name;
              const IconComponent = item.icon;
              return (
                <div key={item.name} className="group relative flex items-center justify-center w-full">
                  <button 
                    onClick={() => setActivePage(item.name)}
                    className={`h-[40px] w-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#f3f2f2]' : 'hover:bg-[#f3f2f2]'
                    }`}
                  >
                    <IconComponent 
                      className="size-[20px] text-[#666666]"
                      strokeWidth={1.5}
                    />
                  </button>
                  <span className="absolute left-[59px] h-[40px] flex items-center bg-[#f3f2f2] px-4 whitespace-nowrap text-[13px] text-[#262626] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[110] font-hedvig-sans font-normal">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Middle Group: AI Assistente - Orange icon with significant gap */}
          <div className="flex flex-col mt-16">
            <div className="group relative flex items-center justify-center w-full">
              <button 
                onClick={() => setActivePage('AI Assistente')}
                className={`h-[40px] w-full flex items-center justify-center transition-colors ${
                  activePage === 'AI Assistente' ? 'bg-[#f3f2f2]' : 'hover:bg-[#f3f2f2]'
                }`}
              >
                <svg 
                  className="size-[20px] group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-500 ease-out"
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    className="group-hover:fill-[#C96800] transition-colors duration-300"
                    d="M9.18083 2.345C9.21654 2.15384 9.31798 1.98118 9.46758 1.85693C9.61718 1.73268 9.80553 1.66467 10 1.66467C10.1945 1.66467 10.3828 1.73268 10.5324 1.85693C10.682 1.98118 10.7835 2.15384 10.8192 2.345L11.695 6.97667C11.7572 7.30596 11.9172 7.60885 12.1542 7.84581C12.3912 8.08277 12.694 8.2428 13.0233 8.305L17.655 9.18083C17.8462 9.21654 18.0188 9.31798 18.1431 9.46758C18.2673 9.61718 18.3353 9.80553 18.3353 10C18.3353 10.1945 18.2673 10.3828 18.1431 10.5324C18.0188 10.682 17.8462 10.7835 17.655 10.8192L13.0233 11.695C12.694 11.7572 12.3912 11.9172 12.1542 12.1542C11.9172 12.3912 11.7572 12.694 11.695 13.0233L10.8192 17.655C10.7835 17.8462 10.682 18.0188 10.5324 18.1431C10.3828 18.2673 10.1945 18.3353 10 18.3353C9.80553 18.3353 9.61718 18.2673 9.46758 18.1431C9.31798 18.0188 9.21654 17.8462 9.18083 17.655L8.305 13.0233C8.2428 12.694 8.08277 12.3912 7.84581 12.1542C7.60885 11.9172 7.30596 11.7572 6.97667 11.695L2.345 10.8192C2.15384 10.7835 1.98118 10.682 1.85693 10.5324C1.73268 10.3828 1.66467 10.1945 1.66467 10C1.66467 9.80553 1.73268 9.61718 1.85693 9.46758C1.98118 9.31798 2.15384 9.21654 2.345 9.18083L6.97667 8.305C7.30596 8.2428 7.60885 8.08277 7.84581 7.84581C8.08277 7.60885 8.2428 7.30596 8.305 6.97667L9.18083 2.345Z" 
                    stroke="#C96800" 
                    strokeWidth="1.67" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path d="M16.6667 1.66667V5" stroke="#C96800" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.3333 3.33333H15" stroke="#C96800" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33333 18.3333C4.25381 18.3333 5 17.5871 5 16.6667C5 15.7462 4.25381 15 3.33333 15C2.41286 15 1.66667 15.7462 1.66667 16.6667C1.66667 17.5871 2.41286 18.3333 3.33333 18.3333Z" stroke="#C96800" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="absolute left-[59px] h-[40px] flex items-center bg-[#f3f2f2] px-4 whitespace-nowrap text-[13px] text-[#C96800] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[110] font-hedvig-sans font-normal">
                AI Assistente
              </span>
            </div>
          </div>

          {/* Bottom Group: Configurações, Logout - 2 grey icons with significant gap */}
          <div className="flex flex-col gap-2 mt-16">
            {[
              { icon: Settings, name: 'Configurações' },
              { icon: LogOut, name: 'Logout' },
            ].map((item) => {
              const isItemActive = activePage === item.name;
              const IconComponent = item.icon;
              return (
                <div key={item.name} className="group relative flex items-center justify-center w-full">
                  <button 
                    onClick={() => setActivePage(item.name)}
                    className={`h-[40px] w-full flex items-center justify-center transition-colors ${
                      isItemActive ? 'bg-[#f3f2f2]' : 'hover:bg-[#f3f2f2]'
                    }`}
                  >
                    <IconComponent 
                      className="size-[18px] text-[#666666]"
                      strokeWidth={1.5}
                    />
                  </button>
                  <span className="absolute left-[59px] h-[40px] flex items-center bg-[#f3f2f2] px-4 whitespace-nowrap text-[13px] text-[#262626] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[110] font-hedvig-sans font-normal">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header (70px) */}
        <header className="bg-white border-b border-[#dbdad7] h-[70px] flex items-center justify-between px-6 shrink-0 z-40">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2 min-w-[250px] h-[36px] px-3 border border-[#dbdad7] rounded-none focus-within:border-[#4A90E2] transition-all">
              <div className="relative size-[18px] flex items-center justify-center">
                <img alt="" className="size-full" src={imgFrame} />
                <img alt="" className="absolute inset-0 size-full p-[2px]" src={imgVector} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                placeholder="Find anything..."
                className="flex-1 text-[14px] text-[#616161] bg-transparent outline-none placeholder:text-[#616161]"
              />
              <div className="hidden sm:flex items-center gap-1 bg-[#f1f0ee] border border-[#dbdad7] px-1.5 py-0.5 rounded text-[10px] text-[#616161]">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-[#dbdad7] shadow-lg z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-[10px] text-[#666] px-3 py-1 uppercase tracking-wider">
                      {searchResults.length} Results
                    </div>
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-3 py-2 hover:bg-[#f7f7f7] transition-colors flex items-start gap-3 group"
                      >
                        {result.icon && (
                          <img alt="" className="w-4 h-4 mt-1 flex-shrink-0" src={result.icon} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#121212] group-hover:text-[#4A90E2]">
                            {result.title}
                          </div>
                          <div className="text-[11px] text-[#666] line-clamp-1">
                            {result.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery && (
                  <div className="p-4 text-center text-[#666] text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Right Side */}
          <div className="flex items-center gap-4">
            <TrialButton className="border border-[#dbdad7] px-[13px] py-1 h-[32px] rounded-full flex items-center" />
            
            <button className="border border-[#dbdad7] size-[32px] rounded-full flex items-center justify-center hover:bg-gray-50">
              <img alt="Notifications" className="size-[16px]" src={imgSvgNotifications} />
            </button>

            <button className="bg-[#f1f0ee] size-[32px] rounded-full flex items-center justify-center hover:bg-gray-200">
              <span className="text-[12px] text-[#121212] font-medium">R</span>
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-[1200px] pl-[26px] pr-[24px] py-[24px]">
            {/* Greeting Header */}
            <div className="flex flex-col gap-1 mb-8">
              <h1 className="text-[30px] leading-[45px] font-serif flex items-center">
                <span className="text-[#262626]">{greeting} </span>
                <span className="text-[#666666]">{userName},</span>
              </h1>
              <p className="text-[14px] text-[#666] leading-[21px] font-hedvig-sans font-normal">Aqui está o que exige sua atenção hoje</p>
            </div>

            {/* Content Grid - Matching Figma Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 auto-rows-fr">
              
              {/* Row 1 */}
              
              {/* Processos em risco */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col justify-between hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgProcessosRisco} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Processos em risco por prazo</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Próximos 7 dias</span>
                  <span className="text-[32px] text-[#262626] font-serif">0</span>
                </div>
                <button className="text-[12px] text-[#666666] underline text-left font-hedvig-sans font-normal">Revisar processos</button>
              </div>

              {/* Valor Total da Causa */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col justify-between hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgValorCausa} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Valor Total da Causa (Ativos)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Soma de processos ativos</span>
                  <span className="text-[32px] text-[#262626] font-serif">R$ 11.500,6k</span>
                </div>
                <button className="text-[12px] text-left font-hedvig-sans font-normal" style={{ color: '#00875A' }}>6 processos ativos</button>
              </div>

              {/* Movimentações Recentes */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col justify-between hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgMovimentacoes} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Movimentações Recentes</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Últimas 48 horas</span>
                  <span className="text-[32px] text-[#262626] font-serif">4</span>
                </div>
                <button className="text-[12px] text-[#666666] underline text-left font-hedvig-sans font-normal">Ver processos</button>
              </div>

              {/* Row 2 */}

              {/* Receita Estimada */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col justify-between hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgReceita} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Receita Estimada (Honorários)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Baseado em ~10% do valor da causa</span>
                  <span className="text-[32px] text-[#262626] font-serif">R$ 1.150.060,00</span>
                </div>
                <button className="text-[12px] text-[#666666] text-left font-hedvig-sans font-normal">Previsão baseada em ativos</button>
              </div>

              {/* Despesas comprometidas */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col justify-between hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgDespesas} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Despesas comprometidas</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Próximos 30 dias</span>
                  <span className="text-[32px] text-[#262626] font-serif">R$ 9.200</span>
                </div>
                <button className="text-[12px] text-[#666666] text-left font-hedvig-sans font-normal">2 despesas aguardam aprovação</button>
              </div>

              {/* Rentabilidade Chart/List */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] min-h-[186px] p-6 flex flex-col gap-4 hover:border-[#262626] transition-colors group w-full">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgValorCausa} />
                  <span className="text-[12px] text-[#666666] font-hedvig-sans font-normal">Rentabilidade por tipo de processo</span>
                </div>
                <span className="text-[12px] text-[#878787] font-hedvig-sans font-normal">Últimos 12 meses</span>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] text-[#666666] font-hedvig-sans font-normal">Trabalhista:</span>
                    <span className="text-[20px] font-serif" style={{ color: getPercentageColor('+32%') }}>+32%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] text-[#666666] font-hedvig-sans font-normal">Cível:</span>
                    <span className="text-[20px] font-serif" style={{ color: getPercentageColor('+18%') }}>+18%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[16px] text-[#666666] font-hedvig-sans font-normal">Ações Rápidas</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { icon: imgSvgActionProcesso, label: '+ Processo' },
                  { icon: imgSvgDespesas, label: '+ Reembolso' },
                  { icon: imgSvgActionAnalise, label: 'Análise de Receita' },
                  { icon: imgSvgActionTransacoes, label: 'Últimas Transações' },
                  { icon: imgSvgActionRelatorio, label: 'Relatório de Processos' },
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    className="border border-[#dbdad7] rounded-[6px] flex items-center gap-2 px-[17px] py-[13px] hover:border-[#262626] transition-colors whitespace-nowrap bg-white group"
                  >
                    <img alt="" className="size-[16px]" src={action.icon} />
                    <span className="text-[14px] text-[#666] group-hover:text-[#262626] font-hedvig-sans font-normal">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}
