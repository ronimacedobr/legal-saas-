'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

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
    <div 
      className={className}
      style={{ 
        backgroundColor: 'white',
        background: 'white',
        backgroundImage: 'none',
        backgroundSize: 'auto',
        boxShadow: 'none'
      }}
    >
      <div className="flex flex-col font-sans justify-center text-[#878787] text-[12px] text-center whitespace-nowrap">
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

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Dynamic greeting based on user's timezone
  const [greeting, setGreeting] = useState('Good Morning');
  const [userName, setUserName] = useState('Roni');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

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

  // Typing animation effect
  useEffect(() => {
    const fullText = `${greeting} ${userName},`;
    let currentIndex = 0;
    
    const typingDuration = 1000; // 1 second
    const charDelay = typingDuration / fullText.length;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, charDelay);
    
    return () => {
      clearInterval(typingInterval);
      setIsTyping(true);
      setDisplayedText('');
    };
  }, [greeting, userName]);

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
    <div className="bg-white flex items-start justify-center min-h-screen w-full font-sans">
      {/* Sidebar - Figma Design (60px) */}
      <div className="bg-white flex flex-col h-screen w-[60px] shrink-0 sticky top-0 z-[100] relative border-r border-[#dbdad7]">
        {/* Logo Area */}
        <div className="border-b border-[#dbdad7] h-[70px] flex items-center justify-center shrink-0 relative z-10">
          <div className="relative size-[28px]">
            <div className="absolute h-[26px] left-[2px] top-px w-[22px]">
              <img alt="Logo" className="w-full h-full object-contain" src={imgLogo} />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col justify-between py-6 relative z-10 bg-white">
          <div className="flex flex-col gap-2">
            {[
              { icon: imgSvgDashboard, name: 'Dashboard' },
              { icon: imgSvgClientes, name: 'Clientes' },
              { icon: imgSvgFinanceiro, name: 'Financeiro' },
              { icon: imgSvgProcessos, name: 'Processos' },
              { icon: imgSvgAI, name: 'AI Assistente' },
            ].map((item) => (
              <div key={item.name} className="group relative flex items-center justify-center w-full">
                <button 
                  onClick={() => setActivePage(item.name)}
                  className={`h-[40px] w-full flex items-center justify-center transition-colors ${activePage === item.name ? 'bg-[#f3f2f2]' : 'group-hover:bg-[#f3f2f2]'}`}
                >
                  <img 
                    className={`size-[20px] transition-all ${activePage === item.name ? '[filter:brightness(0)_invert(0.15)]' : 'group-hover:[filter:brightness(0)_invert(0.15)]'}`} 
                    alt={item.name} 
                    src={item.icon} 
                  />
                </button>
                <span className="absolute left-[59px] h-[40px] flex items-center bg-[#f3f2f2] px-4 whitespace-nowrap text-[13px] text-[#262626] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[110]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {[
              { icon: imgSvgConfig, name: 'Configurações', size: '18px' },
              { icon: imgSvgLogout, name: 'Logout', size: '18px' },
            ].map((item) => (
              <div key={item.name} className="group relative flex items-center justify-center w-full">
                <button 
                  onClick={() => setActivePage(item.name)}
                  className={`h-[40px] w-full flex items-center justify-center transition-colors ${activePage === item.name ? 'bg-[#f3f2f2]' : 'group-hover:bg-[#f3f2f2]'}`}
                >
                  <img 
                    style={{ width: item.size, height: item.size }} 
                    className={`transition-all ${activePage === item.name ? '[filter:brightness(0)_invert(0.15)]' : 'group-hover:[filter:brightness(0)_invert(0.15)]'}`}
                    alt={item.name} 
                    src={item.icon} 
                  />
                </button>
                <span className="absolute left-[59px] h-[40px] flex items-center bg-[#f3f2f2] px-4 whitespace-nowrap text-[13px] text-[#262626] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[110]">
                  {item.name}
                </span>
              </div>
            ))}
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
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Greeting Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-[30px] leading-[45px] font-serif text-[#121212]">
                {displayedText.includes(userName) ? (
                  <>
                    <span>{displayedText.split(userName)[0]}</span>
                    <span className="text-[#666]">{userName}{displayedText.split(userName)[1]}</span>
                  </>
                ) : (
                  <span>{displayedText}</span>
                )}
                {isTyping && <span className="inline-block w-[2px] h-[28px] bg-[#121212] ml-1 animate-pulse align-middle"></span>}
              </h1>
              <p className="text-[14px] text-[#666] leading-[21px]">Aqui está o que exige sua atenção hoje</p>
            </div>

            {/* Content Grid - Matching Figma Layout */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* Row 1 */}
              
              {/* Processos em risco */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col justify-between hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgProcessosRisco} />
                  <span className="text-[12px] text-[#666]">Processos em risco por prazo</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787]">Próximos 7 dias</span>
                  <span className="text-[32px] text-[#121212] font-serif">0</span>
                </div>
                <button className="text-[12px] text-[#666] underline text-left">Revisar processos</button>
              </div>

              {/* Valor Total da Causa */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col justify-between hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgValorCausa} />
                  <span className="text-[12px] text-[#666]">Valor Total da Causa (Ativos)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787]">Soma de processos ativos</span>
                  <span className="text-[32px] text-[#121212] font-serif">R$ 11.500,6k</span>
                </div>
                <button className="text-[12px] text-[#00875a] text-left">6 processos ativos</button>
              </div>

              {/* Movimentações Recentes */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col justify-between hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgMovimentacoes} />
                  <span className="text-[12px] text-[#666]">Movimentações Recentes</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787]">Últimas 48 horas</span>
                  <span className="text-[32px] text-[#121212] font-serif">4</span>
                </div>
                <button className="text-[12px] text-[#666] underline text-left">Ver processos</button>
              </div>

              {/* Row 2 */}

              {/* Receita Estimada */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col justify-between hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgReceita} />
                  <span className="text-[12px] text-[#666]">Receita Estimada (Honorários)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787]">Baseado em ~10% do valor da causa</span>
                  <span className="text-[32px] text-[#121212] font-serif">R$ 1.150.060,00</span>
                </div>
                <button className="text-[12px] text-[#666] text-left">Previsão baseada em ativos</button>
              </div>

              {/* Despesas comprometidas */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col justify-between hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgDespesas} />
                  <span className="text-[12px] text-[#666]">Despesas comprometidas</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#878787]">Próximos 30 dias</span>
                  <span className="text-[32px] text-[#121212] font-serif">R$ 9.200</span>
                </div>
                <button className="text-[12px] text-[#666] text-left">2 despesas aguardam aprovação</button>
              </div>

              {/* Rentabilidade Chart/List */}
              <div className="bg-white border border-[#dbdad7] rounded-[8px] h-[186px] p-6 flex flex-col gap-4 hover:border-[#4A90E2] transition-colors group">
                <div className="flex gap-2 items-center">
                  <img alt="" className="size-4" src={imgSvgValorCausa} />
                  <span className="text-[12px] text-[#666]">Rentabilidade por tipo de processo</span>
                </div>
                <span className="text-[12px] text-[#878787]">Últimos 12 meses</span>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] text-[#666]">Trabalhista:</span>
                    <span className="text-[20px] text-[#00875a] font-serif">+32%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] text-[#666]">Cível:</span>
                    <span className="text-[20px] text-[#00875a] font-serif">+18%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4 mt-4">
              <h2 className="text-[16px] text-[#121212]">Ações Rápidas</h2>
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
                    className="border border-[#dbdad7] rounded-[6px] flex items-center gap-2 px-[17px] py-[13px] hover:bg-gray-50 transition-colors whitespace-nowrap bg-white"
                  >
                    <img alt="" className="size-[16px]" src={action.icon} />
                    <span className="text-[14px] text-[#666]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
